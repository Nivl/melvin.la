import datetime
from django.db import models
from categories.models import Category
from tags.models import Tag
from django.contrib.auth.models import User
from images.models import Image

class Post(models.Model):
    title         = models.CharField(max_length=100)
    slug          = models.SlugField(unique_for_date="pub_date")
    description   = models.CharField(max_length=255)
    main_image    = models.ImageField(upload_to="article_images/originals/",
                                      help_text="640x250")
    thumbnail     = models.ImageField(upload_to="article_images/thubnails/",
                                      help_text="115x115")
    content       = models.TextField()
    pub_date      = models.DateTimeField(auto_now_add=True)
    edit_date     = models.DateTimeField(auto_now=True)
    is_public     = models.BooleanField()
    allow_comment = models.BooleanField()
    author        = models.ForeignKey(User)
    category      = models.ForeignKey(Category)
    tags          = models.ManyToManyField(Tag)
    images        = models.ManyToManyField(Image, null=True, blank=True)

    def __unicode__(self):
        return "%d - %s" % (self.id, self.title)

    def get_absolute_url(self):
        return self.pub_date.strftime("%Y/%m/%d") + "/" + self.slug
