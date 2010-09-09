from django import template

register = template.Library()

@register.inclusion_tag('entries/templatetags/display_entries.html')
def display_entries(entries):
    return {'entries': entries}
