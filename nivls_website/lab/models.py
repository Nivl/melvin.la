#-*- coding: utf-8 -*-
from django.utils.translation import ugettext_lazy as _
from datetime import datetime
from django.contrib.auth.models import User
from django.db import models
from django.core.urlresolvers import reverse
from django.conf import settings
from commons.fields import ColorField
from commons.models import I18nSite
import os


class Tag(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    slug = models.SlugField(
        unique=True,
        verbose_name=_("slug"))

    icon_enabled = models.ImageField(
        upload_to='lab/icons/',
        help_text='32x32',
        verbose_name=_("Icon enabled"))

    icon_disabled = models.ImageField(
        upload_to='lab/icons/',
        help_text='32x32',
        verbose_name=_("Icon disabled"))

    def admin_thumbnail(self):
        return u'<img src="%s" />' % (self.icon_enabled.url)
    admin_thumbnail.short_description = 'Thumbnail'
    admin_thumbnail.allow_tags = True

    @models.permalink
    def get_absolute_url(self):
        return ('lab-tag', (), {'slug': self.slug})

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
    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    slug = models.SlugField(
        unique=True,
        verbose_name=_("slug"))

    color = ColorField(
        verbose_name=_("Color"))

    def __unicode__(self):
        return self.name


class License(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("Site"))

    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    url = models.URLField(
        null=True,
        blank=True,
        verbose_name=_("URL"))

    image = models.ImageField(
        upload_to="lab/licenses/",
        null=True,
        blank=True,
        verbose_name=_("Image"))

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
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("Site"))

    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    description = models.CharField(
        max_length=255,
        verbose_name=_("Description"))

    url = models.URLField(
        null=True,
        blank=True,
        verbose_name=_("URL"))

    image = models.ImageField(
        upload_to="lab/coworker/",
        help_text="126x126",
        verbose_name=_("Image"))

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
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("Site"))

    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    description = models.CharField(
        max_length=255,
        verbose_name=_("Description"))

    url = models.URLField(
        null=True,
        blank=True,
        verbose_name=_("URL"))

    image = models.ImageField(
        upload_to="lab/client/",
        help_text="126x126",
        verbose_name=_("Image"))

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
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("Site"))

    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    catchphrase = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_("Catchphrase"))

    overall_progress = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_("Overall progress"))

    start_date = models.DateField(
        default=datetime.now,
        verbose_name=_("Start date"))

    license = models.ForeignKey(
        License,
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("License"))

    sources_url = models.URLField(
        null=True,
        blank=True,
        verbose_name=_("Source URL"))

    description = models.TextField(
        verbose_name=_("Description"))

    edit_date = models.DateField(
        auto_now=True,
        verbose_name=_("Edit date"))

    demo_codebox = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("Demo codebox"))

    languages = models.ManyToManyField(
        Language,
        through='ProjectLanguageRate',
        verbose_name=_("Languages"))

    coworkers_user = models.ManyToManyField(
        User,
        null=True,
        blank=True,
        related_name="coworker_user",
        verbose_name=_("Coworkers (real users)"))

    coworkers = models.ManyToManyField(
        Coworker,
        null=True,
        blank=True,
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("Coworkers"))

    clients_user = models.ManyToManyField(
        User,
        null=True,
        blank=True,
        related_name="clients_user",
        verbose_name=_("Client (real users)"))

    clients = models.ManyToManyField(
        Client,
        null=True,
        blank=True,
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("Clients"))

    tags = models.ManyToManyField(
        Tag,
        null=True,
        blank=True,
        verbose_name=_("Tags"))

    def __unicode__(self):
        return self.name

    @models.permalink
    def get_absolute_url(self):
        return ('lab-project', (), {'slug': self.slug})

    class Meta:
        unique_together = ('site', 'slug')
        ordering = ['-start_date']


class ProjectLanguageRate(models.Model):
    language = models.ForeignKey(
        Language,
        verbose_name=_("Language"))

    project = models.ForeignKey(
        Project,
        verbose_name=_("Project"))

    rate = models.PositiveIntegerField(
        verbose_name=_("Rate"))

    def __unicode__(self):
        return "%s / %s" % (self.project, self.language)


class Progress(models.Model):
    description = models.CharField(
        max_length=255,
        verbose_name=_("Description"))

    pub_date = models.DateField(
        default=datetime.now,
        verbose_name=_("Pub date"))

    project = models.ForeignKey(
        Project,
        verbose_name=_("Prohect"))

    def __unicode__(self):
        return "%s" % self.pub_date

    class Meta:
        ordering = ['-pub_date']


class Todo(models.Model):
    task = models.CharField(
        max_length=255,
        verbose_name=_("Task"))

    project = models.ForeignKey(
        Project,
        verbose_name=_("Project"))

    def __unicode__(self):
        return self.task


class Image(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    description = models.TextField(
        verbose_name=_("Description"))

    image = models.ImageField(
        upload_to="lab/projets/images/",
        verbose_name=_("Image"))

    project = models.ForeignKey(
        Project,
        verbose_name=_("Project"))

    def __unicode__(self):
        return self.name

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = Image.objects.get(pk=self.pk)
            if origin.image != self.image:
                if os.path.exists(origin.image.path):
                    os.remove(origin.image.path)
        super(Image, self).save(*arg, **kwargs)


class DownloadIcon(models.Model):
    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    image = models.ImageField(
        upload_to="lab/projets/downloads/icons/",
        help_text="128x128",
        verbose_name=_("Image"))

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
    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    description = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_("Description"))

    uploaded_file = models.FileField(
        upload_to="lab/projets/downloads/files/",
        null=True,
        blank=True,
        verbose_name=_("Uploaded file"))

    url = models.URLField(
        null=True,
        blank=True,
        verbose_name=_("URL"))

    icon = models.ForeignKey(
        DownloadIcon,
        verbose_name=_("Icon"))

    project = models.ForeignKey(
        Project,
        verbose_name=_("Project"))

    def __unicode__(self):
        return self.name


class Video(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    description = models.TextField(
        verbose_name=_("Description"))

    url = models.URLField(
        verbose_name=_("URL"))

    thumbnail = models.ImageField(
        upload_to="lab/projets/videos/",
        verbose_name=_("Thumbnail"))

    is_iframe = models.BooleanField(
        verbose_name=_("is_iframe"))

    project = models.ForeignKey(
        Project,
        verbose_name=_("project"))

    def __unicode__(self):
        return self.name

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = Video.objects.get(pk=self.pk)
            if origin.thumbnail != self.thumbnail:
                if os.path.exists(origin.thumbnail.path):
                    os.remove(origin.thumbnail.path)
        super(Video, self).save(*arg, **kwargs)
