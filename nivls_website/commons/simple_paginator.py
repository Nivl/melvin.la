from django.core.paginator import Paginator, InvalidPage, \
    EmptyPage, PageNotAnInteger


def simple_paginator(obj_list, obj_per_page, current_page):
    if current_page is None:
        current_page = 1
    paginator = Paginator(obj_list, obj_per_page)
    try:
        objects = paginator.page(current_page)
    except PageNotAnInteger:
        objects = paginator.page(1)
    except EmptyPage, InvalidPage:
        objects = paginator.page(paginator.num_pages)
    return objects
