from django.contrib import admin
from blog.models import Post, SeeAlso

class AdminPost(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}

admin.site.register(Post, AdminPost)
admin.site.register(SeeAlso)
