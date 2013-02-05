# -*- coding: utf-8 -*-
import datetime
from django.template import RequestContext
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.shortcuts import render, get_object_or_404
from django.http import Http404, HttpResponse, HttpResponseForbidden
from django.conf import settings
from django.core.urlresolvers import reverse
from django.views.decorators.http import require_safe
from django.contrib.auth.decorators import login_required
from django.utils.translation import ugettext as _
from django.contrib.sites.models import Site
from django.template.defaultfilters import slugify, date as _date
from commons.paginator import simple_paginator
from commons.decorators import ajax_only
from commons.forms import SingleTextareaForm
from commons.views import validate_single_ajax_form
from models import Post, Category, Tag
from forms import *


@require_safe
def home(request):
    post_list = Post.objects.select_related() \
        .filter(is_public=1,
                site=Site.objects.get_current())
    posts = simple_paginator(post_list, 10, request.GET.get('page'))
    return render(request, "blog/home.haml", {"posts": posts})


@require_safe
def display_post(request, year, month, day, slug):
    post = get_object_or_404(Post,
                             pub_date__year=year,
                             pub_date__month=month,
                             pub_date__day=day,
                             slug=slug,
                             is_public=1,
                             site=Site.objects.get_current())
    storage_key = slugify(post.get_absolute_url())
    form = CommentForm(storage_key, request=request, user=request.user)
    return render(request, "blog/post.haml", {"post": post,
                                              "form": form,
                                              'storage_key': storage_key})


@require_safe
@ajax_only
def comment_list(request, year, month, day, slug):
    post = get_object_or_404(Post,
                             pub_date__year=year,
                             pub_date__month=month,
                             pub_date__day=day,
                             slug=slug,
                             is_public=1,
                             site=Site.objects.get_current())
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

    return validate_single_ajax_form(request, comment, 'comment', render_args, SingleTextareaForm, {'size': 97})


@require_safe
@ajax_only
def comment_count(request, year, month, day, slug):
    post = get_object_or_404(Post,
                             pub_date__year=year,
                             pub_date__month=month,
                             pub_date__day=day,
                             slug=slug,
                             is_public=1,
                             site=Site.objects.get_current())
    count = post.count_public_comments()
    return render(request, "blog/ajax/comment_count.haml", {"count": count})


@ajax_only
def comment_form(request, year, month, day, slug):
    post = get_object_or_404(Post,
                             pub_date__year=year,
                             pub_date__month=month,
                             pub_date__day=day,
                             slug=slug,
                             is_public=1,
                             site=Site.objects.get_current())
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
@login_required
def preview_post(request, year, month, day, slug):
    if request.user.is_superuser:
        post = get_object_or_404(Post,
                                 pub_date__year=year,
                                 pub_date__month=month,
                                 pub_date__day=day,
                                 slug=slug,
                                 site=Site.objects.get_current())
    else:
        post = get_object_or_404(Post,
                                 pub_date__year=year,
                                 pub_date__month=month,
                                 pub_date__day=day,
                                 slug=slug,
                                 author=request.user,
                                 site=Site.objects.get_current())
    post.allow_comment = False
    return render(request, "blog/post.haml", {"post": post})


@require_safe
def post_list_by_categories(request, slug):
    cat = get_object_or_404(Category, slug=slug, site=Site.objects.get_current())
    cat_list = Category.objects.filter(left__gte=cat.left,
                                       left__lte=cat.right,
                                       site=Site.objects.get_current())

    post_list = Post.objects.select_related() \
        .filter(category__in=cat_list,
                is_public=1,
                site=Site.objects.get_current())

    posts = simple_paginator(post_list, 10, request.GET.get('page'))
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
    post_list = Post.objects.select_related() \
        .filter(tags=tag,
                is_public=1)

    posts = simple_paginator(post_list, 10, request.GET.get('page'))
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
    if year and month and day:
        archive_date = _date(datetime.date(int(year), int(month), int(day)))
        post_list = Post.objects.select_related() \
                                .filter(pub_date__year=year,
                                        pub_date__month=month,
                                        pub_date__day=day,
                                        is_public=1,
                                        site=Site.objects.get_current())
    elif year and month:
        archive_date = _date(datetime.date(int(year), int(month), 1), "F Y")
        post_list = Post.objects.select_related() \
                                .filter(pub_date__year=year,
                                        pub_date__month=month,
                                        is_public=1,
                                        site=Site.objects.get_current())
    else:
        archive_date = year
        post_list = Post.objects.select_related() \
                                .filter(pub_date__year=year,
                                        is_public=1,
                                        site=Site.objects.get_current())

    if not post_list:
        raise Http404
    posts = simple_paginator(post_list, 10, request.GET.get('page'))
    obj_name = _('Archives from %(date)s') % {'date': archive_date}
    return render(request,
                  "blog/post_list.haml",
                  {"posts": posts,
                   'obj': {'name': obj_name,
                           'url': request.path,
                           'date': archive_date}
       })
