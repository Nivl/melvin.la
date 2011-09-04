from django.shortcuts import render, get_object_or_404
from models import Post, Category
from tags.models import Tag
from commons.simple_paginator import simple_paginator

def home(request):
    post_list = Post.objects.order_by('-pub_date')
    posts = simple_paginator(post_list, 10, request.GET.get('page'))
    return render(request, "blog/home.html", {"posts": posts})

def post(request, year, month, day, slug):
    return render(request, "blog/home.html")

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
    return render(request, "blog/home.html")
