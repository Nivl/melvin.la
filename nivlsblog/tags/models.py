from django.db import models

class Tag(models.Model):
    slug = models.SlugField()

    def __unicode__(self):
        return self.slug
