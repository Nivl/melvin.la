from django.contrib import admin
from models import *

class WorkAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

admin.site.register(StaticInfos)
admin.site.register(Project)
admin.site.register(Work, WorkAdmin)
