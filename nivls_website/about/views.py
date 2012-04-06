from django.shortcuts import render, get_object_or_404
from django.contrib.sites.models import Site
from commons.views import write_pdf
from models import *


def home(request):
    profile = get_object_or_404(Profile ,pk=Site.objects.get_current())
    contact_links = ContactLink.objects.all()
    return render(request, "about/about.html", {'profile': profile,
                                                'contact_links': contact_links
                                                })

def cv(request):
    static_infos = get_object_or_404(StaticInfos
                                     ,pk=Site.objects.get_current())
    return render(request, "about/cv.html", {'static_infos': static_infos})

def cv_pdf(request):
    static_infos = get_object_or_404(StaticInfos
                                     ,pk=Site.objects.get_current())
    return write_pdf("about/cv_pdf.html", {'static_infos': static_infos}, "laplanche_melvin.pdf")

def portfolio(request):
    projects = WorkProject.objects.select_related().order_by("-prod_date")
    return render(request, "about/portfolio.html", {'projects': projects})

