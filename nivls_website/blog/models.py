import os
from datetime import datetime
from django.contrib.comments.moderation import AlreadyModerated, CommentModerator, moderator
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.sitemaps import ping_google
from django.contrib.sites.models import Site
from commons.renders import image_name_to_link
import commons.signals
from lab.models import Project

class Menu(models.Model):
    sites       = models.ManyToManyField(Site, default=settings.SITE_ID)
    name        = models.CharField(max_length=50)
    slug        = models.SlugField(unique=True)
    order       = models.PositiveSmallIntegerField()
    hide        = models.BooleanField()

    def __unicode__(self):
        return self.name


class Link(models.Model):
    name        = models.CharField(max_length=50)
    title       = models.CharField(max_length=50)
    url         = models.URLField()
    menu        = models.ForeignKey(Menu)

    def __unicode__(self):
        return self.name


class Tag(models.Model):
    sites        = models.ManyToManyField(Site, default=settings.SITE_ID)
    name         = models.CharField(max_length=50)
    slug         = models.SlugField(unique=True)

    def __unicode__(self):
        return self.name

    @models.permalink
    def get_absolute_url(self):
        return ('tag', (), {'slug': self.slug})

    def get_feed_url(self):
        return {'rss': self.get_rss_feed_url(),
                'atom': self.get_atom_feed_url()}

    def get_rss_feed_url(self):
        return self.get_absolute_url() + "rss/"

    def get_atom_feed_url(self):
        return self.get_absolute_url() + "atom/"

    class Meta:
        ordering = ["name"]


class Category(models.Model):
    sites         = models.ManyToManyField(Site, default=settings.SITE_ID)
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

    def get_feed_url(self):
        return {'rss': self.get_rss_feed_url(),
                'atom': self.get_atom_feed_url()}

    def get_rss_feed_url(self):
        return self.get_absolute_url() + "rss/"

    def get_atom_feed_url(self):
        return self.get_absolute_url() + "atom/"

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class PostImage(models.Model):
    name        = models.CharField(max_length=50)
    image      = models.ImageField(upload_to="articles/images/")

    def __unicode__(self):
        return self.name


class Post(models.Model):
    site                = models.ForeignKey(Site, default=settings.SITE_ID)
    title               = models.CharField(max_length=50)
    slug                = models.SlugField(unique_for_date="pub_date")
    short_description   = models.CharField(max_length=80
                                           ,help_text="80 chars maximum")
    long_description    = models.CharField(max_length=175
                                           ,help_text="175 chars maximum")
    main_image          = models.ImageField(upload_to="articles/originals/"
                                            ,help_text="570x270")
    thumbnail           = models.ImageField(upload_to="articles/thumbnails/"
                                            ,help_text="115x115")
    content             = models.TextField()
    pub_date            = models.DateTimeField(default=datetime.now)
    edit_date           = models.DateTimeField(auto_now=True)
    is_public           = models.BooleanField()
    allow_comment       = models.BooleanField()
    author              = models.ForeignKey(User)
    category            = models.ForeignKey(Category)
    tags                = models.ManyToManyField(Tag)
    images              = models.ManyToManyField(PostImage,
                                                 null=True, blank=True)
    lab                 = models.ForeignKey(Project, blank=True, null=True)

    def parsed_content(self):
        return image_name_to_link(self.content, self.images.all())

    def __unicode__(self):
        return self.title

    @models.permalink
    def get_absolute_url(self):
        return ('post', (), {'year': self.pub_date.year
                             ,'month': self.pub_date.strftime("%m")
                             ,'day': self.pub_date.strftime("%d")
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
        try:
            ping_google()
        except Exception:
            pass



### Moderator

class PostModerator(CommentModerator):
    email_notification = True
    enable_field = 'allow_comment'
    moderate_after = 0
    auto_moderate_field = 'pub_date'

try:
    moderator.register(Post, PostModerator)
except AlreadyModerated:
    pass

