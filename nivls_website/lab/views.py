from django.shortcuts import render, get_object_or_404
from models import *

def project(request, slug):
    p = get_object_or_404(Project, slug=slug)
    return render(request, "lab/project.html", {'project': p})
