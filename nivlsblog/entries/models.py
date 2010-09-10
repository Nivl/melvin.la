from django.db                          import models
from nivlsblog.tags.models              import Tag
from nivlsblog.categories.models        import Category
from django.template.defaultfilters     import slugify
from time                               import strftime


class Entry(models.Model):
    title    = models.CharField(max_length=255)
    slug     = models.SlugField(max_length=255, unique_for_date="date")
    content  = models.TextField()
    date     = models.DateTimeField('date published')
    category = models.ForeignKey(Category)
    tags     = models.ManyToManyField(Tag, blank=True)

    def __unicode__(self):
        return self.title
    def get_absolute_url(self):
        return "/" + self.date.strftime("%Y/%m/%d") + "/" + self.slug

    class Meta:
        verbose_name_plural = "entries"
