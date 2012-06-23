from django.db import models
from django.utils.translation import ugettext_lazy as _


class Logger404(models.Model):
    url = models.URLField(
        verbose_name=_("URL"))

    hit = models.PositiveIntegerField(
        default=0,
        verbose_name=_("hit"))

    host = models.CharField(
        max_length=255,
        verbose_name=_("host"))

    referer = models.CharField(
        max_length=255,
        verbose_name=_("referer"))

    user_agent = models.CharField(
        max_length=255,
        verbose_name=_("user agent"))

    remote_addr = models.CharField(
        max_length=255,
        verbose_name=_("remote address"))

    remote_host = models.CharField(
        max_length=255,
        verbose_name=_("remote Host"))

    method = models.CharField(
        max_length=255,
        verbose_name=_("method"))

    def __unicode__(self):
        return self.url

    class Meta:
        verbose_name_plural = 'Logger404'
        ordering = ['-hit']
