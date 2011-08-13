from django.db import models
from categories.models import Category
from tags.models import Tag

class Post(models.Model):
    title         = models.CharField(max_length=100)
    slug          = models.SlugField(unique_for_date="pub_date")
    content       = models.TextField()
    pub_date      = models.DateTimeField(auto_now_add=True)
    edit_date     = models.DateTimeField(auto_now=True)
    allow_comment = models.BooleanField()
    category      = models.ForeignKey(Category)
    tags          = models.ManyToManyField(Tag)

    def __unicode__(self):
        return self.title;
