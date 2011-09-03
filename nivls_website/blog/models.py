import os
import datetime
from django.db import models
from tags.models import Tag
from django.contrib.auth.models import User
from images.models import Image

class Category(models.Model):
    name          = models.CharField(max_length=50)
    slug          = models.SlugField(unique=True)
    description   = models.CharField(max_length=80, blank=True, null=True)
    left          = models.PositiveIntegerField(unique=True)
    right         = models.PositiveIntegerField(unique=True)
    is_root       = models.BooleanField()
    thumbnail     = models.ImageField(upload_to="categories/"
                                      ,help_text="115x115"
                                      ,blank=True, null=True)
    def has_child(self):
        return self.right - self.left > 1

    @models.permalink
    def get_absolute_url(self):
        return ('category', (), {'slug': self.slug})

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Post(models.Model):
    title               = models.CharField(max_length=50)
    slug                = models.SlugField(unique_for_date="pub_date")
    short_description   = models.CharField(max_length=80
                                           ,help_text="80 chars maximum")
    long_description    = models.CharField(max_length=255
                                           ,help_text="255 chars maximum")
    main_image          = models.ImageField(upload_to="articles/originals/"
                                            ,help_text="570x270")
    thumbnail           = models.ImageField(upload_to="articles/thumbnails/"
                                            ,help_text="115x115")
    content             = models.TextField()
    pub_date            = models.DateTimeField(auto_now_add=True)
    edit_date           = models.DateTimeField(auto_now=True)
    is_public           = models.BooleanField()
    allow_comment       = models.BooleanField()
    author              = models.ForeignKey(User)
    category            = models.ForeignKey(Category)
    tags                = models.ManyToManyField(Tag)
    images              = models.ManyToManyField(Image, null=True, blank=True)

    def __unicode__(self):
        return "%d - %s" % (self.id, self.title)

    @models.permalink
    def get_absolute_url(self):
        return ('post', (), {'year': self.pub_date.year
                             ,'month': self.pub_date.month
                             ,'day': self.pub_date.day
                             ,'slug': self.slug
                             })

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = Post.objects.get(pk=self.pk)
            if origin.main_image != self.main_image:
                if os.path.exists(origin.main_image.path):
                    os.remove(origin.main_image.path)
            if origin.thumbnail != self.thumbnail:
                if os.path.exists(origin.thumbnail.path):
                    os.remove(origin.thumbnail.path)
        super(Post, self).save(*arg, **kwargs)


class SeeAlso(models.Model):
    name         = models.CharField(max_length=50)
    title        = models.CharField(max_length=50)
    url          = models.URLField();

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name_plural = "See also"
