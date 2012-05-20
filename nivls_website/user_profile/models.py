from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user             = models.OneToOneField(User)
    activation_code  = models.CharField(max_length=255, blank=True, null=True)
    avatar           = models.ImageField(upload_to="users/profiles/"
                                         , blank=True)
    show_facebook    = models.BooleanField(default=False)
    show_google_plus = models.BooleanField(default=False)
    show_twitter     = models.BooleanField(default=False)
    show_github      = models.BooleanField(default=False)

    def __unicode__(self):
        return self.user.__unicode__()

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

post_save.connect(create_user_profile, sender=User)
