# -*- coding: utf-8 -*-
import datetime
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_safe
from django.utils.translation import ugettext as _
from django.template.defaultfilters import slugify, date as _date
from django.conf import settings
from blog.models import Category, Tag
from blog.forms import CommentForm
from helpers import get_post_list, get_post


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
def post_list_by_categories(request, slug):
    cat = get_object_or_404(Category, slug=slug, site=settings.SITE_ID)
    cat_list = Category.objects.filter(left__gte=cat.left,
                                       left__lte=cat.right,
                                       site=settings.SITE_ID)
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
    tag = get_object_or_404(Tag, slug=slug, site=settings.SITE_ID)
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
