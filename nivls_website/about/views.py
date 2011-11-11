from django.shortcuts import render, get_object_or_404
from django.contrib.sites.models import Site
from models import *


def home(request):
    static_infos = get_object_or_404(StaticInfos
                                     ,pk=Site.objects.get_current())
    return render(request, "about/about.html", {'static_infos': static_infos})


def cv(request):
    static_infos = get_object_or_404(StaticInfos
                                     ,pk=Site.objects.get_current())
    return render(request, "about/cv.html", {'static_infos': static_infos})

def portfolio(request):
    projects = Project.objects.select_related().order_by("-prod_date")
    return render(request, "about/portfolio.html", {'projects': projects})
