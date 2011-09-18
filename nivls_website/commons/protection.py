from django.conf import settings
import akismet

def akismet_is_valid(request, data):
    akismet.USERAGENT = "David Lynch's Python library/1.0"

    if request.subdomain:
        domain = "http://" + request.subdomain + settings.DOMAIN_NAME
    else:
        domain = "http://" + settings.DOMAIN_NAME

    try:
        real_key = akismet.verify_key(settings.AKISMET_API_KEY,
                                      domain)
        if real_key:
            is_spam = akismet.comment_check(settings.AKISMET_API_KEY,
                                            domain,
                                            request.META['REMOTE_ADDR'],
                                            request.META['HTTP_USER_AGENT'],
                                            comment_content=data)
            if is_spam:
                return False
    except akismet.AkismetError, e:
        print 'Something went wrong, allowing comment'
        print e.response, e.statuscode
    return True
