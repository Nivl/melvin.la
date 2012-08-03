from django.utils.translation import gettext_lazy as _
from django.db import models


class Item(models.Model):
    content = models.charfield(
        maxlength=255,
        verbose_name=_('content'))

    hit = models.PositiveIntegerField(
        verbose_name=_('hit'))

    class Meta:
        ordering = ['hit']
        verbose_name = _('item')
        verbose_name_plural = _('items')


class BlacklistedWord(models.Model):
    word = models.charfield(
        maxlength=255,
        verbose_name=_('word'))

    class Meta:
        verbose_name = _('blacklisted word')
        verbose_name_plural = _('blacklisted words')
