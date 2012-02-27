import os
from datetime import datetime
from django.db import models
from django.conf import settings
from commons.fields import ColorField
from lab.models import Project as LabProject
from commons.models import I18nSite

class StaticInfos(models.Model):
    site     = models.OneToOneField(I18nSite, primary_key=True,
                                    default=settings.SITE_ID)
    about_me = models.TextField()
    profile  = models.TextField()
    skills   = models.TextField()
    awards   = models.TextField()

    def __unicode__(self):
        return self.site.language

    def save(self, *arg, **kwargs):
        super(StaticInfos, self).save(*arg, **kwargs)
        try:
            ping_google()
        except Exception:
            pass

    class Meta():
        verbose_name = "static infos"
        verbose_name_plural = "static infos"


class Work(models.Model):
    site  = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    name  = models.CharField(max_length=255)
    slug  = models.SlugField()
    color = ColorField()

    def __unicode__(self):
        return self.name

    class Meta:
        unique_together = ('site', 'slug')

class Field(models.Model):
    site  = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    name  = models.CharField(max_length=255)
    slug  = models.SlugField()

    def __unicode__(self):
        return self.name

    class Meta:
        unique_together = ('site', 'slug')

class Project(models.Model):
    site        = models.ForeignKey(I18nSite, default=settings.SITE_ID
                                    ,related_name="%(app_label)s_%(class)s_related")
    name        = models.CharField(max_length=255)
    slug        = models.SlugField()
    lab         = models.ForeignKey(LabProject, blank=True, null=True
                                    ,limit_choices_to={'site': settings.SITE_ID})
    prod_date   = models.DateField(default=datetime.now)
    screenshot  = models.ImageField(upload_to='site/portfolio/screenshots/',
                                    help_text='258x158 px')
    url         = models.URLField()
    description = models.TextField()
    works       = models.ManyToManyField(Work
                                         ,limit_choices_to={'site': settings.SITE_ID})
    field       = models.ForeignKey(Field
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
        try:
            ping_google()
        except Exception:
            pass

    class Meta:
        unique_together = ('site', 'slug')
