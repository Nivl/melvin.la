# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Logger404'
        db.create_table('logger_logger404', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200)),
            ('hit', self.gf('django.db.models.fields.PositiveIntegerField')(default=0)),
            ('host', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('referer', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('user_agent', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('remote_addr', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('remote_host', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('method', self.gf('django.db.models.fields.CharField')(max_length=255)),
        ))
        db.send_create_signal('logger', ['Logger404'])


    def backwards(self, orm):
        # Deleting model 'Logger404'
        db.delete_table('logger_logger404')


    models = {
        'logger.logger404': {
            'Meta': {'ordering': "['-hit']", 'object_name': 'Logger404'},
            'hit': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'}),
            'host': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'method': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'referer': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'remote_addr': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'remote_host': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'user_agent': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        }
    }

    complete_apps = ['logger']