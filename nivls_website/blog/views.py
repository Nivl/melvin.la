# -*- coding: utf-8 -*-
import datetime
from django.db.models import Q
from django.template import RequestContext
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.shortcuts import render, get_object_or_404
from django.http import Http404, HttpResponse, HttpResponseForbidden
from django.conf import settings
from django.core.urlresolvers import reverse
from django.views.decorators.http import require_safe
from django.utils.translation import ugettext as _
from django.contrib.sites.models import Site
from django.template.defaultfilters import slugify, date as _date
from commons.paginator import simple_paginator
from commons.decorators import ajax_only
from commons.forms import SingleTextareaForm
from commons.views import validate_single_ajax_form
from models import Post, Category, Tag
from forms import *


#
# Helpers
#
def get_post_list(request, **kwargs):
    if request.user.is_superuser:
        post_list = Post.objects.select_related() \
                                .filter(site=Site.objects.get_current(),
                                        **kwargs)
    else:
        post_list = Post.objects.select_related() \
                                .filter(Q(is_public=1) | Q(author=request.user),
                                        site=Site.objects.get_current(),
                                        **kwargs)

    if not post_list:
        raise Http404

    return simple_paginator(post_list, 12, request.GET.get('page'))


def get_post(request, year, month, day, slug, **kwargs):
    kwargs['pub_date__year'] = year
    kwargs['pub_date__month'] = month
    kwargs['pub_date__day'] = day
    kwargs['slug'] = slug
    kwargs['site'] = Site.objects.get_current()

    if request.user.is_superuser:
        post = get_object_or_404(Post,
                                 **kwargs)
    else:
        post = get_object_or_404(Post,
                                 Q(is_public=1) | Q(author=request.user),
                                 **kwargs)
    return post


#
# Views
#
@require_safe
def home(request):
    posts = get_post_list(request)
    return render(request, "blog/home.haml", {"posts": posts})


@require_safe
def display_post(request, year, month, day, slug):
    post = get_post(request, year, month, day, slug)

    storage_key = slugify(post.get_absolute_url())
    form = CommentForm(storage_key, request=request, user=request.user)
    return render(request, "blog/post.haml", {"post": post,
                                              "form": form,
                                              'storage_key': storage_key})


@require_safe
@ajax_only
def comment_list(request, year, month, day, slug):
    post = get_post(request, year, month, day, slug)
    comments = post.get_public_comments()
    return render(request, "blog/ajax/comment_list.haml",
                  {"comments": comments})


@require_safe
@ajax_only
def comment_single(request, year, month, day, slug, pk):
    comment = get_object_or_404(Comment, pk=pk)
    return render(request, "ajax/single_field_value_external.haml",
                  {'value': comment.comment
                   })


@ajax_only
def comment_single_form(request, year, month, day, slug, pk):
    comment = get_object_or_404(Comment, pk=pk)

    if not request.user.is_authenticated() \
            or not (request.user == comment.user
                    or request.user.has_perm('blog.change_comment')):
        return HttpResponseForbidden()

    render_args = {'template_name': "ajax/single_field_form.haml",
               'dictionary': {'id': 'comment-single-form-' + str(pk),
                              'url': reverse('post-comment-single-form', args=[year, month, day, slug, pk])
                              }
                }

    return validate_single_ajax_form(request, comment, 'comment', render_args, SingleTextareaForm)


@require_safe
@ajax_only
def comment_count(request, year, month, day, slug):
    post = get_post(request, year, month, day, slug)
    count = post.count_public_comments()
    return render(request, "blog/ajax/comment_count.haml", {"count": count})


@ajax_only
def comment_form(request, year, month, day, slug):
    post = get_post(request, year, month, day, slug)
    storage_key = slugify(post.get_absolute_url())
    if request.method == 'POST':
        form = CommentForm(storage_key, request.POST, request=request,
                           user=request.user)
        if form.is_valid():
            c = form.save(commit=False)
            c.ip_address = request.META['REMOTE_ADDR']
            c.post = post
            if request.user.is_authenticated():
                c.user = request.user
                c.is_public = True
            c.save()

            subject = _('new comment for "%s"' % post.title)
            text_content = render_to_string(
                'blog/inc/comment_mail.txt',
                {'user': request.user,
                 'comment': c,
                 'post': post},
                RequestContext(request))

            html_content = render_to_string(
                'blog/inc/comment_mail.haml',
                {'user': request.user,
                 'comment': c,
                 'post': post},
                RequestContext(request))

            msg = EmailMultiAlternatives(
                subject,
                text_content,
                settings.EMAIL_NO_REPLY,
                [post.author.email])

            msg.attach_alternative(html_content, 'text/html')
            msg.send(fail_silently=True)

            if request.user.is_authenticated():
                return HttpResponse()
            else:
                return render(request, "blog/ajax/comment_ok.haml")
    else:
        form = CommentForm(storage_key, user=request.user, request=request)
    return render(request, "blog/ajax/comment_form.haml",
                  {'url': post.get_form_url(),
                   'form': form,
                   'storage_key': storage_key,
                   })


@require_safe
def post_list_by_categories(request, slug):
    cat = get_object_or_404(Category, slug=slug, site=Site.objects.get_current())
    cat_list = Category.objects.filter(left__gte=cat.left,
                                       left__lte=cat.right,
                                       site=Site.objects.get_current())
    posts = get_post_list(request, category__in=cat_list)
    return render(
        request,
        'blog/post_list.haml',
        {'posts': posts,
         'obj': {'name': cat.name,
                 'feed': cat.get_feed_url(),
                 'url': cat.get_absolute_url(),
                 'seo': cat.seo}
          })


@require_safe
def post_list_by_tags(request, slug):
    tag = get_object_or_404(Tag, slug=slug, site=Site.objects.get_current())
    posts = get_post_list(request, tags=tag)
    return render(request,
                  'blog/post_list.haml',
                  {'posts': posts,
                  'obj': {'name': tag.name,
                          'feed': tag.get_feed_url(),
                          'url': tag.get_absolute_url(),
                          'seo': tag.seo}
                   })


@require_safe
def post_list_by_archives(request, year, month=None, day=None):
    kwargs = {}
    if year and month and day:
        archive_date = _date(datetime.date(int(year), int(month), int(day)))
        kwargs['pub_date__year'] = year
        kwargs['pub_date__month'] = month
        kwargs['pub_date__day'] = day
    elif year and month:
        archive_date = _date(datetime.date(int(year), int(month), 1), "F Y")
        kwargs['pub_date__year'] = year
        kwargs['pub_date__month'] = month
    else:
        archive_date = year
        kwargs['pub_date__year'] = year

    posts = get_post_list(request, **kwargs)
    obj_name = _('Archives from %(date)s') % {'date': archive_date}
    return render(request,
                  "blog/post_list.haml",
                  {"posts": posts,
                   'obj': {'name': obj_name,
                           'url': request.path,
                           'date': archive_date}
       })
