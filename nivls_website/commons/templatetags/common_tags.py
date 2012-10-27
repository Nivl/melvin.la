from django import template
from django.utils.safestring import mark_safe
from django.contrib.contenttypes.models import ContentType
import string as python_string
import re
import html5lib
from html5lib import sanitizer

register = template.Library()


@register.filter
def sanitize(value):
    p = html5lib.HTMLParser(tokenizer=sanitizer.HTMLSanitizer)
    return mark_safe(p.parseFragment(value).toxml())


@register.filter
def replace_regexp(string, args):
    search = args.split(args[0])[1]
    replace = args.split(args[0])[2]

    return re.sub(search, replace, string)


@register.filter
def replace(string, args):
    search = args.split(args[0])[1]
    replace = args.split(args[0])[2]

    return python_string.replace(string, search, replace)


@register.filter
def app_name(obj):
    return ContentType.objects.get_for_model(obj.__class__).app_label
