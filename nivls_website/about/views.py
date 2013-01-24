from django.template import RequestContext
from django.conf import settings
from django.shortcuts import render, get_object_or_404
from django.contrib.sites.models import Site
from django.views.decorators.http import require_safe
from django.core.mail import send_mail
from commons.views import write_pdf
from commons.decorators import ajax_only
from models import *
from forms import *


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


@ajax_only
def contact_form(request):
    if request.method == 'POST':
        form = ContactForm(request.POST, request=request)
        if form.is_valid():
            msg = form.cleaned_data['message'] + "\n\n\n" + ('-' * 80)
            msg += "\n\n Ip : " + request.META["REMOTE_ADDR"]
            send_mail(form.cleaned_data['subject'],
                      msg,
                      form.cleaned_data['email'],
                      [row[1] for row in settings.ADMINS],
                      fail_silently=True)
            return render(request, 'about/contact_ok.haml')
    else:
        form = ContactForm(request=request)

    return render(request, "about/contact_form.haml", {'form': form})


@require_safe
def about(request):
    profile = get_object_or_404(Profile, pk=Site.objects.get_current())
    navigation_links = NavigationLink.objects.filter(site=settings.SITE_ID)
    contact_links = ContactLink.objects.all()
    cv_sections = CVSection.objects.filter(site=settings.SITE_ID)
    cv_document_cats = CVDocumentCategory.objects.filter(site=settings.SITE_ID)
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
    cv_sections = CVSection.objects.filter(site=settings.SITE_ID)
    c = RequestContext(request, {'cv_sections': cv_sections, 'to_pdf': True})
    return write_pdf("about/about.haml", c, "cv_laplanche_melvin.pdf")


@require_safe
def portfolio(request):
    projects = WorkProject.objects.filter(lab__site=settings.SITE_ID)
    return render(request, "about/portfolio.haml", {'projects': projects})
