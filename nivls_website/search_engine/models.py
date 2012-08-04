from django.utils.translation import gettext_lazy as _
from django.db import models


class Item(models.Model):
    content = models.CharField(
        max_length=255,
        verbose_name=_('content'))

    hit = models.PositiveIntegerField(
        default=0,
        verbose_name=_('hit'))

    def __unicode__(self):
        return self.content

    class Meta:
        ordering = ['-hit']
        verbose_name = _('item')
        verbose_name_plural = _('items')


class BlacklistedWord(models.Model):
    word = models.CharField(
        max_length=255,
        verbose_name=_('word'))

    def __unicode__(self):
        return self.word



    class Meta:
        verbose_name = _('blacklisted word')
        verbose_name_plural = _('blacklisted words')
