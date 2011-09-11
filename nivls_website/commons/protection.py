from django.conf import settings
import akismet

def akismet_is_valid(request, data):
    akismet.USERAGENT = "David Lynch's Python library/1.0"

    try:
        real_key = akismet.verify_key(settings.AKISMET_API_KEY,
                                      "http://" + settings.DOMAIN_NAME)
        if real_key:
            is_spam = akismet.comment_check(settings.AKISMET_API_KEY,
                                            "http://" + settings.DOMAIN_NAME,
                                            request.META['REMOTE_ADDR'],
                                            request.META['HTTP_USER_AGENT'],
                                            comment_content=data)
            if is_spam:
                return False
    except akismet.AkismetError, e:
        print 'Something went wrong, allowing comment'
        print e.response, e.statuscode
    return True
