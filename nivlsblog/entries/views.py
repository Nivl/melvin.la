from django.shortcuts import render_to_response, get_object_or_404
from django.core.context_processors import csrf
from nivlsblog.entries.models import Entry
from datetime import datetime


def index(request):
    latest_entry_list = Entry.objects.all().order_by('-date')[:5]
    return render_to_response('entries/index.html',
                              {'latest_entry_list': latest_entry_list})


def detail(request, entry_id):
    e = get_object_or_404(Entry, pk=entry_id)
    c = {'entry': e,
         'next': '/entries/' + entry_id}
    c.update(csrf(request))
    return render_to_response('entries/detail.html', c)

