# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Section'
        db.create_table('resumes_section', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('site', self.gf('django.db.models.fields.related.ForeignKey')(default=1, to=orm['commons.I18nSite'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=50)),
            ('order', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
        ))
        db.send_create_signal('resumes', ['Section'])

        # Adding unique constraint on 'Section', fields ['site', 'slug']
        db.create_unique('resumes_section', ['site_id', 'slug'])

        # Adding model 'Category'
        db.create_table('resumes_category', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('section', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['resumes.Section'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('order', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('display_type', self.gf('django.db.models.fields.CharField')(default='L', max_length=1)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True, blank=True)),
        ))
        db.send_create_signal('resumes', ['Category'])

        # Adding unique constraint on 'Category', fields ['order', 'section']
        db.create_unique('resumes_category', ['order', 'section_id'])

        # Adding model 'Content'
        db.create_table('resumes_content', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('category', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['resumes.Category'])),
            ('order', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
            ('key', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('value', self.gf('django.db.models.fields.TextField')()),
            ('value_for_download', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
        ))
        db.send_create_signal('resumes', ['Content'])

        # Adding model 'DocumentCategory'
        db.create_table('resumes_documentcategory', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('site', self.gf('django.db.models.fields.related.ForeignKey')(default=1, to=orm['commons.I18nSite'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=50)),
            ('order', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
        ))
        db.send_create_signal('resumes', ['DocumentCategory'])

        # Adding unique constraint on 'DocumentCategory', fields ['site', 'name']
        db.create_unique('resumes_documentcategory', ['site_id', 'name'])

        # Adding model 'Document'
        db.create_table('resumes_document', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('category', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['resumes.DocumentCategory'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('order', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
            ('document', self.gf('django.db.models.fields.files.FileField')(max_length=100)),
        ))
        db.send_create_signal('resumes', ['Document'])

        # Adding unique constraint on 'Document', fields ['category', 'name']
        db.create_unique('resumes_document', ['category_id', 'name'])


    def backwards(self, orm):
        # Removing unique constraint on 'Document', fields ['category', 'name']
        db.delete_unique('resumes_document', ['category_id', 'name'])

        # Removing unique constraint on 'DocumentCategory', fields ['site', 'name']
        db.delete_unique('resumes_documentcategory', ['site_id', 'name'])

        # Removing unique constraint on 'Category', fields ['order', 'section']
        db.delete_unique('resumes_category', ['order', 'section_id'])

        # Removing unique constraint on 'Section', fields ['site', 'slug']
        db.delete_unique('resumes_section', ['site_id', 'slug'])

        # Deleting model 'Section'
        db.delete_table('resumes_section')

        # Deleting model 'Category'
        db.delete_table('resumes_category')

        # Deleting model 'Content'
        db.delete_table('resumes_content')

        # Deleting model 'DocumentCategory'
        db.delete_table('resumes_documentcategory')

        # Deleting model 'Document'
        db.delete_table('resumes_document')


    models = {
        'commons.i18nsite': {
            'Meta': {'object_name': 'I18nSite'},
            'flag': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'site': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['sites.Site']", 'unique': 'True', 'primary_key': 'True'})
        },
        'resumes.category': {
            'Meta': {'ordering': "['section', 'order']", 'unique_together': "(('order', 'section'),)", 'object_name': 'Category'},
            'display_type': ('django.db.models.fields.CharField', [], {'default': "'L'", 'max_length': '1'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'order': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'section': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['resumes.Section']"})
        },
        'resumes.content': {
            'Meta': {'ordering': "['order']", 'object_name': 'Content'},
            'category': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['resumes.Category']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'value': ('django.db.models.fields.TextField', [], {}),
            'value_for_download': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        },
        'resumes.document': {
            'Meta': {'ordering': "['order']", 'unique_together': "(('category', 'name'),)", 'object_name': 'Document'},
            'category': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['resumes.DocumentCategory']"}),
            'document': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'})
        },
        'resumes.documentcategory': {
            'Meta': {'ordering': "['order']", 'unique_together': "(('site', 'name'),)", 'object_name': 'DocumentCategory'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'to': "orm['commons.I18nSite']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'})
        },
        'resumes.section': {
            'Meta': {'ordering': "['order']", 'unique_together': "(('site', 'slug'),)", 'object_name': 'Section'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'to': "orm['commons.I18nSite']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'})
        },
        'sites.site': {
            'Meta': {'ordering': "('domain',)", 'object_name': 'Site', 'db_table': "'django_site'"},
            'domain': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['resumes']