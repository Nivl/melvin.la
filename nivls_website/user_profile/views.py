from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.views import login
from django.core.urlresolvers import resolve, Resolver404, reverse
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from commons.forms import BootstrapLoginForm
from social_auth.models import UserSocialAuth
from forms import *

def sign_up(request):
    if request.user.is_authenticated():
        try:
            resolve(request.GET.get('next', ''))
            return HttpResponseRedirect(request.GET.get('next'))
        except Resolver404:
            return HttpResponseRedirect(reverse('home'))
    else:
        if request.method == 'POST':
            form = UserForm(request.POST)
            if form.is_valid():
                pass
        else:
            form = UserForm()
        return render(request, "users/sign_up.html", {'form': form})

@login_required
def view_account(request):
    pass

@login_required
def edit_account(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES)
    else:
        form = UserProfileForm()
    return render(request, "users/edit.html", {'form': form})

@login_required
def manage_social_account(request):
    return render(request, "users/manage_social_accounts.html")

def sign_in(request):
    if request.user.is_authenticated():
        try:
            resolve(request.GET.get('next', ''))
            return HttpResponseRedirect(request.GET.get('next'))
        except Resolver404:
            return HttpResponseRedirect(reverse('home'))
    else:
        return login(request, template_name='users/sign_in.html'
                     ,authentication_form=BootstrapLoginForm)
