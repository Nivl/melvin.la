# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        db.rename_column('about_contactlink', 'attributes', 'link_attributes')
        db.rename_column('about_navigationlink', 'attributes', 'link_attributes')

    def backwards(self, orm):
        db.rename_column('about_contactlink', 'link_attributes', 'attributes')
        db.rename_column('about_navigationlink', 'link_attributes', 'attributes')

    complete_apps = ['about']
