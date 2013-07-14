from django.conf import settings
from django import template
from django.db.models import Count
from lab.models import Tag

register = template.Library()


@register.inclusion_tag("lab/templatetags/tags.haml")
def lab_tags():
    tags = Tag.objects.annotate(num_project=Count('project_tags')) \
                      .filter(num_project__gt=0,
                              project_tags__site=settings.SITE_ID) \
                      .order_by('-num_project', 'name')
    return {'tags': tags}
