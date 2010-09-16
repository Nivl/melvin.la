# -*- coding: utf-8 -*-

from datetime                        import datetime
from django                          import template
from nivls_website.blog.models       import Category, Tag, Entry

register = template.Library()


@register.inclusion_tag('blog/templatetags/category_list.html')
def category_list():
    cat_list = Category.objects.order_by('left', 'level')
    return {'categories': cat_list}


@register.inclusion_tag('blog/templatetags/display_entries.html')
def display_entries(entries):
    return {'entries': entries}


@register.inclusion_tag('blog/templatetags/display_entry.html')
def display_entry(entry):
    return {'entry': entry}


@register.inclusion_tag('blog/templatetags/display_pagination.html')
def display_pagination(paginator):
    return {'paginator': paginator}


@register.inclusion_tag('blog/templatetags/flash_tag_cloud.html')
def flash_tag_cloud():
    tags = Tag.objects.all()
    return {'tags': tags}


@register.inclusion_tag('blog/templatetags/archive_list.html')
def archive_list():
    date_list = Entry.objects.dates('date', 'month').order_by('-date')
    return {'date_list': date_list}

