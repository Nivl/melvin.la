from django import template
from django.db.models import Count

register = template.Library()

@register.inclusion_tag("about/templatetags/display_cat.html")
def display_cat(cat, collumn, is_downloadable):
    return {'cat': cat,
            'collumn': collumn,
            'is_downloadable': is_downloadable}

@register.inclusion_tag("about/templatetags/cat_as_list.html")
def cat_as_list(cat, is_downloadable):
    return {'cat': cat,
            'is_downloadable': is_downloadable}

@register.inclusion_tag("about/templatetags/cat_as_table.html")
def cat_as_table(cat, is_downloadable):
    return {'cat': cat,
            'is_downloadable': is_downloadable}

