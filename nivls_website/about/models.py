from django.db import models
from django.contrib.sites.models import Site
from fileUpload.models import FileUpload

class StaticInfos(models.Model):
    site     = models.OneToOneField(Site, primary_key=True)
    about_me = models.TextField()
    profile  = models.TextField()
    skills   = models.TextField()
    awards   = models.TextField()
    uploads  = models.ManyToManyField(FileUpload, null=True, blank=True)

    def __unicode__(self):
        return self.site.__unicode__()

    class Meta():
        verbose_name = "static infos"
        verbose_name_plural = "static infos"
