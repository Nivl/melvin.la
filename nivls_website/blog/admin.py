# -*- coding: utf-8 -*-

from nivls_website.blog.models       import Entry, Tag, Category
from django.contrib              import admin

admin.site.register(Entry)
admin.site.register(Tag)
admin.site.register(Category)