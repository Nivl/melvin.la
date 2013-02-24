from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.db.models.signals import pre_save
from django.dispatch.dispatcher import receiver
from lab.models import Project as LabProject
from commons.models import I18nSite


class NavigationLink(models.Model):
    site = models.ForeignKey(
        I18nSite,
        related_name='site_navigationlink_about',
        default=settings.SITE_ID,
        verbose_name=_("site"))

    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    description = models.CharField(
        max_length=255,
        verbose_name=_("description"))

    link = models.CharField(
        max_length=255,
        verbose_name=_("link"))

    link_attributes = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("link attributes"))

    icon = models.CharField(
        max_length=30,
        verbose_name=_("icon"))

    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_("order"))

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ["order"]
        verbose_name = _("navigation link")
        verbose_name_plural = _("navigation links")


class Profile(models.Model):
    site = models.OneToOneField(
        I18nSite,
        primary_key=True,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    about_me = models.TextField(
        verbose_name=_("about me"))

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

    link_attributes = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("link attributes"))

    icon = models.CharField(
        max_length=30,
        verbose_name=_("icon"))

    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_("order"))

    def __unicode__(self):
        return self.name

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
        related_name='site_worktype_about',
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
        verbose_name = _("work Type")
        verbose_name_plural = _("work Types")


class WorkProject(models.Model):
    lab = models.ForeignKey(
        LabProject,
        primary_key=True,
        related_name='lab_workproject_about',
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("lab"))

    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_("order"))

    screenshot = models.ImageField(
        upload_to='about/portfolio/',
        help_text='350x214 px',
        verbose_name=_("screenshot"))

    description = models.TextField(
        verbose_name=_("description"))

    works = models.ManyToManyField(
        WorkType,
        related_name='works_workpoject',
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("work"))

    def __unicode__(self):
        return self.lab.name

    class Meta:
        ordering = ["order"]
        verbose_name = _("work Project")
        verbose_name_plural = _("work Projects")


@receiver(pre_save, sender=WorkProject)
def workProject_presave(sender, instance, **kwargs):
    if instance.pk is not None:
        origin = WorkProject.objects.get(pk=instance.pk)
        if origin.screenshot != instance.screenshot:
            origin.screenshot.delete(save=False)
