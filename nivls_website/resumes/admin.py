from django.contrib import admin
from commons.admin import CommonAdminWithSlug
from models import *


class InlineCategory(admin.TabularInline):
    model = Category
    extra = 1


class SectionAdmin(admin.ModelAdmin):
    inlines = [InlineCategory]
    prepopulated_fields = {'slug': ('name',)}

    def queryset(self, request):
        return super(SectionAdmin, self).queryset(request) \
                                        .filter(site=settings.SITE_ID)


class InlineContent(admin.TabularInline):
    model = Content
    extra = 1


class CategoryAdmin(admin.ModelAdmin):
    inlines = [InlineContent]
    list_filter = ['section']

    def queryset(self, request):
        return super(CategoryAdmin, self).queryset(request) \
                                         .filter(section__site=settings.SITE_ID)


class InlineDocument(admin.TabularInline):
    model = Document
    extra = 1


class DocumentCategoryAdmin(CommonAdminWithSlug):
    inlines = [InlineDocument]

admin.site.register(Section, SectionAdmin)
admin.site.register(Category, CategoryAdmin)

admin.site.register(DocumentCategory, DocumentCategoryAdmin)
