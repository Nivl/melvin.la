
DOMAIN_NAME = 'localhost:8000'

ADMINS = (
    ('admin', 'name@domain.tld'),
)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '',
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}

AKISMET_API_KEY = "PUT_YOUR_KEY_HERE"  # http://akismet.com/get/

SECRET_KEY = 'dtfgyu&^*(){:"56433RDTF90po;luhsau'

#
# Social Auth
#

TWITTER_CONSUMER_KEY = ''
TWITTER_CONSUMER_SECRET = ''
FACEBOOK_APP_ID = ''
FACEBOOK_API_SECRET = ''
FACEBOOK_EXTENDED_PERMISSIONS = ['email']
GOOGLE_OAUTH2_CLIENT_ID = ''
GOOGLE_OAUTH2_CLIENT_SECRET = ''
GOOGLE_OAUTH2_EXTRA_DATA = [('id', 'id')]
GITHUB_APP_ID = ''
GITHUB_API_SECRET = ''

#
# Django pipeline
# http://django-pipeline.readthedocs.org/en/latest/compressors.html
#

PIPELINE_UGLIFYJS_BINARY = '/usr/bin/uglifyjs'
PIPELINE_CSSTIDY_BINARY = '/usr/bin/csstidy'
PIPELINE_YUI_BINARY = '/usr/bin/yuicompressor'
PIPELINE_LESS_BINARY = '/usr/bin/lessc'

PIPELINE_JS_COMPRESSOR = 'pipeline.compressors.uglifyjs.UglifyJSCompressor'
PIPELINE_CSS_COMPRESSOR = 'pipeline.compressors.cssmin.CssminCompressor'
