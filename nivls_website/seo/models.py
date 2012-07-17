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
        null=True,
        blank=True,
        max_length=255,
        verbose_name=_("title"))

    description = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("description"))

    keywords = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("keywords"))

    free_javascript_block = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("free javascript block"))

    free_head_block = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("free head block"))

    def __unicode__(self):
        return self.site.__unicode__()

    class Meta:
        verbose_name = 'SEO'
        verbose_name_plural = 'SEO'
