from django.core.paginator       import Paginator, InvalidPage, EmptyPage

def simple_paginator(obj_list,
                     obj_per_page,
                     current_page):
    paginator = Paginator(obj_list, obj_per_page)
    try:
        objects = paginator.page(current_page)
    except (EmptyPage, InvalidPage):
        objects = paginator.page(paginator.num_pages)
    return objects
