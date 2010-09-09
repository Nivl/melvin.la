from django import template

register = template.Library()

@register.inclusion_tag('entries/templatetags/display_entry.html')
def display_entry(entry):
    return {'entry': entry}
