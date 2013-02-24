#-*- coding: utf-8 -*-
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.contrib.auth.models import User
from django.db import models
from django.conf import settings
from django.contrib.contenttypes import generic
from django.db.models.signals import pre_save
from django.dispatch.dispatcher import receiver
from commons.fields import ColorField
from commons.models import I18nSite
from seo.models import SeoEverywhere, SeoMicroData


class Tag(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        related_name='lab_tag_site',
        verbose_name=_("site"))

    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    icon_enabled = models.ImageField(
        upload_to='lab/icons/',
        help_text='32x32',
        verbose_name=_("icon 'enabled'"))

    icon_disabled = models.ImageField(
        upload_to='lab/icons/',
        help_text='32x32',
        verbose_name=_("icon 'disabled'"))

    seo = generic.GenericRelation(
        SeoEverywhere,
        related_name='lab_tag_seo')

    def admin_thumbnail(self):
        return u'<img src="%s" />' % (self.icon_enabled.url)
    admin_thumbnail.short_description = 'Thumbnail'
    admin_thumbnail.allow_tags = True

    @models.permalink
    def get_absolute_url(self):
        return ('lab-tag', (), {'slug': self.slug})

    def __unicode__(self):
        return self.name

    class Meta:
        unique_together = ('site', 'slug')


@receiver(pre_save, sender=Tag)
def tag_presave(sender, instance, **kwargs):
    if instance.pk is not None:
        origin = Tag.objects.get(pk=instance.pk)
        if origin.icon_enabled != instance.icon_enabled:
            origin.icon_enabled.delete(save=False)
        if origin.icon_disabled != instance.icon_disabled:
            origin.icon_disabled.delete(save=False)


class Language(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    slug = models.SlugField(
        unique=True,
        verbose_name=_("slug"))

    color = ColorField(
        verbose_name=_("color"))

    def __unicode__(self):
        return self.name


class License(models.Model):
    site = models.ForeignKey(
        I18nSite,
        related_name='lab_license_site',
        default=settings.SITE_ID,
        verbose_name=_("site"))

    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    url = models.URLField(
        null=True,
        blank=True,
        verbose_name=_("URL"))

    def __unicode__(self):
        return self.name

    class Meta:
        unique_together = ('site', 'slug')


class Coworker(models.Model):
    site = models.ForeignKey(
        I18nSite,
        related_name='lab_coworker_site',
        default=settings.SITE_ID,
        verbose_name=_("site"))

    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    description = models.CharField(
        max_length=255,
        verbose_name=_("description"))

    url = models.URLField(
        null=True,
        blank=True,
        verbose_name=_("URL"))

    image = models.ImageField(
        upload_to="lab/coworker/",
        help_text="126x126",
        verbose_name=_("image"))

    def __unicode__(self):
        return self.name

    class Meta:
        unique_together = ('site', 'slug')


@receiver(pre_save, sender=Coworker)
def coworker_presave(sender, instance, **kwargs):
    if instance.pk is not None:
        origin = Coworker.objects.get(pk=instance.pk)
        if origin.image != instance.image:
            origin.image.delete(save=False)


class Client(models.Model):
    site = models.ForeignKey(
        I18nSite,
        related_name='lab_client_site',
        default=settings.SITE_ID,
        verbose_name=_("site"))

    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    description = models.CharField(
        max_length=255,
        verbose_name=_("description"))

    url = models.URLField(
        null=True,
        blank=True,
        verbose_name=_("URL"))

    image = models.ImageField(
        upload_to="lab/client/",
        help_text="126x126",
        verbose_name=_("image"))

    def __unicode__(self):
        return self.name

    class Meta:
        unique_together = ('site', 'slug')


@receiver(pre_save, sender=Client)
def client_presave(sender, instance, **kwargs):
    if instance.pk is not None:
        origin = Client.objects.get(pk=instance.pk)
        if origin.image != instance.image:
            origin.image.delete(save=False)


class Project(models.Model):
    site = models.ForeignKey(
        I18nSite,
        related_name='lab_project_site',
        default=settings.SITE_ID,
        verbose_name=_("site"))

    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    catchphrase = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_("catchphrase"))

    overall_progress = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_("overall progress"))

    start_date = models.DateField(
        default=timezone.now,
        verbose_name=_("start date"))

    license = models.ForeignKey(
        License,
        related_name='lab_project_license',
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("license"))

    sources_url = models.URLField(
        null=True,
        blank=True,
        verbose_name=_("sources URL"))

    description = models.TextField(
        verbose_name=_("description"))

    edit_date = models.DateField(
        auto_now=True,
        verbose_name=_("edit date"))

    demo_codebox = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("demo codebox"))

    languages = models.ManyToManyField(
        Language,
        related_name='lab_project_languages',
        through='ProjectLanguageRate',
        verbose_name=_("languages"))

    coworkers_user = models.ManyToManyField(
        User,
        null=True,
        blank=True,
        related_name="lab_project_coworkers_user",
        verbose_name=_("coworkers (real users)"))

    coworkers = models.ManyToManyField(
        Coworker,
        null=True,
        blank=True,
        related_name="project_coworkers",
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("coworkers"))

    clients_user = models.ManyToManyField(
        User,
        null=True,
        blank=True,
        related_name="lab_project_clients_user",
        verbose_name=_("client (real users)"))

    clients = models.ManyToManyField(
        Client,
        null=True,
        blank=True,
        related_name="project_clients",
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("clients"))

    tags = models.ManyToManyField(
        Tag,
        null=True,
        blank=True,
        related_name="project_tags",
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("tags"))

    seo = generic.GenericRelation(
        SeoEverywhere,
        related_name='lab_project_seo')

    micro_data = generic.GenericRelation(
        SeoMicroData,
        related_name='lab_project_md')

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
        related_name="projectlanguagerate_language",
        verbose_name=_("language"))

    project = models.ForeignKey(
        Project,
        related_name="projectlanguagerate_project",
        verbose_name=_("Project"))

    rate = models.PositiveIntegerField(
        verbose_name=_("rate"))

    def __unicode__(self):
        return "%s / %s" % (self.project, self.language)


class Progress(models.Model):
    description = models.CharField(
        max_length=255,
        verbose_name=_("description"))

    pub_date = models.DateField(
        default=timezone.now,
        verbose_name=_("publication date"))

    project = models.ForeignKey(
        Project,
        related_name="progress_project",
        verbose_name=_("project"))

    def __unicode__(self):
        return "%s" % self.pub_date

    class Meta:
        ordering = ['-pub_date']


class Todo(models.Model):
    task = models.CharField(
        max_length=255,
        verbose_name=_("task"))

    project = models.ForeignKey(
        Project,
        related_name="todo_project",
        verbose_name=_("project"))

    def __unicode__(self):
        return self.task


class Image(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    description = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("description"))

    image = models.ImageField(
        upload_to="lab/projets/images/",
        verbose_name=_("image"))

    project = models.ForeignKey(
        Project,
        related_name="image_project",
        verbose_name=_("project"))

    def __unicode__(self):
        return self.name


@receiver(pre_save, sender=Image)
def labimage_presave(sender, instance, **kwargs):
    if instance.pk is not None:
        origin = Image.objects.get(pk=instance.pk)
        if origin.image != instance.image:
            origin.image.delete(save=False)


class DownloadIcon(models.Model):
    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    image = models.ImageField(
        upload_to="lab/projets/downloads/icons/",
        help_text="128x128",
        verbose_name=_("image"))

    def admin_thumbnail(self):
        return u'<img src="%s" />' % (self.image.url)
    admin_thumbnail.short_description = 'Thumbnail'
    admin_thumbnail.allow_tags = True

    def __unicode__(self):
        return self.name


@receiver(pre_save, sender=DownloadIcon)
def downloadIcon_presave(sender, instance, **kwargs):
    if instance.pk is not None:
        origin = DownloadIcon.objects.get(pk=instance.pk)
        if origin.image != instance.image:
            origin.image.delete(save=False)


class Download(models.Model):
    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    description = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_("description"))

    uploaded_file = models.FileField(
        upload_to="lab/projets/downloads/files/",
        null=True,
        blank=True,
        verbose_name=_("uploaded file"))

    url = models.URLField(
        null=True,
        blank=True,
        verbose_name=_("URL"))

    icon = models.ForeignKey(
        DownloadIcon,
        related_name="download_icon",
        verbose_name=_("icon"))

    project = models.ForeignKey(
        Project,
        related_name="download_project",
        verbose_name=_("project"))

    def __unicode__(self):
        return self.name


class Video(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name=_("name"))

    description = models.TextField(
        verbose_name=_("description"))

    url = models.URLField(
        verbose_name=_("URL"))

    project = models.ForeignKey(
        Project,
        related_name="video_project",
        verbose_name=_("project"))

    def __unicode__(self):
        return self.name
