# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Item'
        db.create_table('search_engine_item', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('content', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('hit', self.gf('django.db.models.fields.PositiveIntegerField')(default=0)),
            ('is_valid', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('search_engine', ['Item'])

        # Adding model 'BlacklistedWord'
        db.create_table('search_engine_blacklistedword', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('word', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('is_regex', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('search_engine', ['BlacklistedWord'])


    def backwards(self, orm):
        # Deleting model 'Item'
        db.delete_table('search_engine_item')

        # Deleting model 'BlacklistedWord'
        db.delete_table('search_engine_blacklistedword')


    models = {
        'search_engine.blacklistedword': {
            'Meta': {'object_name': 'BlacklistedWord'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_regex': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'word': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        'search_engine.item': {
            'Meta': {'ordering': "['-hit']", 'object_name': 'Item'},
            'content': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'hit': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_valid': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        }
    }

    complete_apps = ['search_engine']