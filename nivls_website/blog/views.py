# -*- coding: utf-8 -*-

from django.core.context_processors        import csrf
from django.core.mail                      import send_mail
from django.conf                           import settings
from nivls_website.blog.forms              import ContactForm
from nivls_website.blog.models             import Category, Entry, Tag
from nivls_website.libs.simple_paginator   import simple_paginator
from django.shortcuts                      import render_to_response, get_object_or_404, get_list_or_404


def entry_list(request, page=1):
    entry_list = Entry.objects.select_related(depth=2).order_by('-date')
    entries = simple_paginator(entry_list, 5, page)
    return render_to_response('blog/entry_list.html', {'entries': entries})


def entry_list_by_cat(request, slug, page=1):
    cat = get_object_or_404(Category, slug=slug)
    cat_list = Category.objects.filter(left__gte=cat.left,
                                       right__lte=cat.right)
    entry_list = Entry.objects.select_related(depth=2).filter(category__in=cat_list).order_by('-date')
    entries = simple_paginator(entry_list, 5, page)
    return render_to_response("blog/entry_list.html", {'entries': entries})


def entry_list_by_tag(request, slug, page=1):
    tag = get_object_or_404(Tag, slug=slug)
    entry_list = Entry.objects.select_related(depth=2).filter(tags=tag).order_by('-date')
    entries = simple_paginator(entry_list, 5, page)
    return render_to_response("blog/entry_list.html", {'entries': entries})


def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
    else:
        form = ContactForm()
    c = {'form': form}
    c.update(csrf(request))
    if form.is_valid():
        msg = form.cleaned_data['message'] + "\n\n\n" + ('-' * 80)
        msg += "\n\n Ip : " + request.META["REMOTE_ADDR"]
        subject = "[Nivl’s blog] " + form.cleaned_data['subject']
        send_mail(subject,
                  msg,
                  form.cleaned_data['email'],
                  [settings.ADMINS[0][1]])
        c = {'verb': 'sent', 'link': '/'}
        return render_to_response('generic/flash/message_added.html', c)
    else:
        return render_to_response('blog/contact.html', c)
