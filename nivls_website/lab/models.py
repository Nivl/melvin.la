from datetime import datetime
from django.db import models

class Language(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    def __unicode__(self):
        return self.name


class Licence(models.Model):
    name        = models.CharField(max_length=50)
    slug        = models.SlugField(unique=True)
    url         = models.URLField()
    image       = models.ImageField(upload_to="articles/images/")

    def __unicode__(self):
        return self.name


class Project(models.Model):
    name         = models.CharField(max_length=255)
    description  = models.TextField()
    slug         = models.SlugField(unique=True)
    start_date   = models.DateField(default=datetime.now)
    blog_entry   = models.CharField(max_length=255, null=True, blank=True)
    src_url      = models.URLField(null=True, blank=True)
    licence      = models.ForeignKey(Licence)
    demo_link    = models.URLField(null=True, blank=True)
    demo_codebox = models.TextField(null=True, blank=True)

    def __unicode__(self):
        return self.name


class Progression(models.Model):
    desciption  = models.TextField()
    pub_date    = models.DateField(default=datetime.now)
    project     = models.ForeignKey(Project)

    def __unicode__(self):
        return self.pub_date


class Image(models.Model):
    name        = models.CharField(max_length=255)
    desciption  = models.TextField()
    image       = models.ImageField(upload_to="articles/images/")
    project     = models.ForeignKey(Project)

    def __unicode__(self):
        return self.name


class Download(models.Model):
    name          = models.CharField(max_length=50)
    desciption    = models.CharField(max_length=255)
    uploaded_file = models.ImageField(upload_to="articles/images/")
    project       = models.ForeignKey(Project)

    def __unicode__(self):
        return self.name


class Download(models.Model):
    name          = models.CharField(max_length=50)
    desciption    = models.CharField(max_length=255)
    uploaded_file = models.ImageField(upload_to="articles/images/")
    project       = models.ForeignKey(Project)

    def __unicode__(self):
        return self.name


class VideoHost(models.Model):
    name        = models.CharField(max_length=50)
    url         = models.URLField()
    embed_url   = models.URLField()

    def __unicode__(self):
        return self.name


class Video(models.Model):
    name        = models.CharField(max_length=255)
    desciption  = models.TextField()
    code        = models.CharField(max_length=30)
    host        = models.ForeignKey(VideoHost)
    project     = models.ForeignKey(Project)

    def __unicode__(self):
        return self.name
