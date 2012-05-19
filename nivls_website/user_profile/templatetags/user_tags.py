from django import template
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter
def social_link(user_social):
    username = user_social.extra_data.get('username')
    extra_id = user_social.extra_data.get('id')
    providers_links = {
        'facebook': 'https://www.facebook.com/%s/info' % username
        ,'twitter': 'https://www.twitter.com/%s' % username
        ,'google-oauth2': 'https://plus.google.com/%s/about' % extra_id
        ,'github': 'https://github.com/%s' % username
        }

    return mark_safe('<a href="%s">%s</a>'
                     % (providers_links[user_social.provider], username))
