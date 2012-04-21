from django.contrib import admin
from django.contrib.comments.models import Comment
from django.contrib.contenttypes.generic import GenericTabularInline
from django.conf import settings
from models import *

admin.site.register(Logger404)
