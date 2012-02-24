from django.db import models
from django.contrib.sites.models import Site
from django.conf import settings

class SEO(models.Model):
    site        = models.ForeignKey(Site, primary_key=True
                                    ,default=settings.SITE_ID)
    title       = models.CharField(max_length=255)
    description = models.TextField()
    keywords    = models.TextField()
    free_block  = models.TextField()

    def __unicode__(self):
        return self.site.__unicode__()

    class Meta:
        verbose_name = 'SEO'
        verbose_name_plural = 'SEO'
