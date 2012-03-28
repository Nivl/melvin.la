from django.contrib import admin
from django import forms
from commons.admin import CommonAdmin, CommonAdminWithSlug
from models import *

admin.site.register(Profile)
admin.site.register(ContactLink)

admin.site.register(WorkType, CommonAdminWithSlug)
admin.site.register(WorkField, CommonAdminWithSlug)
admin.site.register(WorkProject, CommonAdminWithSlug)


class InlineCategory(admin.TabularInline):
    model = CVCategory
    extra = 1

class CVSectionAdmin(CommonAdminWithSlug):
    inlines = [InlineCategory]

class InlineContent(admin.TabularInline):
    model = CVContent
    extra = 1

    def formfield_for_dbfield(self, db_field, **kwargs):
        if db_field.name == "value":
            return forms.CharField(widget=forms.TextInput())
        return super(InlineContent, self).formfield_for_dbfield(db_field, **kwargs)

class CVCategoryAdmin(CommonAdmin):
    inlines = [InlineContent]
    list_filter = ['section']

class InlineSubContent(admin.TabularInline):
    model = CVSubContent
    extra = 1

class CVContentAdmin(CommonAdmin):
    inlines = [InlineSubContent]

    def formfield_for_dbfield(self, db_field, **kwargs):
        if db_field.name == "value":
            return forms.CharField(widget=forms.TextInput())
        return super(CVContentAdmin, self).formfield_for_dbfield(db_field, **kwargs)

    def queryset(self, request):
        return super(CVContentAdmin, self).queryset(request).filter(has_subcontent=True)

admin.site.register(CVSection, CVSectionAdmin)
admin.site.register(CVCategory, CVCategoryAdmin)
admin.site.register(CVContent, CVContentAdmin)
admin.site.register(CVSubContent, CommonAdmin)
