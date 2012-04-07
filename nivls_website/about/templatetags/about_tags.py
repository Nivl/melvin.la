from django import template
from django.db.models import Count

register = template.Library()

@register.inclusion_tag("about/templatetags/display_cat.html")
def display_cat(cat, collumn):
     return {'cat': cat, 'collumn': collumn}

@register.inclusion_tag("about/templatetags/cat_as_list.html")
def cat_as_list(cat):
    return {'cat': cat}

@register.inclusion_tag("about/templatetags/cat_as_table.html")
def cat_as_table(cat):
    return {'cat': cat}

