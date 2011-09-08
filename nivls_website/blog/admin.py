from django.contrib import admin
from blog.models import Post, Link, Menu, Category, Tag

class AdminPost(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}

class AdminCategory(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

    def get_ordering(self, request):
        return ["left"]

class AdminTag(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(Tag, AdminTag)
admin.site.register(Post, AdminPost)
admin.site.register(Menu)
admin.site.register(Link)
admin.site.register(Category, AdminCategory)
