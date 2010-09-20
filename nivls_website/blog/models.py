# -*- coding: utf-8 -*-

from django.db                          import models
from django.template.defaultfilters     import slugify
from time                               import strftime
from datetime                           import datetime

class Tag(models.Model):
    slug = models.SlugField()

    def __unicode__(self):
        return self.slug
    def get_absolute_url(self):
        return "/blog/tags/" + self.slug + "/"


class Category(models.Model):
    name  = models.CharField(max_length=100)
    slug  = models.SlugField(unique=True)
    left  = models.PositiveIntegerField(unique=True)
    right = models.PositiveIntegerField(unique=True)
    level = models.PositiveIntegerField()

    def is_root(self):
        return self.level == 0
    def has_child(self):
        return self.right - self.left > 1

    class Meta:
        verbose_name_plural = "categories"
    def __unicode__(self):
        return self.name
    def get_absolute_url(self):
        return "/blog/categories/" + self.slug + "/"


class Entry(models.Model):
    title    = models.CharField(max_length=255)
    slug     = models.SlugField(max_length=255, unique_for_date="date")
    content  = models.TextField()
    date     = models.DateTimeField('date published')
    category = models.ForeignKey(Category)
    tags     = models.ManyToManyField(Tag,
                                      blank=True,
                                      verbose_name="list of tags")
    _comment_count = None;

    def __unicode__(self):
        return self.title
    def get_absolute_url(self):
        return "/blog/" + self.date.strftime("%Y/%m/%d") + "/" + self.slug
    def get_comment_count(self, force=False):
        if force or self. _comment_count == None:
            self._comment_count = Comment.objects.filter(entry=self.id).count()
        return self._comment_count

    class Meta:
        verbose_name_plural = "entries"


class Comment(models.Model):
    entry        = models.ForeignKey(Entry)
    date         = models.DateTimeField("date submitted")
    content      = models.TextField()
    user_name    = models.CharField("name", max_length=25)
    user_email   = models.EmailField("e-mail adress",
                                     help_text="Will mot be published")
    user_website = models.URLField("website", blank=True)
    user_ip      = models.IPAddressField("IP address")

    def __unicode__(self):
        return self.content
    def save(self, *args, **kwargs):
        if self.date is None:
            self.date = datetime.now()
        super(Comment, self).save(*args, **kwargs)

