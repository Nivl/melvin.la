from commons.urls import live_edit_url

urlpatterns = live_edit_url('resume', 'category', 'name')
urlpatterns += live_edit_url('resume', 'content', 'key')
urlpatterns += live_edit_url('resume', 'content', 'value')
