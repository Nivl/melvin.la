from django.contrib import admin
from models import *


class ItemAdmin(admin.ModelAdmin):
    list_filter = ['is_valid']
    list_display = ['content', 'is_valid']
    actions = ['make_valid', 'make_invalid']

    def make_valid(self, request, queryset):
        nb_row = queryset.update(is_valid=1)
        if nb_row == 1:
            message = "1 item was "
        else:
            message = "%s items were " % nb_row
        self.message_user(request, "% successfully marked as valid" % message)

    def make_invalid(self, request, queryset):
        nb_row = queryset.update(is_valid=0)
        if nb_row == 1:
            message = "1 item was "
        else:
            message = "%s items were " % nb_row
        self.message_user(request, "% successfully marked as invalid" % message)

admin.site.register(Item, ItemAdmin)
admin.site.register(BlacklistedWord)
