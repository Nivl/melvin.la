from django.contrib.auth.views import login as login
from django.core.urlresolvers import resolve, Resolver404, reverse
from django.http import HttpResponseRedirect
from commons.forms import BootstrapLoginForm


def signup(request):
    pass


def signin(request):
    if request.user.is_authenticated():
        try:
            resolve(request.GET.get('next', ''))
            return HttpResponseRedirect(request.GET.get('next'))
        except Resolver404:
            return HttpResponseRedirect(reverse('home'))
    else:
        return login(request, template_name='blog/signin.html'
                     ,authentication_form=BootstrapLoginForm)
