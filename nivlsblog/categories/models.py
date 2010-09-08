from django.db import models

class Category(models.Model):
    name  = models.CharField(max_length=100)
    slug  = models.SlugField()
    left  = models.PositiveIntegerField()
    right = models.PositiveIntegerField()
    level = models.PositiveIntegerField()

    def is_root(self):
        return self.level == 0
    def has_child(self):
        return self.right - self.left != 1

    class Meta:
        verbose_name_plural = "categories"
    def __unicode__(self):
        return self.name
