from django import template
from django.db.models import Count
from django.conf import settings
from blog.models import Carousel, Post, Menu, Tag, Category

register = template.Library()


@register.inclusion_tag("blog/templatetags/carousel.haml")
def blog_carousel(outside=False):
    posts = Carousel.objects.filter(site=settings.SITE_ID)
    return {'posts': posts,
            'outside': outside}


@register.inclusion_tag("blog/templatetags/latest_posts.haml")
def blog_latest_posts(n, outside=False):
    posts = Post.objects.filter(is_public=True,
                                site=settings.SITE_ID) \
                        .order_by('-pub_date')[:n]
    return {'posts': posts,
            'outside': outside}


@register.inclusion_tag("blog/templatetags/menus.haml")
def blog_menus():
    menus = Menu.objects.filter(hide=False,
                                site=settings.SITE_ID) \
                        .order_by('order')
    return {'menus': menus}


@register.inclusion_tag("blog/templatetags/archives.haml")
def blog_archives():
    dates = Post.objects.filter(is_public=1,
                                site=settings.SITE_ID) \
                        .dates('pub_date', 'month', order='DESC')
    return {'dates': dates}


@register.inclusion_tag("blog/templatetags/tag_cloud.haml")
def blog_tagcloud():
    tags = Tag.objects.filter(site=settings.SITE_ID) \
                      .order_by("name") \
                      .annotate(num_post=Count('tags_post__id'))
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


@register.inclusion_tag("blog/templatetags/categories.haml")
def blog_categories():
    categories = Category.objects.filter(site=settings.SITE_ID)
    return {'categories': categories}
