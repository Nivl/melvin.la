from django.contrib import admin
from django.contrib.contenttypes import generic
from models import *


class InlineSeo(generic.GenericTabularInline):
    model = SeoEverywhere
    max_num = 1
    extra = 0


class InlineMicroData(generic.GenericTabularInline):
    model = SeoMicroData
    extra = 1

admin.site.register(SEO)
