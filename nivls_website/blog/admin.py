from django.contrib import admin
from django.contrib.comments.models import Comment
from django.contrib.contenttypes.generic import GenericTabularInline
from blog.models import *
from django.conf import settings

# Post

class InlineComment(GenericTabularInline):
    model = Comment
    extra = 0
    ct_field = 'content_type'
    ct_fk_field = 'object_pk'

class InlineImage(admin.TabularInline):
    model = Image
    extra = 0

class AdminPost(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ['pub_date', 'is_public', 'allow_comment']
    actions = ['make_public', 'make_private', 'allow_comment', 'lock_comment']
    date_hierarchy = 'pub_date'
    list_display = ('title', 'pub_date', 'is_public', 'allow_comment')
    inlines = [InlineImage, InlineComment]

    def make_public(self, request, queryset):
        nb_row = queryset.update(is_public=1)
        if nb_row == 1:
            message = "1 post was "
        else:
            message = "%s posts were " % nb_row
        self.message_user(request, "% successfully marked as public" % message)

    def make_private(self, request, queryset):
        nb_row = queryset.update(is_public=0)
        if nb_row == 1:
            message = "1 post was "
        else:
            message = "%s posts were " % nb_row
        self.message_user(request, "% successfully marked as private" % message)

    def lock_comment(self, request, queryset):
        nb_row = queryset.update(allow_comment=0)
        if nb_row == 1:
            message = "1 post was "
        else:
            message = "%s posts were " % nb_row
        self.message_user(request, "% successfully locked" % message)

    def allow_comment(self, request, queryset):
        nb_row = queryset.update(allow_comment=1)
        if nb_row == 1:
            message = "1 post was "
        else:
            message = "%s posts were " % nb_row
        self.message_user(request, "% successfully locked" % message)

    class Media:
        js = (settings.STATIC_URL + 'admin/js/admin_post_preview.js',)



admin.site.register(Post, AdminPost)


# Others

class AdminCategory(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

    def get_ordering(self, request):
        return ["left"]

class AdminTag(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

# Menu

class InlineLink(admin.TabularInline):
    model = Link
    extra = 1

class AdminMenu(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    inlines = [InlineLink]

admin.site.register(Tag, AdminTag)
admin.site.register(Menu, AdminMenu)
admin.site.register(Category, AdminCategory)
