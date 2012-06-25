from django.shortcuts import render
from django.views.decorators.http import require_safe
from commons.decorators import ajax_only


@require_safe
@ajax_only
def get_common_header(request):
    return render(request, "header.html")
