# -*- coding: utf-8 -*-
import datetime
from django.shortcuts import render, get_object_or_404
from django.http import Http404
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.decorators import login_required
from django.utils.translation import ugettext as _
from django.contrib.sites.models import Site
from django.template.defaultfilters import date as _date
from models import Post, Category, Tag
from forms import ContactForm
from commons.simple_paginator import simple_paginator

def contact(request):
    if request.method == 'POST':
        if request.is_ajax():
            form = ContactForm(request.POST, request=request)
            if form.is_valid():
                msg = form.cleaned_data['message'] + "\n\n\n" + ('-' * 80)
                msg += "\n\n Ip : " + request.META["REMOTE_ADDR"]
                send_mail(form.cleaned_data['subject']
                          ,msg
                          ,form.cleaned_data['email']
                          ,[ row[1] for row in settings.ADMINS ]
                          ,fail_silently=True)
                return render(request, 'blog/contact_ok.html')
        else:
            raise Http404
    else:
        form = ContactForm(request=request)

    return render(request, "blog/contact.html", {'form':form})

def home(request):
    post_list = Post.objects.select_related().filter(is_public=1
                                                     ,site=Site.objects.get_current()
                                                     ).order_by('-pub_date')
    posts = simple_paginator(post_list, 10, request.GET.get('page'))
    return render(request, "blog/home.html", {"posts": posts})


def display_post(request, year, month, day, slug):
    post = get_object_or_404(Post, pub_date__year=year
                             ,pub_date__month=month
                             ,pub_date__day=day
                             ,slug=slug
                             ,is_public=1
                             ,site=Site.objects.get_current())
    return render(request, "blog/post.html", {"post": post})

@login_required
def preview_post(request, year, month, day, slug):
    if request.user.is_superuser:
        post = get_object_or_404(Post, pub_date__year=year
                                 ,pub_date__month=month
                                 ,pub_date__day=day
                                 ,slug=slug
                                 ,site=Site.objects.get_current())
    else:
        post = get_object_or_404(Post, pub_date__year=year
                                 ,pub_date__month=month
                                 ,pub_date__day=day
                                 ,slug=slug
                                 ,author=request.user
                                 ,site=Site.objects.get_current())
    return render(request, "blog/post.html", {"post": post})

def post_list_by_categories(request, slug):
    cat = get_object_or_404(Category, slug=slug)
    cat_list = Category.objects.filter(left__gte=cat.left
                                       ,left__lte=cat.right
                                       ,site=Site.objects.get_current())
    post_list = Post.objects.select_related().filter(category__in=cat_list
                                                     ,is_public=1
                                                     ,site=Site.objects.get_current()
                                                     ).order_by('-pub_date')
    posts = simple_paginator(post_list, 10, request.GET.get('page'))
    return render(request, "blog/post_list.html", {"posts": posts,
                                                   "obj_name": cat.name,
                                                   "obj_feed": cat.get_feed_url()})


def post_list_by_tags(request, slug):
    tag = get_object_or_404(Tag, slug=slug)
    post_list = Post.objects.select_related().filter(tags=tag
                                                     ,is_public=1
                                                     ,site=Site.objects.get_current()
                                                     ).order_by('-pub_date')
    posts = simple_paginator(post_list, 10, request.GET.get('page'))
    return render(request, "blog/post_list.html", {"posts": posts,
                                                   "obj_name": tag.name,
                                                   "obj_feed": tag.get_feed_url()})


def post_list_by_archives(request, year, month=None, day=None):
    if year and month and day:
        archive_date = _date(datetime.date(int(year), int(month), int(day)))
        post_list = Post.objects.select_related().order_by("-pub_date").filter(
            pub_date__year=year, pub_date__month=month, pub_date__day=day,
            is_public=1, site=Site.objects.get_current())
    elif year and month:
        archive_date = _date(datetime.date(int(year), int(month), 1), "F Y")
        post_list = Post.objects.select_related().order_by("-pub_date").filter(
            pub_date__year=year, pub_date__month=month, is_public=1,
            site=Site.objects.get_current())
    else:
        archive_date = year
        post_list = Post.objects.select_related().order_by("-pub_date").filter(
            pub_date__year=year, is_public=1, site=Site.objects.get_current())

    if not post_list:
        raise Http404
    posts = simple_paginator(post_list, 10, request.GET.get('page'))
    obj_name = _('Archives from %(date)s') % {'date': archive_date}
    return render(request, "blog/post_list.html", {"posts": posts,
                                                   "obj_name": obj_name})
