from django import template
from django.db.models import Count
from django.contrib.sites.models import Site
from blog.models import *

register = template.Library()


@register.inclusion_tag("blog/templatetags/carousel.html")
def blog_carousel():
    posts = Carousel.objects.filter(site=Site.objects.get_current())
    return {'posts': posts}


@register.inclusion_tag("blog/templatetags/menus.html")
def blog_menus():
    menus = Menu.objects.filter(hide=False,
                                site=Site.objects.get_current()) \
                        .order_by('order')
    return {'menus': menus}


@register.inclusion_tag("blog/templatetags/archives.html")
def blog_archives():
    dates = Post.objects.filter(is_public=1,
                                site=Site.objects.get_current()) \
                        .dates('pub_date', 'month', order='DESC')
    return {'dates': dates}


@register.inclusion_tag("blog/templatetags/tag_cloud.html")
def blog_tagcloud():
    tags = Tag.objects.filter(site=Site.objects.get_current()) \
                      .order_by("name") \
                      .annotate(num_post=Count('post__id'))
    tag_list = list()

    largest = 24
    smallest = 10

    if tags:
        for i, tag in enumerate(tags):
            if i == 0:
                count_min = tag.num_post
                count_max = tag.num_post
            else:
                if count_min > tag.num_post:
                    count_min = tag.num_post
                elif count_max < tag.num_post:
                    count_max = tag.num_post

        spread = count_max - count_min
        if spread <= 0:
            spread = 1
        font_spread = largest - smallest
        font_step = font_spread / spread

        for i, tag in enumerate(tags):
            tag_size = int(smallest + ((tag.num_post - count_min) * font_step))
            tag_list.append({"obj": tag, "size": tag_size})

    return {'tags': tag_list}


@register.inclusion_tag("blog/templatetags/categories.html")
def blog_categories():
    categories = Category.objects.filter(site=Site.objects.get_current()) \
        .order_by('left')

    cat_list = list()
    if categories:
        for i, cat in enumerate(categories):
            cat_list.append(cat)
            if cat.is_root:
                last_root = cat
            if i != 0 and (not cat.is_root or not categories[i - 1].is_root):
                r = cat.left - categories[i - 1].right
                if r > 1:
                    for j in range(r - 1):
                        cat_list.insert(cat_list.index(cat), 'level_down')
                if i == len(categories) - 1:
                    for j in range(last_root.right - cat.right):
                        cat_list.append('level_down')
            if cat.has_child():
                cat_list.append('level_up')
    return {'nested_tree': cat_list}
