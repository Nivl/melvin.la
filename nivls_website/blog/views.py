from django.shortcuts import render

def home(request):
    return render(request, "blog/home.html")

def post(request, year, month, day, slug):
    return render(request, "blog/home.html")

def post_list_by_categories(request, slug, page=None):
    return render(request, "blog/home.html")

def post_list_by_tags(request, slug, page=None):
    return render(request, "blog/home.html")

def post_list_by_archives(request, year, month=None, day=None, page=None):
    return render(request, "blog/home.html")
