from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.db import models
import os
import uuid

class FileUpload(models.Model):
    name           = models.CharField(max_length=100)
    description    = models.CharField(max_length=50)
    uploaded_file  = models.FileField(upload_to="uploaded_files")
    content_type   = models.ForeignKey(ContentType)
    object_id      = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')

    def __unicode__(self):
        return self.name;
