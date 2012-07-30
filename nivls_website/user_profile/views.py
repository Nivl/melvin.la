import uuid
from django.template import RequestContext
from django.views.defaults import permission_denied
from django.contrib import messages
from django.utils.translation import ugettext as _
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.models import User
from django.contrib.auth.views import login, password_reset_confirm
from django.core.urlresolvers import resolve, Resolver404, reverse
from django.views.decorators.http import require_safe
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from social_auth.models import UserSocialAuth
from commons.forms import BootstrapLoginForm, CroppedImageForm
from commons.decorators import ajax_only, login_forbidden
from forms import *


@ajax_only
def my_password_reset_confirm_form(request, uidb36, token):
    return password_reset_confirm(
        request,
        template_name='users/ajax/password_confirm_form.html',
        uidb36=uidb36,
        token=token,
        extra_context={'e_uidb36': uidb36,
                       'e_token': token})


@require_safe
def my_password_reset_confirm(request, uidb36, token):
    return password_reset_confirm(
        request,
        template_name='users/password_confirm.html',
        uidb36=uidb36,
        token=token,
        extra_context={'e_uidb36': uidb36,
                       'e_token': token})


@require_safe
def sign_in_failed(request):
    if request.user.is_authenticated():
        messages.error(request, True)
        return redirect('manage-social-account')
    else:
        return login(
            request,
            template_name='users/sign_in.html',
            authentication_form=BootstrapLoginForm,
            extra_context={'error': _('The sign in has failed. If you '
                                      'think the problem comes from us, '
                                      'feel free to contact us.')})

@ajax_only
@login_required
def edit_password_form(request):
    if request.method == 'POST':
        form = EditPasswordForm(request.POST, request=request)
        if form.is_valid():
            request.user.set_password(form.cleaned_data['new_password'])
            request.user.save()
            p = request.user.get_profile()
            p.has_password = True
            p.save()
            return HttpResponse('OK')
    else:
        form = EditPasswordForm(request=request)
    return render(request, "users/ajax/edit_password_form.html", {'form': form})


@ajax_only
@login_required
def edit_email_form(request):
    if request.method == 'POST':
        form = EditEmailForm(request.POST, request=request)
        if form.is_valid():
            request.user.email = form.cleaned_data['email']
            request.user.save()
            return HttpResponse('OK')
    else:
        form = EditEmailForm(initial={'email': request.user.email},
                             request=request)
    return render(request, "users/ajax/edit_email_form.html", {'form': form})


@require_safe
@login_forbidden()
def sign_up(request):
    form = UserForm()
    return render(request, "users/sign_up.html", {'form': form})


@login_forbidden()
@ajax_only
def sign_up_form(request):
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            u = form.save(commit=False)
            u.set_password(form.cleaned_data['password1'])
            u.is_staff = False
            u.is_active = False
            u.is_superuser = False
            u.save()
            profile = UserProfile.objects.get(user=u)
            profile.activation_code = uuid.uuid4()
            profile.lock_username = True
            profile.has_password = True
            profile.save()

            subject = _('Your validation link')
            text_content = render_to_string(
                'users/inc/sign_up_mail.txt',
                {'user': u,
                 'code': profile.activation_code},
                context_instance=RequestContext(request))

            html_content = render_to_string(
                'users/inc/sign_up_mail.html',
                {'user': u,
                 'code': profile.activation_code},
                context_instance=RequestContext(request))

            msg = EmailMultiAlternatives(
                subject,
                text_content,
                settings.EMAIL_NO_REPLY,
                [u.email])

            msg.attach_alternative(html_content, 'text/html')
            msg.send(fail_silently=True)
            return render(request, 'users/ajax/sign_up_ok.html')
    else:
        form = UserForm()
    return render(request, "users/ajax/sign_up_form.html", {'form': form})


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
            template_name='users/sign_in.html',
            authentication_form=BootstrapLoginForm,
            extra_context={
                'success': _('Your account has been '
                             'successfully activated, you can now sign in.'
                             )})

    except UserProfile.DoesNotExist:
        return login(
            request,
            template_name='users/sign_in.html',
            authentication_form=BootstrapLoginForm,
            extra_context={
                'error': _('This activation link does not exists. '
                           'If you are experiencing activation issues, '
                           'you can contact us using the contact form.'
                           )})


@require_safe
@login_required
def view_account(request, name):
    u = get_object_or_404(User, username=name)
    return render(request, "users/view.html", {'target_user': u,
                                               'profile': u.get_profile()})


@require_safe
@login_required
def edit_avatar(request):
    profile = request.user.get_profile()
    if not profile.picture:
        return permission_denied(request)
    return render(request, "users/edit_avatar.html",
                  {'picture': profile.picture,
                   'form': UserAvatarForm(instance=profile),
                   })


@ajax_only
@login_required
def edit_avatar_form(request):
    profile = request.user.get_profile()
    if not profile.picture:
        return HttpResponseForbidden()

    if request.method == 'POST':
        form = UserAvatarForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return render(request, 'users/ajax/edit_avatar_ok.html')
    else:
        form = UserAvatarForm(instance=profile)
    return render(request, "users/ajax/edit_avatar_form.html", {'form': form})


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

    return render(request, "users/edit_account.html",
                  {'account_form': account_form,
                   'account_profile_form': account_profile_form,
                   'settings_form': settings_form,
                   'email_form': email_form,
                   'psw_form': psw_form,
                   })


@ajax_only
@login_required
def edit_account_form(request):
    profile = request.user.get_profile()
    username = request.user.username
    if request.method == 'POST':
        account_form = UserEditForm(
            request.POST,
            edit_username=(not profile.lock_username),
            instance=request.user)

        profile_form = UserProfileInfoForm(
            request.POST,
            request.FILES,
            instance=profile)

        if account_form.is_valid() and profile_form.is_valid():
            u = account_form.save()
            p = profile_form.save(commit=False)
            if account_form.cleaned_data['username'] != username:
                p.lock_username = True
            p.save()
            return HttpResponse("OK");
    else:
        account_form = UserEditForm(edit_username=(not profile.lock_username),
                                    instance=request.user)
        profile_form = UserProfileInfoForm(instance=profile)
    return render(request, "users/ajax/edit_account_form.html",
                  {'account_form': account_form,
                   'profile_form': profile_form,
                   })

@ajax_only
@login_required
def edit_settings_form(request):
    profile = request.user.get_profile()
    if request.method == 'POST':
        form = UserProfileSettingsForm(
            request.POST,
            instance=profile)

        if form.is_valid():
            form.save()
            return HttpResponse("OK");
    else:
        form = UserProfileSettingsForm(instance=profile)
    return render(request, "users/ajax/edit_settings_form.html", {'form': form})


@require_safe
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
        return login(request, template_name='users/sign_in.html',
                     authentication_form=BootstrapLoginForm)
