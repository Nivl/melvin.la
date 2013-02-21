# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'License.image'
        db.delete_column('lab_license', 'image')


    def backwards(self, orm):
        # Adding field 'License.image'
        db.add_column('lab_license', 'image',
                      self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True, blank=True),
                      keep_default=False)


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'commons.i18nsite': {
            'Meta': {'object_name': 'I18nSite'},
            'flag': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'site': ('django.db.models.fields.related.OneToOneField', [], {'related_name': "'site_i18nsite_commons'", 'unique': 'True', 'primary_key': 'True', 'to': "orm['sites.Site']"})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'lab.client': {
            'Meta': {'unique_together': "(('site', 'slug'),)", 'object_name': 'Client'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'related_name': "'lab_client_site'", 'to': "orm['commons.I18nSite']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        },
        'lab.coworker': {
            'Meta': {'unique_together': "(('site', 'slug'),)", 'object_name': 'Coworker'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'related_name': "'lab_coworker_site'", 'to': "orm['commons.I18nSite']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        },
        'lab.download': {
            'Meta': {'object_name': 'Download'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'icon': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'download_icon'", 'to': "orm['lab.DownloadIcon']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'download_project'", 'to': "orm['lab.Project']"}),
            'uploaded_file': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        },
        'lab.downloadicon': {
            'Meta': {'object_name': 'DownloadIcon'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'lab.image': {
            'Meta': {'object_name': 'Image'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'image_project'", 'to': "orm['lab.Project']"})
        },
        'lab.language': {
            'Meta': {'object_name': 'Language'},
            'color': ('commons.fields.ColorField', [], {'max_length': '10'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'})
        },
        'lab.license': {
            'Meta': {'unique_together': "(('site', 'slug'),)", 'object_name': 'License'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'related_name': "'lab_license_site'", 'to': "orm['commons.I18nSite']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        },
        'lab.progress': {
            'Meta': {'ordering': "['-pub_date']", 'object_name': 'Progress'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'progress_project'", 'to': "orm['lab.Project']"}),
            'pub_date': ('django.db.models.fields.DateField', [], {'default': 'datetime.datetime.now'})
        },
        'lab.project': {
            'Meta': {'ordering': "['-start_date']", 'unique_together': "(('site', 'slug'),)", 'object_name': 'Project'},
            'catchphrase': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'clients': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'project_clients'", 'null': 'True', 'symmetrical': 'False', 'to': "orm['lab.Client']"}),
            'clients_user': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'lab_project_clients_user'", 'null': 'True', 'symmetrical': 'False', 'to': "orm['auth.User']"}),
            'coworkers': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'project_coworkers'", 'null': 'True', 'symmetrical': 'False', 'to': "orm['lab.Coworker']"}),
            'coworkers_user': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'lab_project_coworkers_user'", 'null': 'True', 'symmetrical': 'False', 'to': "orm['auth.User']"}),
            'demo_codebox': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {}),
            'edit_date': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'languages': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'lab_project_languages'", 'symmetrical': 'False', 'through': "orm['lab.ProjectLanguageRate']", 'to': "orm['lab.Language']"}),
            'license': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'lab_project_license'", 'to': "orm['lab.License']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'overall_progress': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'related_name': "'lab_project_site'", 'to': "orm['commons.I18nSite']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'}),
            'sources_url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'start_date': ('django.db.models.fields.DateField', [], {'default': 'datetime.datetime.now'}),
            'tags': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'project_tags'", 'null': 'True', 'symmetrical': 'False', 'to': "orm['lab.Tag']"})
        },
        'lab.projectlanguagerate': {
            'Meta': {'object_name': 'ProjectLanguageRate'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'projectlanguagerate_language'", 'to': "orm['lab.Language']"}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'projectlanguagerate_project'", 'to': "orm['lab.Project']"}),
            'rate': ('django.db.models.fields.PositiveIntegerField', [], {})
        },
        'lab.tag': {
            'Meta': {'unique_together': "(('site', 'slug'),)", 'object_name': 'Tag'},
            'icon_disabled': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'icon_enabled': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'related_name': "'lab_tag_site'", 'to': "orm['commons.I18nSite']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'})
        },
        'lab.todo': {
            'Meta': {'object_name': 'Todo'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'todo_project'", 'to': "orm['lab.Project']"}),
            'task': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        'lab.video': {
            'Meta': {'object_name': 'Video'},
            'description': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'video_project'", 'to': "orm['lab.Project']"}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        'seo.seoeverywhere': {
            'Meta': {'object_name': 'SeoEverywhere'},
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']", 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'keywords': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'object_id': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'})
        },
        'seo.seomicrodata': {
            'Meta': {'object_name': 'SeoMicroData'},
            'content': ('django.db.models.fields.TextField', [], {}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']", 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'object_id': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'})
        },
        'sites.site': {
            'Meta': {'ordering': "('domain',)", 'object_name': 'Site', 'db_table': "'django_site'"},
            'domain': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['lab']