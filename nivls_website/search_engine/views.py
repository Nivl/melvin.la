import json
import re
import urllib
from django.http import HttpResponse
from django.views.decorators.http import require_safe
from commons.decorators import ajax_only
from models import *


@ajax_only
@require_safe
def autocomplete(request):
    words = ''
    try:
        kwords = urllib.unquote_plus(request.GET.get('search', ''))
        if kwords:
            words = list(Item.objects.filter(content__icontains=kwords,
                                             is_valid=True)
                         .values_list('content', flat=True)[:10])
    except:
        pass

    output = json.dumps(words) if words else ''
    return HttpResponse(output, content_type="application/json")


@ajax_only
@require_safe
def update_typeahead(request):
    kword = ''
    try:
        kword = urllib.unquote_plus(request.GET.get('search', ''))
    except:
        pass

    if kword:
        bwords = BlacklistedWord.objects.values_list('word', 'is_regex')
        found = None
        for w, is_regex in bwords:
            if not is_regex:
                found = re.search(re.escape(w), kword, flags=re.I)
            else:
                found = re.search(w, kword, flags=re.I)
            if found is not None:
                break
        if not found:
            obj, created = Item.objects.get_or_create(content=kword)
            if not created:
                obj.hit += 1
                obj.save()
    return HttpResponse('')
