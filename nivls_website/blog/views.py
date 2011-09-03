from django.shortcuts import render
from models import Post
from commons.simple_paginator import simple_paginator

def home(request):
    post_list = Post.objects.order_by('-pub_date')
    posts = simple_paginator(post_list, 10, request.GET.get('page'))
    return render(request, "blog/home.html", {"posts": posts})

def post(request, year, month, day, slug):
    return render(request, "blog/home.html")

def post_list_by_categories(request, slug):
    return render(request, "blog/home.html")

def post_list_by_tags(request, slug):
    return render(request, "blog/home.html")

def post_list_by_archives(request, year, month=None, day=None):
    return render(request, "blog/home.html")
