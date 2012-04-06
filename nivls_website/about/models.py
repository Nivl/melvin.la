import os
from datetime import datetime
from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from commons.fields import ColorField
from lab.models import Project as LabProject
from commons.models import I18nSite

class Profile(models.Model):
    site     = models.OneToOneField(I18nSite, primary_key=True,
                                    default=settings.SITE_ID)
    about_me            = models.TextField()
    free_for_job        = models.BooleanField(default=True)

    def __unicode__(self):
        return self.site.language

    class Meta:
        verbose_name = _("Profile")
        verbose_name_plural = _("Profiles")

class ContactLink(models.Model):
    name        = models.CharField(max_length=255)
    link        = models.URLField()
    image       = models.ImageField(upload_to="about/contact"
                                    ,help_text="128x128 px")
    order       = models.PositiveSmallIntegerField(default=0)

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
        verbose_name = _("Contact link")
        verbose_name_plural = _("Contact links")


  ###########################################################################
##                                                                           ##
##                                Work                                       ##
##                                                                           ##
  ###########################################################################

class WorkType(models.Model):
    site  = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    name  = models.CharField(max_length=255)
    slug  = models.SlugField()
    color = ColorField()

    def __unicode__(self):
        return self.name

    class Meta:
        unique_together = ('site', 'slug')
        verbose_name = _("Work Type")
        verbose_name_plural = _("Work Types")


class WorkField(models.Model):
    site  = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    name  = models.CharField(max_length=255)
    slug  = models.SlugField()

    def __unicode__(self):
        return self.name

    class Meta:
        unique_together = ('site', 'slug')
        verbose_name = _("Work Field")
        verbose_name_plural = _("Work Fields")


class WorkProject(models.Model):
    site        = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    name        = models.CharField(max_length=255)
    slug        = models.SlugField()
    lab         = models.ForeignKey(LabProject, blank=True, null=True
                                    ,limit_choices_to={'site': settings.SITE_ID})
    prod_date   = models.DateField(default=datetime.now)
    screenshot  = models.ImageField(upload_to='about/portfolio/screenshots/',
                                    help_text='258x158 px')
    url         = models.URLField()
    description = models.TextField()
    works       = models.ManyToManyField(WorkType
                                         ,limit_choices_to={'site': settings.SITE_ID})
    field       = models.ForeignKey(WorkField
                                    ,limit_choices_to={'site': settings.SITE_ID})
    is_personal = models.BooleanField()

    def __unicode__(self):
        return self.name

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = Project.objects.get(pk=self.pk)
            if origin.screenshot != self.screenshot:
                if os.path.exists(origin.screenshot.path):
                    os.remove(origin.screenshot.path)
        super(Project, self).save(*arg, **kwargs)

    class Meta:
        unique_together = ('site', 'slug')
        verbose_name = _("Work Project")
        verbose_name_plural = _("Work Projects")


  ###########################################################################
##                                                                           ##
##                                C.V.                                       ##
##                                                                           ##
  ###########################################################################

class CVSection(models.Model):
    site  = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    name  = models.CharField(max_length=255)
    slug  = models.SlugField()
    order = models.PositiveSmallIntegerField(default=0)

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
        )

    site           = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    section        = models.ForeignKey(CVSection
                                       ,limit_choices_to={'site': settings.SITE_ID})
    name           = models.CharField(max_length=255)
    left           = models.PositiveSmallIntegerField()
    right          = models.PositiveSmallIntegerField()
    display_type   = models.CharField(max_length=1, default='L'
                                      ,choices=DISPLAY_TYPES)

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['section', 'left']
        unique_together = (('right', 'section'), ('left', 'section'))
        verbose_name = _("C.V. Category")
        verbose_name_plural = _("C.V. Categories")


class CVContent(models.Model):
    site              = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    category          = models.ForeignKey(CVCategory
                                       ,limit_choices_to={'site': settings.SITE_ID})
    order             = models.PositiveSmallIntegerField(default=0)
    key               = models.CharField(max_length=255, blank=True, null=True)
    value             = models.TextField()
    has_subcontent    = models.BooleanField(default=False)

    def __unicode__(self):
        return "%s - %s" % (self.key, self.value)

    class Meta:
        ordering = ['order']
        verbose_name = _("C.V. Content")
        verbose_name_plural = _("C.V. Contents")


class CVSubContent(models.Model):
    site           = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    content        = models.ForeignKey(CVContent
                                       ,limit_choices_to={'site': settings.SITE_ID})
    order          = models.PositiveSmallIntegerField(default=0)
    value          = models.CharField(max_length=255)

    def __unicode__(self):
        return self.value

    class Meta:
        ordering = ['order']
        verbose_name = _("C.V. Sub-content")
        verbose_name_plural = _("C.V. Sub-contents")
