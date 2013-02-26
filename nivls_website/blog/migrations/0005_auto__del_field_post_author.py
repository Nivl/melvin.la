# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Post.author'
        db.delete_column('blog_post', 'author_id')


    def backwards(self, orm):
        # Adding field 'Post.author'
        db.add_column('blog_post', 'author',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=1, to=orm['auth.User']),
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
        'blog.carousel': {
            'Meta': {'ordering': "['-order']", 'object_name': 'Carousel'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'post': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'post_carousel'", 'to': "orm['blog.Post']"}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'related_name': "'site_carousel_blog'", 'to': "orm['commons.I18nSite']"})
        },
        'blog.category': {
            'Meta': {'unique_together': "(('site', 'right'), ('site', 'left'), ('site', 'slug'))", 'object_name': 'Category'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '80', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_root': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'left': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'right': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'related_name': "'site_category_blog'", 'to': "orm['commons.I18nSite']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'})
        },
        'blog.comment': {
            'Meta': {'object_name': 'Comment'},
            'comment': ('django.db.models.fields.TextField', [], {}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ip_address': ('django.db.models.fields.GenericIPAddressField', [], {'max_length': '39'}),
            'is_public': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'post': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'post_comment'", 'to': "orm['blog.Post']"}),
            'pub_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'user_comment_blog'", 'null': 'True', 'to': "orm['auth.User']"}),
            'website': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        },
        'blog.image': {
            'Meta': {'object_name': 'Image'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'post': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'post_image'", 'to': "orm['blog.Post']"})
        },
        'blog.link': {
            'Meta': {'object_name': 'Link'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'menu': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'menu_link'", 'to': "orm['blog.Menu']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        'blog.menu': {
            'Meta': {'object_name': 'Menu'},
            'hide': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'related_name': "'site_menu_blog'", 'to': "orm['commons.I18nSite']"})
        },
        'blog.post': {
            'Meta': {'ordering': "['-pub_date']", 'unique_together': "(('slug', 'pub_date', 'site'),)", 'object_name': 'Post'},
            'allow_comment': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'category': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'category_post'", 'to': "orm['blog.Category']"}),
            'content': ('django.db.models.fields.TextField', [], {}),
            'edit_date': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'i18n': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'i18n_rel_+'", 'null': 'True', 'to': "orm['blog.Post']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_public': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'lab': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'lab_post_blog'", 'null': 'True', 'to': "orm['lab.Project']"}),
            'long_description': ('django.db.models.fields.CharField', [], {'max_length': '175'}),
            'main_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'pub_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'short_description': ('django.db.models.fields.CharField', [], {'max_length': '80'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'related_name': "'site_post_blog'", 'to': "orm['commons.I18nSite']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'}),
            'tags': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'tags_post'", 'null': 'True', 'symmetrical': 'False', 'to': "orm['blog.Tag']"}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'blog.tag': {
            'Meta': {'ordering': "['name']", 'unique_together': "(('site', 'slug'),)", 'object_name': 'Tag'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'related_name': "'site_tag_blog'", 'to': "orm['commons.I18nSite']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'})
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

    complete_apps = ['blog']