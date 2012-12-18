from django.contrib import admin
from django.conf import settings
from blog.models import *
from seo.admin import InlineSeo

# Post


class InlineComment(admin.TabularInline):
    model = Comment
    extra = 0


class InlineImage(admin.TabularInline):
    model = Image
    extra = 0


class AdminPost(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ['pub_date', 'is_public', 'allow_comment']
    actions = ['make_public', 'make_private', 'allow_comment', 'lock_comment']
    date_hierarchy = 'pub_date'
    list_display = ('title', 'pub_date', 'is_public', 'allow_comment')
    inlines = [InlineImage, InlineComment, InlineSeo]

    def queryset(self, request):
        return super(AdminPost, self).queryset(request) \
                                     .filter(site=settings.SITE_ID)

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
        self.message_user(request,
                          "% successfully marked as private" % message)

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

    def queryset(self, request):
        return super(AdminCategory, self).queryset(request) \
                                         .filter(site=settings.SITE_ID)

    def get_ordering(self, request):
        return ["left"]


class AdminTag(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

    def queryset(self, request):
        return super(AdminTag, self).queryset(request) \
                                    .filter(site=settings.SITE_ID)


class AdminComment(admin.ModelAdmin):
    list_filter = ['is_public', 'post']
    actions = ['make_public', 'make_private']
    list_display = ('comment', 'is_public', 'post')
    search_fields = ['user__username', 'name', 'comment']
    ordering = ['-pub_date']

    def queryset(self, request):
        return super(AdminComment, self).queryset(request) \
                                        .filter(post__site=settings.SITE_ID)

    def make_public(self, request, queryset):
        nb_row = queryset.update(is_public=1)
        if nb_row == 1:
            message = "1 comment was "
        else:
            message = "%s comments were " % nb_row
        self.message_user(request, "% successfully marked as public" % message)
# Menu


class InlineLink(admin.TabularInline):
    model = Link
    extra = 1


class AdminMenu(admin.ModelAdmin):
    inlines = [InlineLink]

    def queryset(self, request):
        return super(AdminMenu, self).queryset(request) \
                                     .filter(site=settings.SITE_ID)

admin.site.register(Tag, AdminTag)
admin.site.register(Menu, AdminMenu)
admin.site.register(Category, AdminCategory)
admin.site.register(Comment, AdminComment)
admin.site.register(Carousel)
