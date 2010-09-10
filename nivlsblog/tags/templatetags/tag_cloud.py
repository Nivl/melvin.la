from django                import template
from nivlsblog.tags.models import Tag

register = template.Library()

@register.inclusion_tag('tags/templatetags/flash_tag_cloud.html')
def flash_tag_cloud():
    tags = Tag.objects.all()
    return {'tags': tags}
