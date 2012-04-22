#-*- coding: utf-8 -*-

from datetime import datetime
from django.db import models
from django.core.urlresolvers import reverse
from django.conf import settings
from commons.fields import ColorField
from commons.models import I18nSite
import os

class Tag(models.Model):
    name           = models.CharField(max_length=255)
    slug           = models.SlugField(unique=True)
    icon_enabled   = models.ImageField(upload_to='lab/icons/'
                                       ,help_text='32x32')
    icon_disabled  = models.ImageField(upload_to='lab/icons/'
                                       ,help_text='32x32')
    def admin_thumbnail(self):
        return u'<img src="%s" />' % (self.icon_enabled.url)
    admin_thumbnail.short_description = 'Thumbnail'
    admin_thumbnail.allow_tags = True

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = Tag.objects.get(pk=self.pk)
            if origin.icon_enabled != self.icon_enabled:
                if os.path.exists(origin.icon_enabled.path):
                    os.remove(origin.icon_enabled.path)
            if origin.icon_disabled != self.icon_disabled:
                if os.path.exists(origin.icon_disabled.path):
                    os.remove(origin.icon_disabled.path)
        super(Tag, self).save(*arg, **kwargs)

    def __unicode__(self):
        return self.name


class Language(models.Model):
    name  = models.CharField(max_length=255)
    slug  = models.SlugField(unique=True)
    color = ColorField()

    def __unicode__(self):
        return self.name


class License(models.Model):
    site        = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    name        = models.CharField(max_length=50)
    slug        = models.SlugField()
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


    class Meta:
        unique_together = ('site', 'slug')

class Coworker(models.Model):
    site        = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    name        = models.CharField(max_length=50)
    slug        = models.SlugField()
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

    class Meta:
        unique_together = ('site', 'slug')

class Client(models.Model):
    site        = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    name        = models.CharField(max_length=50)
    slug        = models.SlugField()
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

    class Meta:
        unique_together = ('site', 'slug')


class Project(models.Model):
    site             = models.ForeignKey(I18nSite, default=settings.SITE_ID)
    name             = models.CharField(max_length=255)
    slug             = models.SlugField()
    catchphrase      = models.CharField(max_length=255
                                        ,null=True, blank=True)
    overall_progress = models.PositiveSmallIntegerField(default=0)
    start_date       = models.DateField(default=datetime.now)
    license          = models.ForeignKey(License
                                         ,limit_choices_to={'site': settings.SITE_ID})
    sources_url      = models.URLField(null=True, blank=True)
    description      = models.TextField()
    edit_date        = models.DateField(auto_now=True)
    demo_codebox     = models.TextField(null=True, blank=True)
    languages        = models.ManyToManyField(Language
                                          ,through='ProjectLanguageRate')
    coworkers        = models.ManyToManyField(Coworker, null=True, blank=True,
                                              limit_choices_to={'site': settings.SITE_ID})
    clients          = models.ManyToManyField(Client, null=True, blank=True,
                                          limit_choices_to={'site': settings.SITE_ID})
    tags             = models.ManyToManyField(Tag, null=True, blank=True)

    def __unicode__(self):
        return self.name

    @models.permalink
    def get_absolute_url(self):
        return ('lab-project', (), {'slug': self.slug})

    class Meta:
        unique_together = ('site', 'slug')


class ProjectLanguageRate(models.Model):
    language    = models.ForeignKey(Language)
    project     = models.ForeignKey(Project)
    rate        = models.PositiveIntegerField()

    def __unicode__(self):
        return "%s / %s" % (self.project, self.language)


class Progress(models.Model):
    description = models.CharField(max_length=255)
    pub_date    = models.DateField(default=datetime.now)
    project     = models.ForeignKey(Project)

    def __unicode__(self):
        return "%s" % self.pub_date

    class Meta:
        ordering = ['-pub_date']


class Todo(models.Model):
    task = models.CharField(max_length=255)
    project     = models.ForeignKey(Project)

    def __unicode__(self):
        return self.task


class Image(models.Model):
    name        = models.CharField(max_length=255)
    description  = models.TextField()
    image       = models.ImageField(upload_to="lab/projets/images/")
    project     = models.ForeignKey(Project)

    def __unicode__(self):
        return self.name


class DownloadIcon(models.Model):
    name        = models.CharField(max_length=50)
    image       = models.ImageField(upload_to="lab/projets/downloads/icons/"
                                    ,help_text="128x128")

    def admin_thumbnail(self):
        return u'<img src="%s" />' % (self.image.url)
    admin_thumbnail.short_description = 'Thumbnail'
    admin_thumbnail.allow_tags = True

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
    uploaded_file  = models.FileField(upload_to="lab/projets/downloads/files/"
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
    thumbnail    = models.ImageField(upload_to="lab/projets/videos/")
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
