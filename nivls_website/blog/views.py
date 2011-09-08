from django.shortcuts import render, get_object_or_404
from django.http import Http404
from models import Post, Category, Tag
from commons.simple_paginator import simple_paginator
import datetime

def home(request):
    post_list = Post.objects.order_by('-pub_date')
    posts = simple_paginator(post_list, 10, request.GET.get('page'))
    return render(request, "blog/home.html", {"posts": posts})

def post(request, year, month, day, slug):
    post = get_object_or_404(Post, pub_date__year=year,
                             pub_date__month=month,
                             pub_date__day=day,
                             slug=slug)
    return render(request, "blog/post.html", {"post": post})

def post_list_by_categories(request, slug):
    cat = get_object_or_404(Category, slug=slug)
    cat_list = Category.objects.filter(left__gte=cat.left,
                                       left__lte=cat.right)
    post_list = Post.objects.filter(category__in=cat_list).order_by('-pub_date')
    posts = simple_paginator(post_list, 10, request.GET.get('page'))
    return render(request, "blog/post_list.html", {"posts": posts,
                                                   "obj_name": cat.name})

def post_list_by_tags(request, slug):
    tag = get_object_or_404(Tag, slug=slug)
    post_list = Post.objects.filter(tags=tag).order_by('-pub_date')
    posts = simple_paginator(post_list, 10, request.GET.get('page'))
    return render(request, "blog/post_list.html", {"posts": posts,
                                                   "obj_name": tag.name})

def post_list_by_archives(request, year, month=None, day=None):
    if year and month and day:
        archive_date = datetime.date(int(year), int(month), int(day)).strftime("%B, %d %Y")
        post_list = Post.objects.order_by("-pub_date").filter(
            pub_date__year=year, pub_date__month=month, pub_date__day=day)
    elif year and month:
        archive_date = datetime.date(int(year), int(month), 1).strftime("%B %Y")
        post_list = Post.objects.order_by("-pub_date").filter(
            pub_date__year=year, pub_date__month=month)
    else:
        archive_date = year
        post_list = Post.objects.order_by("-pub_date").filter(
            pub_date__year=year)

    if not post_list:
        raise Http404
    posts = simple_paginator(post_list, 10, request.GET.get('page'))
    obj_name = "Archives from " + archive_date
    return render(request, "blog/post_list.html", {"posts": posts,
                                                   "obj_name": obj_name})
