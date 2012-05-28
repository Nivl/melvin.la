from django.utils.translation import ugettext_lazy as _
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.db import models
from commons.fields import CroppedImageField

class UserProfile(models.Model):
    user             = models.OneToOneField(User)
    activation_code  = models.CharField(max_length=255, blank=True, null=True)
    picture          = models.ImageField(upload_to="users/profiles/"
                                         , blank=True)
    avatar           = CroppedImageField('picture'
                                         , '125x125'
                                         , set_select=[[0,0], [125,125]]
                                         , min_size=[50, 50]
                                         , blank=True)
    use_name         = models.BooleanField(default=False, verbose_name=_('Display my real name instead of my user name'))
    show_facebook    = models.BooleanField(default=False, verbose_name=_('Show my facebook account'))
    show_google_plus = models.BooleanField(default=False, verbose_name=_('Show my google+ account'))
    show_twitter     = models.BooleanField(default=False, verbose_name=_('Show my twitter account'))
    show_github      = models.BooleanField(default=False, verbose_name=_('Show my github account'))

    def __unicode__(self):
        return self.user.__unicode__()

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

post_save.connect(create_user_profile, sender=User)
