from hashlib import md5
from django import template
from django.utils.safestring import mark_safe
from django.core.urlresolvers import reverse
from django.template.defaultfilters import title
from social_auth.models import UserSocialAuth

register = template.Library()


@register.filter(is_safe=True)
def social_link(user_social):
    username = user_social.extra_data.get('username')
    extra_id = user_social.extra_data.get('id')
    providers_links = {
        'facebook': 'https://www.facebook.com/%s' % extra_id,
        'twitter': 'https://www.twitter.com/%s' % username,
        'google-oauth2': 'https://plus.google.com/%s/about' % extra_id,
        'github': 'https://github.com/%s' % username, }

    return mark_safe('<a href="%s">%s</a>'
                     % (providers_links[user_social.provider],
                        username)
                     )


@register.filter(is_safe=True)
def social_user_links(user):
    profile = user.get_profile()
    accounts = UserSocialAuth.objects.filter(user=user)
    providers_links = {
        'facebook': {'show': profile.show_facebook,
                     'link': 'https://www.facebook.com/[id]'},
        'twitter': {'show': profile.show_twitter,
                    'link': 'https://www.twitter.com/[uname]'},
        'google-oauth2': {'show': profile.show_google_plus,
                          'link': 'https://plus.google.com/[id]'},
        'github': {'show': profile.show_github,
                   'link': 'https://github.com/[uname]'}, }

    output = ''
    for account in accounts:
        if providers_links[account.provider]['show']:
            extra = account.extra_data
            if not 'id' in extra:
                extra['id'] = ''
            link = providers_links[account.provider]['link'] \
                .replace('[uname]', extra['username']) \
                .replace('[id]', str(extra['id']))

            output += '<li class="%(provider)s-icon">' \
                '<a rel="tooltip" title="%(title)s" href="%(link)s"></a>' \
                % {
                'link': link,
                'provider': account.provider,
                'title': title(account.provider)
                }

    return mark_safe(output)


@register.filter(is_safe=True)
def social_sign_in_links(providers, request):
    output = ""

    for provider in providers:
        provider = provider.replace('_', '-')

        output += '<li class="%(provider)s-icon">'\
            '<a rel="tooltip" title="%(title)s" href="%(link)s%(next)s"></a>'\
            % {
            'link': reverse("socialauth_begin", args=[provider]),
            'next': '?next=' + request.get_full_path(),
            'provider': provider,
            'title': title(provider)
            }

    return mark_safe(output)


@register.inclusion_tag("inc/dummy.haml")
def square_thumbnail(user, size=80, itemprop=False):
    profile = user.get_profile()
    if profile.picture:
        pos, dim = profile.avatar.split(' ')
        pos = pos.split('x')
        dim = dim.split('x')

        coeff = float(size) / float(dim[0])
        x = -(int(int(pos[0]) * coeff))
        y = -(int(int(pos[1]) * coeff))
        w = (int(profile.picture.width * coeff))
        h = (int(profile.picture.height * coeff))

        microdata = 'image' if (bool(itemprop)) else ''

        return {'template': 'users/templatetags/thumbnail.haml',
                'needed_size': size,
                'pos_x': x,
                'pos_y': y,
                'resize_w': w,
                'resize_h': h,
                'image_url': profile.picture.url,
                'microdata': microdata,
                }

    return gravatar(user, size, itemprop)


@register.inclusion_tag("inc/dummy.haml")
def gravatar(user, size=80, itemprop=False):
    return gravatar_from_email(user.email, user.username, size, itemprop)


@register.inclusion_tag("inc/dummy.haml")
def gravatar_from_email(email, alt="gravatar", size=80, itemprop=False):
    g_hash = md5(email.lower()).hexdigest()
    link = 'http://www.gravatar.com/avatar/'
    microdata = 'image' if (bool(itemprop)) else ''

    return {'template': 'users/templatetags/gravatar.haml',
            'alt': alt,
            'src': link + g_hash,
            'microdata': microdata,
            'size': size, }
