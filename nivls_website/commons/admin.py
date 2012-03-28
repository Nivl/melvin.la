from django.contrib import admin
from models import *
from django.conf import settings

admin.site.register(I18nSite)

##

class CommonAdmin(admin.ModelAdmin):
    def queryset(self, request):
        return super(CommonAdmin, self).queryset(request).filter(site=settings.SITE_ID)

class CommonAdminWithSlug(CommonAdmin):
    prepopulated_fields = {'slug': ('name',)}
