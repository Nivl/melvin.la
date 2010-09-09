from nivlsblog.categories.models import Category
from nivlsblog.entries.models    import Entry
from django.core.paginator       import Paginator, InvalidPage, EmptyPage
from django.shortcuts            import render_to_response, get_object_or_404, get_list_or_404

def show_entries(request, slug):
    cat = get_object_or_404(Category, slug=slug)
    cat_list = Category.objects.filter(left__gte=cat.left,
                                       right__lte=cat.right)
    entry_list = Entry.objects.select_related(depth=2).filter(category__in=cat_list).order_by('-date')

    paginator = Paginator(entry_list, 5)
    try:
        page = int(request.GET.get('page', '1'))
    except ValueError:
        page = 1
    try:
        entries = paginator.page(page)
    except (EmptyPage, InvalidPage):
        entries = paginator.page(paginator.num_page)

    return render_to_response("entries/list.html", {'entries': entries})
