# -*- coding: utf-8 -*-
from django.template import RequestContext
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseForbidden
from django.conf import settings
from django.views.decorators.http import require_safe
from django.utils.translation import ugettext as _
from django.utils.text import slugify
from commons.decorators import ajax_only
from commons.models import SiteAdmin
from commons.forms import SingleTextareaForm, SingleCharFieldForm
from commons.forms import SingleBooleanFieldForm, SingleChoiceFieldForm
from commons.views import ajax_get_single_data, ajax_get_form
from blog.models import Post, Category, Comment
from blog.forms import CommentForm
from helpers import get_post, get_single_form


@require_safe
@ajax_only
def comment_list(request, year, month, day, slug):
    post = get_post(request, year, month, day, slug)
    comments = post.get_public_comments()
    return render(request, "blog/ajax/comment_list.haml",
                  {"comments": comments})


@require_safe
@ajax_only
def comment_count(request, year, month, day, slug):
    post = get_post(request, year, month, day, slug)
    count = post.count_public_comments()
    return render(request, "blog/ajax/comment_count.haml", {"count": count})


@ajax_only
def comment_form(request, year, month, day, slug):
    post = get_post(request, year, month, day, slug)
    storage_key = slugify(unicode(post.get_absolute_url()))
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
                [SiteAdmin().get_admin().email])

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


#
# Live Edit
#

# title
def get_post_title(request, pk):
    return ajax_get_single_data(request, pk, Post, 'title')


def get_post_title_form(request, pk):
    args = {'attr_name': 'title',
            'form_obj': SingleCharFieldForm,
            }

    return get_single_form(request, pk,
                           template_name='ajax/single_field_form_inline.haml',
                           **args)


# is_public
def get_post_is_public(request, pk):
    return ajax_get_single_data(request, pk, Post, 'is_public',
                                template_name='blog/ajax/is_public.haml')


def get_post_is_public_form(request, pk):
    args = {'attr_name': 'is_public',
            'form_obj': SingleBooleanFieldForm,
            }

    return get_single_form(request, pk,
                           path_name='post-is-public',
                           template_name='ajax/single_field_form_inline.haml',
                           **args)


# parsed_content
def get_post_parsed_content(request, pk):
    return ajax_get_single_data(request, pk, Post, 'parsed_content',
                                template_name='ajax/single_field_value_md.haml')


def get_post_parsed_content_form(request, pk):
    args = {'attr_name': 'content',
            'form_obj': SingleTextareaForm,
            }

    return get_single_form(request, pk,
                           path_name='post-parsed-content',
                           template_name='ajax/single_field_form.haml',
                           **args)


# Category
@require_safe
@ajax_only
def get_post_category(request, pk):
    p = get_object_or_404(Post, pk=pk)
    return render(request, "ajax/single_field_value.haml",
                 {'value': p.category.name,
                  'value_url': p.category.get_absolute_url,
                  'extra': 'data-ajax="body-content-only"'
                           ' data-depth="10"'})


def get_post_category_form(request, pk):
    categories = Category.objects.filter(site=settings.SITE_ID) \
                                 .values_list('pk', 'name')
    args = {'attr_name': 'category',
            'form_obj': SingleChoiceFieldForm,
            'form_args': {'choices': categories},
            'inital_fix': ('Category', 'pk'),
            }

    return get_single_form(request, pk,
                           template_name='ajax/single_field_form_inline.haml',
                           **args)


# Comment
def get_comment_comment(request, pk):
    return ajax_get_single_data(request, pk, Comment, 'comment',
       template_name='ajax/single_field_value_external.haml')


def get_comment_comment_form(request, pk):
    comment = get_object_or_404(Comment, pk=pk)

    if not request.user.is_authenticated() \
            or not (request.user == comment.user
                    or request.user.has_perm('blog.change_comment')):
        return HttpResponseForbidden()

    args = {'attr_name': 'comment',
            'form_obj': SingleTextareaForm,
            }

    return ajax_get_form(request, comment, 'blog-comment-comment',
                         perm=None, pk=None, **args)
