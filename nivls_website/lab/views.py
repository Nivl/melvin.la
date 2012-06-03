from django.shortcuts import render, get_object_or_404
from django.conf import settings
from commons.simple_paginator import simple_paginator
from models import *


def home(request):
    project_list = Project.objects.filter(site=settings.SITE_ID)
    projects = simple_paginator(project_list, 5, request.GET.get('page'))
    return render(request, "lab/home.html", {'projects': projects})


def project(request, slug):
    p = get_object_or_404(Project, slug=slug)
    return render(request, "lab/project.html", {'project': p})


def tag(request, slug):
    tag = get_object_or_404(Tag, slug=slug)
    project_list = Project.objects.filter(site=settings.SITE_ID, tags=tag)
    projects = simple_paginator(project_list, 5, request.GET.get('page'))
    return render(request, "lab/tag.html", {'projects': projects,
                                            'tag': tag})
