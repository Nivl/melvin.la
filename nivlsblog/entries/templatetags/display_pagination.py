from django import template

register = template.Library()

@register.inclusion_tag('entries/templatetags/display_pagination.html')
def display_pagination(paginator):
    return {'paginator': paginator}
