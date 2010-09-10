from django                      import template
from nivlsblog.categories.models import Category

register = template.Library()

@register.inclusion_tag('categories/templatetags/category_list.html')
def category_list():
    cat_list = Category.objects.order_by('left', 'level')
    return {'categories': cat_list}
