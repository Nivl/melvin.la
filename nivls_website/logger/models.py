from django.db import models

class Logger404(models.Model):
    url            = models.URLField()
    hit            = models.PositiveIntegerField(default=0)
    host           = models.CharField(max_length=255)
    referer        = models.CharField(max_length=255)
    user_agent     = models.CharField(max_length=255)
    remote_addr    = models.CharField(max_length=255)
    remote_host    = models.CharField(max_length=255)
    method         = models.CharField(max_length=255)

    def __unicode__(self):
        return self.url

    class Meta:
        verbose_name_plural = 'Logger404'
        ordering = ['hit']
