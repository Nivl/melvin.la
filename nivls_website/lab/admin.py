from models import *
from django.contrib import admin

class ProgressionInline(admin.TabularInline):
    model = Progression
    extra = 1

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
    inlines = [ProgressionInline, ImageInline, VideoInline, DownloadInline]

admin.site.register(Language)
admin.site.register(Licence)
admin.site.register(Project, ProjectAdmin)
admin.site.register(VideoHost)
