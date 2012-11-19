from django.conf import settings
from django.contrib.sites.models import Site
import akismet


def akismet_is_valid(request, data):
    current_site = Site.objects.get_current()
    data = data.encode('ascii', 'ignore')

    uagent = "David Lynch's Python library/1.0"
    domain = "http://" + current_site.domain + settings.DOMAIN_NAME
    key = settings.AKISMET_API_KEY

    try:
        api = akismet.Akismet(key, domain, uagent)

        if api.verify_key():
            is_spam = api.comment_check(data)
            if is_spam:
                return False
    except (akismet.AkismetError, akismet.APIKeyError) as e:
        print 'Something went wrong, allowing comment'
        print e.response, e.statuscode
    return True
