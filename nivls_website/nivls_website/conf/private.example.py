
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
