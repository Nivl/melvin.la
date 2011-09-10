from django.contrib.comments.models import Comment
from django.contrib.comments.signals import comment_will_be_posted
from django.conf import settings
import akismet

# http://www.brantsteen.com/blog/adding-akismet-to-django-comments/
def on_comment_will_be_posted(sender, comment, request, **kwargs):
    akismet.USERAGENT = "David Lynch's Python library/1.0"

    try:
        real_key = akismet.verify_key(settings.AKISMET_API_KEY,
                                      "http://" + settings.DOMAIN_NAME)
        if real_key:
            is_spam = akismet.comment_check(settings.AKISMET_API_KEY,
                                            "http://" + settings.DOMAIN_NAME,
                                            request.META['REMOTE_ADDR'],
                                            request.META['HTTP_USER_AGENT'],
                                            comment_content=comment.comment)
            if is_spam:
                return False
            else:
                return True
    except akismet.AkismetError, e:
        print 'Something went wrong, allowing comment'
        print e.response, e.statuscode
        return True

comment_will_be_posted.connect(on_comment_will_be_posted,
                               sender=Comment,
                               dispatch_uid="comment_spam_check_akismet")

