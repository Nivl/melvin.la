# -*- coding: utf-8 -*-

from django.db                          import models
from django.template.defaultfilters     import slugify
from time                               import strftime
from datetime                           import datetime
from django.core.cache                  import cache


class Tag(models.Model):
    slug = models.SlugField()

    def __unicode__(self):
        return self.slug

    def get_absolute_url(self):
        return "/blog/tags/" + self.slug + "/"

    def save(self, *args, **kwargs):
        super(Tag, self).save(*args, **kwargs)
        self.delete_cache()

    def delete(self, *args, **kwargs):
        super(Tag, self).delete(*args, **kwargs)
        self.delete_cache()

    def delete_cache(self):
        cache.delete('tag-list')


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

    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = slugify(self.name)
        super(Category, self).save(*args, **kwargs)
        cache.delete('cat-list-by-left')

    def delete(self, *args, **kwargs):
        super(Category, self).delete(*args, **kwargs)
        cache.delete('cat-list-by-left')


class Entry(models.Model):
    title    = models.CharField(max_length=255)
    slug     = models.SlugField(max_length=255, unique_for_date="date")
    content  = models.TextField()
    date     = models.DateTimeField('date published')
    category = models.ForeignKey(Category)
    tags     = models.ManyToManyField(Tag,
                                      blank=True,
                                      verbose_name="list of tags")

    class Meta:
        verbose_name_plural = "entries"

    def __unicode__(self):
        return self.title

    def get_absolute_url(self):
        return "/blog/" + self.date.strftime("%Y/%m/%d") + "/" + self.slug

    def get_comment_count(self):
        cache_name = 'entry-%d-comment-count' % self.id
        if cache.has_key(cache_name):
            return cache.get(cache_name)
        else:
            count = Comment.objects.filter(entry=self.id).count()
            cache.set(cache_name, count)
            return count

    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = slugify(self.title)
        if not self.id:
            self.delete_cache()
        super(Entry, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.delete_cache()
        super(Entry, self).delete(*args, **kwargs)

    def delete_cache(self):
        cache.delete('entry-%d-comment-count' % self.entry.id)
        cache.delete('entry-archive-list')

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
        if not self.id:
            self.entry.delete_cache()
        super(Comment, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.entry.delete_cache()
        super(Comment, self).delete(*args, **kwargs)
