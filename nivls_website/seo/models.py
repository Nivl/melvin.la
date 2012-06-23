from django.db import models
from django.conf import settings
from commons.models import I18nSite
from django.utils.translation import ugettext_lazy as _


class SEO(models.Model):
    site = models.ForeignKey(
        I18nSite,
        primary_key=True,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    title = models.CharField(
        max_length=255,
        verbose_name=_("title"))

    description = models.TextField(
        verbose_name=_("description"))
    keywords = models.TextField(
        verbose_name=_("keywords"))
    free_block = models.TextField(
        verbose_name=_("free block"))

    def __unicode__(self):
        return self.site.__unicode__()

    class Meta:
        verbose_name = 'SEO'
        verbose_name_plural = 'SEO'
