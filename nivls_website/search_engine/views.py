import json
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
            words = list(Item.objects.filter(content__icontains=kwords) \
                .values_list('content', flat=True)[:10])
    except:
        pass

    output = json.dumps(words) if words else ''
    return HttpResponse(output, content_type="application/json")
