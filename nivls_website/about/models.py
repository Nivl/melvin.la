from django.db import models
from django.contrib.sites.models import Site

class StaticInfos(models.Model):
    site     = models.OneToOneField(Site, primary_key=True)
    about_me = models.TextField()

    def __unicode__(self):
        return self.site.__unicode__()

    class Meta():
        verbose_name = "static infos"
        verbose_name_plural = "static infos"
