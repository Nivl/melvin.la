# -*- coding: utf-8 -*-
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.sites.models import Site
from commons.paginator import simple_paginator
from commons.views import ajax_get_form
from blog.models import Post


def get_post_list(request, **kwargs):
    if request.user.is_superuser:
        post_list = Post.objects.select_related() \
                                .filter(site=Site.objects.get_current(),
                                        **kwargs)
    else:
        post_list = Post.objects.select_related() \
                                .filter(is_public=1,
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
        post = get_object_or_404(Post, **kwargs)
    else:
        post = get_object_or_404(Post, is_public=1, **kwargs)
    return post


def get_single_form(request, pk, Obj=Post, path_name='',
                    perm='blog.change_post',
                    template_name='ajax/single_field_form.haml', **kwargs):
    if len(path_name) == 0:
        path_name = 'post-%s' % kwargs['attr_name']
    path_name = 'blog-' + path_name

    return ajax_get_form(request, Obj, path_name, pk=pk, perm=perm,
                         template_name=template_name, **kwargs)
