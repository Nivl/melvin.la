import os
from datetime import datetime
from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from commons.fields import ColorField
from lab.models import Project as LabProject
from commons.models import I18nSite


class Profile(models.Model):
    site = models.OneToOneField(
        I18nSite,
        primary_key=True,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    about_me = models.TextField(
        verbose_name=_("about me"))

    free_for_job = models.BooleanField(
        default=True,
        verbose_name=_("free for job"))

    def __unicode__(self):
        return self.site.language

    class Meta:
        verbose_name = _("profile")
        verbose_name_plural = _("profiles")


class ContactLink(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    link = models.URLField(
        verbose_name=_("link"))

    image = models.ImageField(
        upload_to="about/contact",
        help_text="128x128 px",
        verbose_name=_("image"))

    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_("order"))

    def __unicode__(self):
        return self.name

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = ContactLink.objects.get(pk=self.pk)
            if origin.image != self.image:
                if os.path.exists(origin.image.path):
                    os.remove(origin.image.path)
        super(ContactLink, self).save(*arg, **kwargs)

    class Meta:
        ordering = ["order"]
        verbose_name = _("contact link")
        verbose_name_plural = _("contact links")


 ###########################################################################
##                                                                          ##
##                                Work                                      ##
##                                                                          ##
  ###########################################################################

class WorkType(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    color = ColorField(
        verbose_name=_("color")
        )

    def __unicode__(self):
        return self.name

    class Meta:
        unique_together = ('site', 'slug')
        verbose_name = _("work Type")
        verbose_name_plural = _("work Types")


class WorkField(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    def __unicode__(self):
        return self.name

    class Meta:
        unique_together = ('site', 'slug')
        verbose_name = _("work Field")
        verbose_name_plural = _("work Fields")


class WorkProject(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    is_personal = models.BooleanField(
        verbose_name=_("is personal"))

    school_project = models.BooleanField(
        verbose_name=_("school project"))

    lab = models.ForeignKey(
        LabProject,
        blank=True,
        null=True,
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("lab"))

    prod_date = models.DateField(
        default=datetime.now,
        verbose_name=_("production date"))

    screenshot = models.ImageField(
        upload_to='about/portfolio/',
        help_text='258x158 px',
        verbose_name=_("screenshot"))

    url = models.URLField(
        verbose_name=_("URL"))

    description = models.TextField(
        verbose_name=_("description"))

    works = models.ManyToManyField(
        WorkType,
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("work"))

    field = models.ForeignKey(
        WorkField,
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("field"))

    def __unicode__(self):
        return self.name

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = WorkProject.objects.get(pk=self.pk)
            if origin.screenshot != self.screenshot:
                if os.path.exists(origin.screenshot.path):
                    os.remove(origin.screenshot.path)
        super(WorkProject, self).save(*arg, **kwargs)

    class Meta:
        unique_together = ('site', 'slug')
        verbose_name = _("work Project")
        verbose_name_plural = _("work Projects")


  ###########################################################################
##                                                                          ##
##                                  C.V.                                    ##
##                                                                          ##
  ###########################################################################

class CVSection(models.Model):
    site = models.ForeignKey(
        I18nSite,
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
        unique_together = ('site', 'slug')
        verbose_name = _("C.V. Section")
        verbose_name_plural = _("C.V. Sections")


class CVCategory(models.Model):
    DISPLAY_TYPES = (
        ('L', 'List'),
        ('T', 'Table'),
        ('D', 'Description List'),)

    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    section = models.ForeignKey(
        CVSection,
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("Section"))

    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    left = models.PositiveSmallIntegerField(
        verbose_name=_("left"))

    right = models.PositiveSmallIntegerField(
        verbose_name=_("right"))

    display_type = models.CharField(
        max_length=1,
        default='L',
        choices=DISPLAY_TYPES,
        verbose_name=_("display type"))

    def __unicode__(self):
        return self.name

    def has_child(self):
        return self.right - self.left > 1

    def get_first_child(self):
        return CVCategory.objects.filter(left=(self.left + 1),
                                         section=self.section)

    def get_next_sibling(self):
        return CVCategory.objects.filter(left=(self.right + 1),
                                         section=self.section)

    class Meta:
        ordering = ['section', 'left']
        unique_together = (('right', 'section'), ('left', 'section'))
        verbose_name = _("C.V. Category")
        verbose_name_plural = _("C.V. Categories")


class CVContent(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    category = models.ForeignKey(
        CVCategory,
        limit_choices_to={'site': settings.SITE_ID},
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

    value_for_download = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("value for download"))

    has_subcontent = models.BooleanField(
        default=False,
        verbose_name=_("has subcontent"))

    def __unicode__(self):
        return "%s - %s" % (self.key, self.value)

    class Meta:
        ordering = ['order']
        verbose_name = _("C.V. Content")
        verbose_name_plural = _("C.V. Contents")


class CVSubContent(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    content = models.ForeignKey(
        CVContent,
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("content"))

    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_("order"))

    value = models.CharField(
        max_length=255,
        verbose_name=_("value"))

    def __unicode__(self):
        return self.value

    class Meta:
        ordering = ['order']
        verbose_name = _("C.V. Sub-content")
        verbose_name_plural = _("C.V. Sub-contents")
