# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Content.value_for_download'
        db.alter_column(u'resume_content', 'value_for_download', self.gf('django.db.models.fields.TextField')(null=True))

    def backwards(self, orm):

        # Changing field 'Content.value_for_download'
        db.alter_column(u'resume_content', 'value_for_download', self.gf('django.db.models.fields.CharField')(max_length=255, null=True))

    models = {
        u'commons.i18nsite': {
            'Meta': {'object_name': 'I18nSite'},
            'flag': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'site': ('django.db.models.fields.related.OneToOneField', [], {'related_name': "'site_i18nsite_commons'", 'unique': 'True', 'primary_key': 'True', 'to': u"orm['sites.Site']"})
        },
        u'resume.category': {
            'Meta': {'ordering': "['section', 'order']", 'unique_together': "(('order', 'section'),)", 'object_name': 'Category'},
            'display_type': ('django.db.models.fields.CharField', [], {'default': "'L'", 'max_length': '1'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'order': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'section': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'section_category'", 'to': u"orm['resume.Section']"})
        },
        u'resume.content': {
            'Meta': {'ordering': "['order']", 'object_name': 'Content'},
            'category': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'category_content'", 'to': u"orm['resume.Category']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'value': ('django.db.models.fields.TextField', [], {}),
            'value_for_download': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'})
        },
        u'resume.document': {
            'Meta': {'ordering': "['order']", 'unique_together': "(('category', 'name'),)", 'object_name': 'Document'},
            'category': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'category_document'", 'to': u"orm['resume.DocumentCategory']"}),
            'document': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'})
        },
        u'resume.documentcategory': {
            'Meta': {'ordering': "['order']", 'unique_together': "(('site', 'name'),)", 'object_name': 'DocumentCategory'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'related_name': "'site_documentcategory_resumes'", 'to': u"orm['commons.I18nSite']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'})
        },
        u'resume.section': {
            'Meta': {'ordering': "['order']", 'unique_together': "(('site', 'slug'),)", 'object_name': 'Section'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'related_name': "'site_section_resumes'", 'to': u"orm['commons.I18nSite']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'})
        },
        u'sites.site': {
            'Meta': {'ordering': "('domain',)", 'object_name': 'Site', 'db_table': "'django_site'"},
            'domain': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['resume']