from django.shortcuts import render_to_response, get_object_or_404
from django.core.context_processors import csrf
from nivlsblog.entries.models import Entry
from nivlsblog.libs.simple_paginator import simple_paginator
from datetime import datetime


def listing(request, page):
    entry_list = Entry.objects.select_related(depth=2).order_by('-date')
    entries = simple_paginator(entry_list, 5, page)
    return render_to_response('entries/list.html',
                              {'entries': entries})


def detail(request, entry_id):
    e = get_object_or_404(Entry, pk=entry_id)
    c = {'entry': e,
         'next': '/entries/' + entry_id}
    c.update(csrf(request))
    return render_to_response('entries/detail.html', c)

