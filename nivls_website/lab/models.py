#-*- coding: utf-8 -*-

from datetime import datetime
from django.db import models
from django.core.urlresolvers import reverse
from django.conf import settings
from commons.fields import ColorField
from django.contrib.sites.models import Site
import os

class Language(models.Model):
    name  = models.CharField(max_length=255)
    slug  = models.SlugField(unique=True)
    color = ColorField()

    def __unicode__(self):
        return self.name


class License(models.Model):
    name        = models.CharField(max_length=50)
    slug        = models.SlugField(unique=True)
    url         = models.URLField(null=True, blank=True)
    image       = models.ImageField(upload_to="lab/licenses/"
                                    ,null=True
                                    ,blank=True)

    def __unicode__(self):
        return self.name

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = License.objects.get(pk=self.pk)
            if origin.image != self.image:
                if os.path.exists(origin.image.path):
                    os.remove(origin.image.path)
        super(License, self).save(*arg, **kwargs)


class Coworker(models.Model):
    site        = models.ForeignKey(Site, default=settings.SITE_ID)
    name        = models.CharField(max_length=50)
    slug        = models.SlugField(unique=True)
    description = models.CharField(max_length=255)
    url         = models.URLField(null=True, blank=True)
    image       = models.ImageField(upload_to="lab/coworker/"
                                    ,help_text="126x126")

    def __unicode__(self):
        return self.name

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = Coworker.objects.get(pk=self.pk)
            if origin.image != self.image:
                if os.path.exists(origin.image.path):
                    os.remove(origin.image.path)
        super(Coworker, self).save(*arg, **kwargs)


class Client(models.Model):
    site        = models.ForeignKey(Site, default=settings.SITE_ID)
    name        = models.CharField(max_length=50)
    slug        = models.SlugField(unique=True)
    description = models.CharField(max_length=255)
    url         = models.URLField(null=True, blank=True)
    image       = models.ImageField(upload_to="lab/client/"
                                    ,help_text="126x126")

    def __unicode__(self):
        return self.name

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = Client.objects.get(pk=self.pk)
            if origin.image != self.image:
                if os.path.exists(origin.image.path):
                    os.remove(origin.image.path)
        super(Client, self).save(*arg, **kwargs)


class Project(models.Model):
    site         = models.ForeignKey(Site, default=settings.SITE_ID)
    name         = models.CharField(max_length=255)
    description  = models.TextField()
    slug         = models.SlugField(unique=True)
    start_date   = models.DateField(default=datetime.now)
    edit_date    = models.DateField(auto_now=True)
    license      = models.ForeignKey(License)
    sources_url  = models.URLField(null=True, blank=True)
    demo_codebox = models.TextField(null=True, blank=True)
    languages    = models.ManyToManyField(Language
                                          ,through='ProjectLanguageRate')
    coworkers    = models.ManyToManyField(Coworker, null=True, blank=True)
    clients      = models.ManyToManyField(Client, null=True, blank=True)

    def __unicode__(self):
        return self.name

    @models.permalink
    def get_absolute_url(self):
        return ('project', (), {'slug': self.slug})

class ProjectLanguageRate(models.Model):
    language    = models.ForeignKey(Language)
    project     = models.ForeignKey(Project)
    rate        = models.PositiveIntegerField()

    def __unicode__(self):
        return "%s / %s" % (self.project, self.language)

class Progress(models.Model):
    description = models.TextField()
    pub_date    = models.DateField(default=datetime.now)
    project     = models.ForeignKey(Project)

    def __unicode__(self):
        return "%s" % self.pub_date

    class Meta:
        ordering = ['-pub_date']

class Image(models.Model):
    name        = models.CharField(max_length=255)
    description  = models.TextField()
    image       = models.ImageField(upload_to="labs/projets/images/")
    project     = models.ForeignKey(Project)

    def __unicode__(self):
        return self.name


class DownloadIcon(models.Model):
    name        = models.CharField(max_length=50)
    image       = models.ImageField(upload_to="labs/projets/downloads/icons/"
                                    ,help_text="128x128")

    def __unicode__(self):
        return self.name

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = DownloadIcon.objects.get(pk=self.pk)
            if origin.image != self.image:
                if os.path.exists(origin.image.path):
                    os.remove(origin.image.path)
        super(DownloadIcon, self).save(*arg, **kwargs)


class Download(models.Model):
    name           = models.CharField(max_length=50)
    description    = models.CharField(max_length=255, null=True, blank=True)
    uploaded_file  = models.FileField(upload_to="labs/projets/downloads/files/"
                                      ,null=True, blank=True)
    url            = models.URLField(null=True, blank=True)
    icon           = models.ForeignKey(DownloadIcon)
    project        = models.ForeignKey(Project)

    def __unicode__(self):
        return self.name


class Video(models.Model):
    name         = models.CharField(max_length=255)
    description  = models.TextField()
    url          = models.URLField()
    thumbnail    = models.ImageField(upload_to="labs/projets/videos/")
    is_iframe    = models.BooleanField()
    project      = models.ForeignKey(Project)

    def __unicode__(self):
        return self.name

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = Video.objects.get(pk=self.pk)
            if origin.thumbnail != self.thumbnail:
                if os.path.exists(origin.thumbnail.path):
                    os.remove(origin.thumbnail.path)
        super(Video, self).save(*arg, **kwargs)
