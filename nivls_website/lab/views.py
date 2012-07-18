from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.views.decorators.http import require_safe
from commons.paginator import simple_paginator
from models import *


@require_safe
def home(request):
    project_list = Project.objects.filter(site=settings.SITE_ID)
    projects = simple_paginator(project_list, 5, request.GET.get('page'))
    return render(request, "lab/listing.html", {'projects': projects})


@require_safe
def tag(request, slug):
    tag = get_object_or_404(Tag, slug=slug)
    project_list = Project.objects.filter(site=settings.SITE_ID, tags=tag)
    projects = simple_paginator(project_list, 5, request.GET.get('page'))
    return render(request, "lab/listing.html", {'projects': projects,
                                                'tag': tag})

@require_safe
def project(request, slug):
    p = get_object_or_404(Project, slug=slug)
    return render(request, "lab/project.html", {'project': p})
