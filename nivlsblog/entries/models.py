from django.db                          import models
from nivlsblog.tags.models              import Tag
from nivlsblog.categories.models        import Category

class Entry(models.Model):
    title    = models.CharField(max_length=255)
    content  = models.TextField()
    date     = models.DateTimeField('date published')
    category = models.ForeignKey(Category)
    tags     = models.ManyToManyField(Tag, blank=True)

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name_plural = "entries"
