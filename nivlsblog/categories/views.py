from nivlsblog.categories.models       import Category
from nivlsblog.entries.models          import Entry
from nivlsblog.libs.simple_paginator   import simple_paginator
from django.shortcuts                  import render_to_response, get_object_or_404, get_list_or_404

def show_entries(request, slug, page):
    cat = get_object_or_404(Category, slug=slug)
    cat_list = Category.objects.filter(left__gte=cat.left,
                                       right__lte=cat.right)
    entry_list = Entry.objects.select_related(depth=2).filter(category__in=cat_list).order_by('-date')

    entries = simple_paginator(entry_list, 5, page)
    return render_to_response("entries/list.html", {'entries': entries})
