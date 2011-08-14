from django.db import models

class Tag(models.Model):
    name         = models.CharField(max_length=50)
    slug         = models.SlugField()

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ["name"]
