from django.contrib import admin
from django.conf import settings
from commons.admin import CommonAdminWithSlug
from models import *

admin.site.register(Profile)
admin.site.register(ContactLink)
admin.site.register(WorkType, CommonAdminWithSlug)


class NavigationLinkAdmin(admin.ModelAdmin):
    def queryset(self, request):
        return super(NavigationLinkAdmin, self).queryset(request) \
                                               .filter(site=settings.SITE_ID)
admin.site.register(NavigationLink, NavigationLinkAdmin)


class WorkProjectAdmin(admin.ModelAdmin):
    def queryset(self, request):
        return super(WorkProjectAdmin, self).queryset(request) \
                                            .filter(lab__site=settings.SITE_ID)
admin.site.register(WorkProject, WorkProjectAdmin)
