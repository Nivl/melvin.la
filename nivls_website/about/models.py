import os
from datetime import datetime
from django.db import models
from django.contrib.sites.models import Site
from commons.fields import ColorField

class StaticInfos(models.Model):
    site     = models.OneToOneField(Site, primary_key=True)
    about_me = models.TextField()
    profile  = models.TextField()
    skills   = models.TextField()
    awards   = models.TextField()

    def __unicode__(self):
        return self.site.__unicode__()

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
    name  = models.CharField(max_length=255)
    slug  = models.SlugField(unique=True)
    color = ColorField()

    def __unicode__(self):
        return self.name


class Field(models.Model):
    name  = models.CharField(max_length=255)
    slug  = models.SlugField(unique=True)

    def __unicode__(self):
        return self.name


class Project(models.Model):
    name        = models.CharField(max_length=255)
    slug        = models.SlugField(unique=True)
    prod_date   = models.DateField(default=datetime.now)
    screenshot  = models.ImageField(upload_to='site/portfolio/screenshots/',
                                    help_text='258x158 px')
    url         = models.URLField()
    description = models.TextField()
    works       = models.ManyToManyField(Work)
    field       = models.ForeignKey(Field)
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
