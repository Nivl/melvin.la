from django.views.defaults import permission_denied
from django.contrib import messages
from django.utils.translation import ugettext as _
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.models import User
from django.contrib.auth.views import login, password_reset_confirm
from django.core.urlresolvers import resolve, Resolver404, reverse
from django.views.decorators.http import require_safe
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from commons.decorators import login_forbidden
from user_profile.forms import *


def sign_in(request):
    if request.user.is_authenticated():
        try:
            resolve(request.GET.get('next', ''))
            return HttpResponseRedirect(request.GET.get('next'))
        except Resolver404:
            return HttpResponseRedirect(reverse('home'))
    else:
        return login(request, template_name='users/sign_in.haml')


@require_safe
def sign_in_failed(request):
    if request.user.is_authenticated():
        messages.error(request, True)
        return redirect('manage-social-account')
    else:
        return login(
            request,
            template_name='users/sign_in.haml',
            extra_context={'error': _('The sign in has failed. If you '
                                      'think the problem comes from us, '
                                      'feel free to contact us.')})


@require_safe
@login_forbidden()
def sign_up(request):
    form = UserForm()
    return render(request, "users/sign_up.haml", {'form': form})


@require_safe
@login_forbidden()
def activate_account(request, code):
    try:
        profile = UserProfile.objects.get(activation_code=code)
        user = profile.user
        user.is_active = 1
        user.save()
        profile.activation_code = ''
        profile.save()
        return login(
            request,
            template_name='users/sign_in.haml',
            extra_context={
                'success': _('Your account has been '
                             'successfully activated, you can now sign in.'
                             )})

    except UserProfile.DoesNotExist:
        return login(
            request,
            template_name='users/sign_in.haml',
            extra_context={
                'error': _('This activation link does not exists. '
                           'If you are experiencing activation issues, '
                           'you can contact us using the contact form.'
                           )})


@require_safe
def my_password_reset_confirm(request, uidb36, token):
    return password_reset_confirm(
        request,
        template_name='users/password_confirm.haml',
        uidb36=uidb36,
        token=token,
        extra_context={'e_uidb36': uidb36,
                       'e_token': token})


@require_safe
def view_account(request, name):
    u = get_object_or_404(User, username=name)
    return render(request, "users/view.haml", {'target_user': u,
                                               'profile': u.get_profile()})


@require_safe
@login_required
def edit_account(request):
    profile = request.user.get_profile()
    account_form = UserEditForm(edit_username=(not profile.lock_username),
                                instance=request.user)
    account_profile_form = UserProfileInfoForm(instance=profile)
    settings_form = UserProfileSettingsForm(instance=profile)
    email_form = EditEmailForm(request=request,
                               initial={'email': request.user.email})
    psw_form = EditPasswordForm(request=request)

    return render(request, "users/edit_account.haml",
                  {'account_form': account_form,
                   'account_profile_form': account_profile_form,
                   'settings_form': settings_form,
                   'email_form': email_form,
                   'psw_form': psw_form,
                   })


@require_safe
@login_required
def edit_picture(request):
    form = UserPictureForm(instance=request.user.get_profile())
    return render(request, "users/edit_picture.haml",
                  {'form': form})


@require_safe
@login_required
def edit_avatar(request):
    profile = request.user.get_profile()
    if not profile.picture:
        return permission_denied(request)
    return render(request, "users/edit_avatar.haml",
                  {'picture': profile.picture,
                   'form': UserAvatarForm(instance=profile),
                   })


@require_safe
@login_required
def manage_social_account(request):
    return render(request, "users/manage_social_accounts.haml")
