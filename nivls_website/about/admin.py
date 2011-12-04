from django.contrib import admin
from models import *

class CommonAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

admin.site.register(StaticInfos)
admin.site.register(Project, CommonAdmin)
admin.site.register(Work, CommonAdmin)
admin.site.register(Field, CommonAdmin)
