from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.db.models.signals import pre_save
from django.dispatch.dispatcher import receiver
from commons.models import I18nSite


class Section(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        related_name='site_section_resumes',
        verbose_name=_("site"))

    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_("order"))

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ["order"]
        unique_together = ('site', 'slug')
        verbose_name = _("Section")
        verbose_name_plural = _("Sections")


class Category(models.Model):
    DISPLAY_TYPES = (
        ('L', 'List'),
        ('D', 'Description List'),
        ('B', 'Block'),)

    section = models.ForeignKey(
        Section,
        related_name='section_category',
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("Section"))

    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    order = models.PositiveIntegerField(
        verbose_name=_("order"))

    display_type = models.CharField(
        max_length=1,
        default='L',
        choices=DISPLAY_TYPES,
        verbose_name=_("display type"))

    image = models.ImageField(
        upload_to='cv/category/',
        null=True,
        blank=True,
        verbose_name=_("image"))

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['section', 'order']
        unique_together = ('order', 'section')
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")


@receiver(pre_save, sender=Category)
def category_presave(sender, instance, **kwargs):
    if instance.pk is not None:
        origin = Category.objects.get(pk=instance.pk)
        if origin.image and origin.image != instance.image:
            origin.image.delete(save=False)


class Content(models.Model):
    category = models.ForeignKey(
        Category,
        related_name='category_content',
        limit_choices_to={'section__site': settings.SITE_ID},
        verbose_name=_("category"))

    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_("order"))

    key = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("key"))

    value = models.TextField(
        verbose_name=_("value"))

    value_for_download = models.TextField(
        blank=True,
        null=True,
        verbose_name=_("value for download"))

    def __unicode__(self):
        return "%s - %s" % (self.key, self.value)

    class Meta:
        ordering = ['order']
        verbose_name = _("Content")
        verbose_name_plural = _("Contents")


class DocumentCategory(models.Model):
    site = models.ForeignKey(
        I18nSite,
        related_name='site_documentcategory_resumes',
        default=settings.SITE_ID,
        verbose_name=_("site"))

    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_("order"))

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ["order"]
        unique_together = ('site', 'name')
        verbose_name = _("Document category")
        verbose_name_plural = _("Documents category")


class Document(models.Model):
    category = models.ForeignKey(
        DocumentCategory,
        related_name='category_document',
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("category"))

    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_("order"))

    document = models.FileField(
        upload_to='about/documents/',
        verbose_name=_("document"))

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ["order"]
        unique_together = ('category', 'name')
        verbose_name = _("Document")
        verbose_name_plural = _("Documents")
