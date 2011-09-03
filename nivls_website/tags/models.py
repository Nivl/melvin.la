from django.db import models

class Tag(models.Model):
    name         = models.CharField(max_length=50)
    slug         = models.SlugField()

    def __unicode__(self):
        return self.name

    @models.permalink
    def get_absolute_url(self):
        return ('tag', (), {'slug': self.slug})

    class Meta:
        ordering = ["name"]
