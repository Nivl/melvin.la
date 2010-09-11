from django.conf.urls.defaults import *
from nivlsblog.entries.models  import Entry
from django.views.generic import date_based


entry_info = {'queryset'                    : Entry.objects.all(),
              'date_field'                  : 'date',
              'template_name'               : 'entries/detail.html',
              'template_object_name'        : 'entry',
              'month_format'                : '%m'}

urlpatterns = patterns('',
    (r'^comments/', include('django.contrib.comments.urls')),
    (url(r'^(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/(?P<slug>[\w-]+)$',
         date_based.object_detail, entry_info)),
    )


#tt = time.strptime('%s-%s-%s' % (2010, 09, 09),
#                   '%s-%s-%s' % ('%Y', '', ''))
#date = datetime.date(*tt[:3])

#print date
