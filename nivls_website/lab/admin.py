from models import *
from django.contrib import admin

# Project
class ProjectLanguageRateInline(admin.TabularInline):
    model = ProjectLanguageRate
    extra = 1

class ProgressInline(admin.TabularInline):
    model = Progress
    extra = 0

class ImageInline(admin.TabularInline):
    model = Image
    extra = 1

class VideoInline(admin.TabularInline):
    model = Video
    extra = 1

class DownloadInline(admin.TabularInline):
    model = Download
    extra = 1

class ProjectAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',),}
    list_filter = ['site']
    list_display = ('name', 'site')
    inlines = [ProjectLanguageRateInline, ProgressInline,
               ImageInline, VideoInline, DownloadInline]


# Others

class LanguageAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',),}

class LicenseAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',),}

class CoworkerAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',),}
    list_filter = ['site']
    list_display = ('name', 'site')

class ClientAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',),}
    list_filter = ['site']
    list_display = ('name', 'site')

admin.site.register(Language, LanguageAdmin)
admin.site.register(License, LicenseAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Coworker, CoworkerAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(DownloadIcon)
