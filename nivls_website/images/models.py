from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.db import models
import os
import uuid

def get_image_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return os.path.join("image", filename)

class Image(models.Model):
    name           = models.CharField(max_length=100)
    image          = models.ImageField(upload_to=get_image_path)
    content_type   = models.ForeignKey(ContentType)
    content_object = generic.GenericForeignKey('content_type', 'object_id')

    def __unicode__(self):
        return self.name;
