from django.db import models
from categories.models import Category
from tags.models import Tag
from django.contrib.auth.models import User

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
    allow_comment = models.BooleanField()
    author        = models.ForeignKey(User)
    category      = models.ForeignKey(Category)
    tags          = models.ManyToManyField(Tag)


    def __unicode__(self):
        return self.title;
