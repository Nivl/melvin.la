from django import template
from django.utils.safestring import mark_safe
from django.core.urlresolvers import reverse
from django.template.defaultfilters import title

register = template.Library()

@register.filter(is_safe=True)
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

@register.filter(is_safe=True)
def social_sign_in_links(providers, request):
    output = ""

    for provider in providers:
        provider = provider.replace('_', '-')

        output += '<li class="%(provider)s-icon"><a rel="tooltip" title="%(title)s" href="%(link)s%(next)s"></a>' % {
            'link': reverse("socialauth_begin", args=[provider])
            ,'next': '?next=' + request.get_full_path()
            ,'provider': provider
            ,'title': title(provider)
            }

    return mark_safe(output)

