from nivlsblog.entries.models import Entry
from django.contrib import admin

class EntryAdmin(admin.ModelAdmin):
    list_display   = ['title', 'date']
    list_filter    = ['date']
    search_fields  = ['title']
    date_hierarchy = 'date'

admin.site.register(Entry, EntryAdmin)
