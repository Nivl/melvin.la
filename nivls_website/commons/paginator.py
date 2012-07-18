from django.core.paginator import Paginator, InvalidPage, EmptyPage, \
    PageNotAnInteger


def simple_paginator(obj_list, obj_per_page, current_page):
    paginator = Paginator(obj_list, obj_per_page)

    if current_page is None:
        current_page = 1

    try:
        objects = paginator.page(current_page)
    except:
        objects = paginator.page(1)
    return objects
