from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from commons.models import I18nSite


class SEO(models.Model):
    site = models.ForeignKey(
        I18nSite,
        primary_key=True,
        default=settings.SITE_ID,
        related_name='site_seo_seo',
        verbose_name=_("site"))

    title = models.CharField(
        null=True,
        blank=True,
        max_length=60,
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


class SeoEverywhere(models.Model):
    description = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        verbose_name=_("description"))

    keywords = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("keywords"))

    content_type = models.ForeignKey(
        ContentType,
        null=True,
        blank=True)

    object_id = models.PositiveIntegerField(
        null=True,
        blank=True)

    content_object = generic.GenericForeignKey(
        'content_type',
        'object_id')


class SeoMicroData(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    content = models.TextField(
        verbose_name=_("content"))

    content_type = models.ForeignKey(
        ContentType,
        null=True,
        blank=True)

    object_id = models.PositiveIntegerField(
        null=True,
        blank=True)

    content_object = generic.GenericForeignKey(
        'content_type',
        'object_id')
