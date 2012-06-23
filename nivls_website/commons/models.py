import os
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.contrib.sites.models import Site


class I18nSite(models.Model):
    site = models.OneToOneField(
        Site,
        primary_key=True,
        verbose_name=_("site"))

    language = models.CharField(
        max_length=100,
        verbose_name=_("language"))

    flag = models.ImageField(
        upload_to='common/flags/',
        verbose_name=_("flag"))

    def __unicode__(self):
        return self.language

    def save(self, *arg, **kwargs):
        try:
            origin = I18nSite.objects.get(pk=self.pk)
            if origin.flag != self.flag:
                if os.path.exists(origin.flag.path):
                    os.remove(origin.flag.path)
        except:
            pass
        super(I18nSite, self).save(*arg, **kwargs)
