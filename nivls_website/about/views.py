from django.shortcuts import render, get_object_or_404
from django.contrib.sites.models import Site
from models import StaticInfos


def home(request):
    c = {}
    static_infos = get_object_or_404(StaticInfos, pk=Site.objects.get_current())
    c['static_infos'] = static_infos
    return render(request, "about/about.html", c)
