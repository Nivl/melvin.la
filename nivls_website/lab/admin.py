from django.contrib import admin
from django.conf import settings
from lab.models import *
from commons.admin import CommonAdminWithSlug, PrepoSlugAdmin
from seo.admin import InlineSeo

# Project


class ProjectLanguageRateInline(admin.TabularInline):
    model = ProjectLanguageRate
    extra = 1


class ProgressInline(admin.TabularInline):
    model = Progress
    extra = 0


class TodoInline(admin.TabularInline):
    model = Todo
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
    prepopulated_fields = {'slug': ['name']}
    inlines = [ProjectLanguageRateInline, ProgressInline, TodoInline,
               ImageInline, VideoInline, DownloadInline, InlineSeo]

    def queryset(self, request):
        return super(ProjectAdmin, self).queryset(request) \
                                        .filter(site=settings.SITE_ID)


# Others


class DLIconAdmin(admin.ModelAdmin):
    list_display = ['admin_thumbnail']


class TagAdmin(PrepoSlugAdmin):
    list_display = ['admin_thumbnail', 'name']


admin.site.register(Language, PrepoSlugAdmin)
admin.site.register(License, CommonAdminWithSlug)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Coworker, CommonAdminWithSlug)
admin.site.register(Client, CommonAdminWithSlug)
admin.site.register(Tag, TagAdmin)
admin.site.register(DownloadIcon, DLIconAdmin)
