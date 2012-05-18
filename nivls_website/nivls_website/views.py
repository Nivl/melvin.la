from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.views import login
from django.core.urlresolvers import resolve, Resolver404, reverse
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from commons.forms import BootstrapLoginForm
from social_auth.models import UserSocialAuth

def signup(request):
    if request.user.is_authenticated():
        try:
            resolve(request.GET.get('next', ''))
            return HttpResponseRedirect(request.GET.get('next'))
        except Resolver404:
            return HttpResponseRedirect(reverse('home'))
    else:
        pass

@login_required
def view_account(request):
    pass

@login_required
def edit_account(request):
    pass

@login_required
def manage_social_account(request):
    return render(request, "blog/accounts/manage_social_accounts.html")

def signin(request):
    if request.user.is_authenticated():
        try:
            resolve(request.GET.get('next', ''))
            return HttpResponseRedirect(request.GET.get('next'))
        except Resolver404:
            return HttpResponseRedirect(reverse('home'))
    else:
        return login(request, template_name='blog/accounts/signin.html'
                     ,authentication_form=BootstrapLoginForm)
