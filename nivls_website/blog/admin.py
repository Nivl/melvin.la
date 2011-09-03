from django.contrib import admin
from blog.models import Post, SeeAlso, Category

class AdminPost(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}

class AdminCategory(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

    def get_ordering(self, request):
        return ["left"]

admin.site.register(Post, AdminPost)
admin.site.register(SeeAlso)
admin.site.register(Category, AdminCategory)
