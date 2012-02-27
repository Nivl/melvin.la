from django.contrib import admin
from django.conf import settings
from models import *

class CommonAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

    def queryset(self, request):
        return super(CommonAdmin, self).queryset(request).filter(site=settings.SITE_ID)

admin.site.register(StaticInfos)
admin.site.register(Project, CommonAdmin)
admin.site.register(Work, CommonAdmin)
admin.site.register(Field, CommonAdmin)
