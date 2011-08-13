from django.contrib import admin
from models import Tag

class AdminTag(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(Tag, AdminTag)
