from django import template
from blog.models import Post

register = template.Library()

@register.inclusion_tag("slideshow.html")
def blog_slideshow():
    posts = Post.objects.all()[:5]
    return {'object': posts}
