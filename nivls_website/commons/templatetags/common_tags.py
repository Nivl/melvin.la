from django import template
from django.db.models import Count
import re

register = template.Library()

@register.filter
def replace_regexp(string, args):
    search  = args.split(args[0])[1]
    replace = args.split(args[0])[2]

    return re.sub(search, replace, string)

@register.filter
def fix_html5_tz(datimezone):
    if len(datimezone) == 24:
        return datimezone[:22] + ":" + datimezone[22:]
    return datimezone
