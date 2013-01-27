import os
from django.utils.translation import ugettext_lazy as _
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.db import models
from commons.fields import CroppedImageField


class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        related_name='user_userprofile_user_profile',
        verbose_name=_("user"))

    activation_code = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("activation code"))

    occupation = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("occupation"))

    hobbies = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("hobbies"))

    website = models.URLField(
        blank=True,
        null=True,
        verbose_name=_("website"))

    picture = models.ImageField(
        upload_to="users/profiles/",
        blank=True,
        null=True,
        verbose_name=_("picture"))

    avatar = CroppedImageField(
        'picture',
        '125x125',
        set_select=[[0, 0], [125, 125]],
        min_size=[50, 50],
        blank=True,
        null=True,
        verbose_name=_("avatar"))

    lock_username = models.BooleanField(
        default=False,
        verbose_name=_("lock username"))

    has_password = models.BooleanField(
        default=False,
        verbose_name=_("has password"))

    use_name = models.BooleanField(
        default=False,
        verbose_name=_('display my real name '
                       'instead of my user name'))

    show_facebook = models.BooleanField(
        default=False,
        verbose_name=_('show my facebook account'))

    show_google_plus = models.BooleanField(
        default=False,
        verbose_name=_('show my google+ account'))

    show_twitter = models.BooleanField(
        default=False,
        verbose_name=_('show my twitter account'))

    show_github = models.BooleanField(
        default=False,
        verbose_name=_('show my github account'))

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
