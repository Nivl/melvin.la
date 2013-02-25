from django.template import RequestContext
from django.conf import settings
from django.shortcuts import render, get_object_or_404
from django.contrib.sites.models import Site
from django.views.decorators.http import require_safe
from commons.views import write_pdf
from resume.models import Section, DocumentCategory
from about.models import Profile, NavigationLink, ContactLink, WorkProject
from about.forms import ContactForm


@require_safe
def home(request):
    profile = get_object_or_404(Profile, pk=Site.objects.get_current())
    navigation_links = NavigationLink.objects.filter(site=settings.SITE_ID)
    contact_links = ContactLink.objects.all()
    return render(request, "about/home.haml",
                  {'profile': profile,
                   'contact_links': contact_links,
                   'navigation_links': navigation_links
                   })


@require_safe
def contact(request):
    form = ContactForm(request=request)
    return render(request, "about/contact.haml", {'form': form})


@require_safe
def about(request):
    profile = get_object_or_404(Profile, pk=Site.objects.get_current())
    navigation_links = NavigationLink.objects.filter(site=settings.SITE_ID)
    contact_links = ContactLink.objects.all()
    cv_sections = Section.objects.filter(site=settings.SITE_ID)
    cv_document_cats = DocumentCategory.objects.filter(site=settings.SITE_ID)
    return render(request, "about/about.haml",
                  {'profile': profile,
                   'contact_links': contact_links,
                   'navigation_links': navigation_links,
                   'cv_sections': cv_sections,
                   'cv_document_cats': cv_document_cats,
                   'to_pdf': False
                   })


@require_safe
def cv_pdf(request):
    cv_sections = Section.objects.filter(site=settings.SITE_ID)
    c = RequestContext(request, {'cv_sections': cv_sections, 'to_pdf': True})
    return write_pdf("about/about.haml", c, "cv_laplanche_melvin.pdf")


@require_safe
def portfolio(request):
    projects = WorkProject.objects.filter(lab__site=settings.SITE_ID)
    return render(request, "about/portfolio.haml", {'projects': projects})
