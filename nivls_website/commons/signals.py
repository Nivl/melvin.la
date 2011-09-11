from django.contrib.comments.models import Comment
from django.contrib.comments.signals import comment_will_be_posted
from protection import akismet_is_valid


# http://www.brantsteen.com/blog/adding-akismet-to-django-comments/
def on_comment_will_be_posted(sender, comment, request, **kwargs):
    return akismet_is_valid(request, comment.comment)

comment_will_be_posted.connect(on_comment_will_be_posted,
                               sender=Comment,
                               dispatch_uid="comment_spam_check_akismet")

