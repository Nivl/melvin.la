from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.db import models
import os
import uuid

def get_file_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return os.path.join("uploaded_files", filename)

class FileUpload(models.Model):
    name           = models.CharField(max_length=100)
    description    = models.CharField(max_length=50)
    uploaded_file  = models.FileField(upload_to=get_file_path)
    content_type   = models.ForeignKey(ContentType)
    object_id      = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')

    def __unicode__(self):
        return self.name;
