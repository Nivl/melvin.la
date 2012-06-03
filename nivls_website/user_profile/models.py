import os
from django.utils.translation import ugettext_lazy as _
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.db import models
from commons.fields import CroppedImageField

class UserProfile(models.Model):
    user             = models.OneToOneField(User)
    activation_code  = models.CharField(max_length=255, blank=True, null=True)

    occupation       = models.CharField(max_length=255, blank=True, null=True)
    hobbies          = models.CharField(max_length=255, blank=True, null=True)
    website          = models.URLField(blank=True, null=True)
    picture          = models.ImageField(upload_to="users/profiles/"
                                         , blank=True)
    avatar           = CroppedImageField('picture'
                                         , '125x125'
                                         , set_select=[[0,0], [125,125]]
                                         , min_size=[50, 50]
                                         , blank=True)
    lock_username    = models.BooleanField(default=False)
    use_name         = models.BooleanField(default=False, verbose_name=_('Display my real name instead of my user name'))
    show_facebook    = models.BooleanField(default=False, verbose_name=_('Show my facebook account'))
    show_google_plus = models.BooleanField(default=False, verbose_name=_('Show my google+ account'))
    show_twitter     = models.BooleanField(default=False, verbose_name=_('Show my twitter account'))
    show_github      = models.BooleanField(default=False, verbose_name=_('Show my github account'))

    def __unicode__(self):
        return self.user.__unicode__()

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = UserProfile.objects.get(pk=self.pk)
            if origin.picture != self.picture:
                if origin.picture and os.path.exists(origin.picture.path):
                    os.remove(origin.picture.path)
                p, s = self._meta.get_field('avatar').set_select
                self.avatar = '%dx%d %dx%d' % (p[0], p[1], s[0], s[1])
        super(UserProfile, self).save(*arg, **kwargs)


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

post_save.connect(create_user_profile, sender=User)
