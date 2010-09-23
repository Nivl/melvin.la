# -*- coding: utf-8 -*-

from django.core.cache                     import cache
from django.core.context_processors        import csrf
from django.core.mail                      import send_mail
from django.core.urlresolvers              import reverse
from django.conf                           import settings
from nivls_website.blog.forms              import *
from nivls_website.blog.models             import *
from nivls_website.libs.simple_paginator   import simple_paginator
from django.http                           import Http404
from django.shortcuts                      import render_to_response, get_object_or_404, get_list_or_404


def entry_list(request, page=1):
    entry_list = Entry.objects.select_related().order_by('-date')
    entries = simple_paginator(entry_list, 5, page)
    return render_to_response('blog/entry_list.html', {'entries': entries})


def entry_detail(request, year, month, day, slug):
    c = {}
    c.update(csrf(request))
    entry = get_object_or_404(Entry.objects.select_related(),
                              date__year=year,
                              date__month=month,
                              date__day=day,
                              slug=slug)
    if request.method == 'POST':
        form = CommentForm(request, request.POST)
        if form.is_valid():
            if 'preview' in request.POST:
                c['preview'] = form.get_cleaned_data()
            else:
                comment = Comment(**form.get_cleaned_data())
                comment.entry   = entry
                comment.user_ip = request.META['REMOTE_ADDR']
                comment.save()
                response = render_to_response(
                    'generic/flash_message.html',
                    {'verb': 'added',
                     'link': entry.get_absolute_url()})
                form.remember(response)
                return response
    else:
        form = CommentForm(request)
    c['entry'] = entry
    c['form'] = form
    return render_to_response('blog/entry_detail.html', c)



def entry_list_by_cat(request, slug, page=1):
    cat = get_object_or_404(Category, slug=slug)
    cat_list = Category.objects.filter(left__gte=cat.left,
                                       right__lte=cat.right)
    entry_list = Entry.objects.select_related(depth=2
                                              ).filter(
                                                category__in=cat_list
                                              ).order_by(
                                                '-date')
    entries = simple_paginator(entry_list, 5, page)
    return render_to_response("blog/entry_list.html", {'entries': entries})



def entry_list_by_tag(request, slug, page=1):
    tag = get_object_or_404(Tag, slug=slug)
    entry_list = Entry.objects.select_related(depth=2
                                              ).filter(
                                                tags=tag
                                              ).order_by(
                                                '-date')
    entries = simple_paginator(entry_list, 5, page)
    return render_to_response("blog/entry_list.html", {'entries': entries})


def contact(request):
    c = {}
    c.update(csrf(request))
    if request.method == 'POST':
        form = ContactForm(request.POST)
    else:
        form = ContactForm()
    c['form'] =  form
    if form.is_valid():
        msg = form.cleaned_data['message'] + "\n\n\n" + ('-' * 80)
        msg += "\n\n Ip : " + request.META["REMOTE_ADDR"]
        subject = u"[Nivl’s blog] " + form.cleaned_data['subject']
        send_mail(subject,
                  msg,
                  form.cleaned_data['email'],
                  [settings.ADMINS[0][1]])
        c = {'verb': 'sent',
             'link': reverse('blog')}
        return render_to_response('generic/flash_message.html', c)
    else:
        return render_to_response('blog/contact.html', c)


def archive(request, year, month=0, page=None):
    if month == 0:
        entry_list = Entry.objects.select_related(depth=2).order_by('-date').filter(date__year=year)
    else:
        entry_list = Entry.objects.select_related(depth=2).order_by('-date').filter(date__year=year, date__month=month)
    if not entry_list:
        raise Http404
    entries = simple_paginator(entry_list, 5, page)
    return render_to_response('blog/entry_list.html', {'entries': entries})
