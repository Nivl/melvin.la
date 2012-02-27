from models import *
from django.contrib import admin
from django.conf import settings

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
    inlines = [ProjectLanguageRateInline, ProgressInline,
               ImageInline, VideoInline, DownloadInline]

    def queryset(self, request):
        return super(ProjectAdmin, self).queryset(request).filter(site=settings.SITE_ID)

# Others

class LanguageAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',),}

class LicenseAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',),}

class CoworkerAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',),}

    def queryset(self, request):
        return super(CoworkerAdmin, self).queryset(request).filter(site=settings.SITE_ID)

class ClientAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',),}

    def queryset(self, request):
        return super(ClientAdmin, self).queryset(request).filter(site=settings.SITE_ID)

admin.site.register(Language, LanguageAdmin)
admin.site.register(License, LicenseAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Coworker, CoworkerAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(DownloadIcon)
