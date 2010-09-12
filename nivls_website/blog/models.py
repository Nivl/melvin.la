# -*- coding: utf-8 -*-

from django.db                          import models
from django.template.defaultfilters     import slugify
from time                               import strftime


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

    def __unicode__(self):
        return self.title
    def get_absolute_url(self):
        return "/blog/" + self.date.strftime("%Y/%m/%d") + "/" + self.slug

    class Meta:
        verbose_name_plural = "entries"
