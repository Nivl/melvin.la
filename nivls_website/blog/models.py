import os
from django.utils import timezone
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.sitemaps import ping_google
from django.utils.translation import gettext_lazy as _
from commons.models import I18nSite
from commons.renders import image_name_to_link
from lab.models import Project


class Menu(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    order = models.PositiveSmallIntegerField(
        verbose_name=_("order"))

    hide = models.BooleanField(
        verbose_name=_("hide"))

    def __unicode__(self):
        return self.name


class Link(models.Model):
    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    title = models.CharField(
        max_length=50,
        verbose_name=_("title"))

    url = models.URLField(
        verbose_name=_("URL"))

    menu = models.ForeignKey(
        Menu,
        verbose_name=_("menu"))

    def __unicode__(self):
        return self.name


class Tag(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

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
        unique_together = ('site', 'slug')


class Category(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    description = models.CharField(
        max_length=80,
        blank=True,
        null=True,
        verbose_name=_("description"))

    is_root = models.BooleanField(
        verbose_name=_("is root"))

    left = models.PositiveIntegerField(
        verbose_name=_("left"))

    right = models.PositiveIntegerField(
        verbose_name=_("right"))

    thumbnail = models.ImageField(
        upload_to="categories/",
        help_text="115x115",
        blank=True,
        null=True,
        verbose_name=_("thumbnail"))

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
        unique_together = (
            ('site', 'right'),
            ('site', 'left'),
            ('site', 'slug'))


class Post(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    is_public = models.BooleanField(
        verbose_name=_("is public"))

    pub_date = models.DateTimeField(
        default=timezone.now,
        verbose_name=_("publication date"))

    author = models.ForeignKey(
        User,
        verbose_name=_("author"))

    category = models.ForeignKey(
        Category,
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("category"))

    lab = models.ForeignKey(
        Project,
        blank=True,
        null=True,
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("Lab"))

    title = models.CharField(
        max_length=50,
        verbose_name=_("title"))

    slug = models.SlugField(
        verbose_name=_("slug"))

    main_image = models.ImageField(
        upload_to="articles/originals/",
        help_text="1170x400",
        verbose_name=_("main image"))

    short_description = models.CharField(
        max_length=80,
        help_text="80 chars maximum",
        verbose_name=_("short description"))

    thumbnail = models.ImageField(
        upload_to="articles/thumbnails/",
        help_text="260x180",
        verbose_name=_("thumbnail"))

    long_description = models.CharField(
        max_length=175,
        help_text="175 chars maximum",
        verbose_name=_("long description"))

    content = models.TextField(
        verbose_name=_("content"))

    tags = models.ManyToManyField(
        Tag,
        blank=True,
        null=True,
        limit_choices_to={'site': settings.SITE_ID},
        verbose_name=_("Tags"))

    i18n = models.ManyToManyField(
        "self",
        blank=True,
        null=True,
        limit_choices_to=~models.Q(site=settings.SITE_ID),
        verbose_name=_("i18n"))

    allow_comment = models.BooleanField(
        default=True,
        verbose_name=_("allow comment"))

    edit_date = models.DateTimeField(
        auto_now=True,
        verbose_name=_("edit date"))

    def parsed_content(self):
        return image_name_to_link(self.content, self.image_set.all())

    def __unicode__(self):
        return self.title

    def get_public_comments(self):
        return self.comment_set.filter(is_public=True)

    def count_public_comments(self):
        return self.comment_set.filter(is_public=True).count()

    @models.permalink
    def get_absolute_url(self):
        return ('post', (), {'year': self.pub_date.year,
                             'month': self.pub_date.strftime("%m"),
                             'day': self.pub_date.strftime("%d"),
                             'slug': self.slug,
                             })

    @models.permalink
    def get_form_url(self):
        return ('post-comment-form', (), {
                'year': self.pub_date.year,
                'month': self.pub_date.strftime("%m"),
                'day': self.pub_date.strftime("%d"),
                'slug': self.slug,
                })

    @models.permalink
    def get_comment_count_url(self):
        return ('post-comment-count', (), {
                'year': self.pub_date.year,
                'month': self.pub_date.strftime("%m"),
                'day': self.pub_date.strftime("%d"),
                'slug': self.slug,
                })

    @models.permalink
    def get_comments_url(self):
        return ('post-comment-list', (), {
                'year': self.pub_date.year,
                'month': self.pub_date.strftime("%m"),
                'day': self.pub_date.strftime("%d"),
                'slug': self.slug,
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

        class Meta:
            unique_together = ('slug', 'pub_date', 'site')


class Image(models.Model):
    name = models.CharField(
        max_length=50,
        verbose_name=_("name"))

    image = models.ImageField(
        upload_to="articles/images/",
        verbose_name=_("image"))

    post = models.ForeignKey(
        Post,
        verbose_name=_("post"))

    def __unicode__(self):
        return self.name

    def save(self, *arg, **kwargs):
        if self.pk is not None:
            origin = Image.objects.get(pk=self.pk)
            if origin.image != self.image:
                if os.path.exists(origin.image.path):
                    os.remove(origin.image.path)
        super(Image, self).save(*arg, **kwargs)


class Comment(models.Model):
    user = models.ForeignKey(
        User,
        null=True,
        blank=True,
        verbose_name=_('user'))

    post = models.ForeignKey(
        Post,
        verbose_name=_('post'))

    is_public = models.BooleanField(
        verbose_name=_('is public'),
        default=False)

    ip_address = models.GenericIPAddressField(
        verbose_name=_('IP address'))

    pub_date = models.DateTimeField(
        default=timezone.now,
        verbose_name=_('publication date'))

    name = models.CharField(
        verbose_name=_('name'),
        max_length=255,
        null=True,
        blank=True)

    email = models.EmailField(
        verbose_name=_('email address'),
        null=True,
        blank=True)

    website = models.URLField(
        verbose_name=_('website'),
        null=True,
        blank=True)

    comment = models.TextField(
        verbose_name=_('comment'))

    def __unicode__(self):
        return self.comment

    class Meta:
        verbose_name = _('comment')
        verbose_name_plural = _('comments')


class Carousel(models.Model):
    site = models.ForeignKey(
        I18nSite,
        default=settings.SITE_ID,
        verbose_name=_("site"))

    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_("order"))

    post = models.ForeignKey(
        Post,
        limit_choices_to={'site': settings.SITE_ID,
                          'is_public': 1},
        verbose_name=_("post"))

    def __unicode__(self):
        return self.post.__unicode__()

    class Meta:
        ordering = ['-order']
        verbose_name = _('Carousel')
        verbose_name_plural = _('Carousel')
