from django.conf import settings
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
    sections = CVSection.objects.filter(site=settings.SITE_ID)
    return render(request, "about/cv.html", {'sections': sections})

def cv_pdf(request):
    categories = CVCategory.objects.filter(site=settings.SITE_ID)
    return write_pdf("about/cv_pdf.html", {'static_infos': static_infos}, "laplanche_melvin.pdf")

def portfolio(request):
    projects = WorkProject.objects.filter(site=settings.SITE_ID).select_related().order_by("-prod_date")
    return render(request, "about/portfolio.html", {'projects': projects})

