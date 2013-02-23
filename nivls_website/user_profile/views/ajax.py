import uuid
from django.template import RequestContext
from django.utils.translation import ugettext as _
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.shortcuts import render
from django.contrib.auth.views import password_reset_confirm
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from commons.decorators import ajax_only, login_forbidden
from user_profile.forms import *


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
                'users/inc/sign_up_mail.haml',
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
            return render(request, 'users/ajax/sign_up_ok.haml')
    else:
        form = UserForm()
    return render(request, "users/ajax/sign_up_form.haml", {'form': form})


@ajax_only
def my_password_reset_confirm_form(request, uidb36, token):
    return password_reset_confirm(
        request,
        template_name='users/ajax/password_confirm_form.haml',
        uidb36=uidb36,
        token=token,
        extra_context={'e_uidb36': uidb36,
                       'e_token': token})


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
            return HttpResponse('200')
    else:
        form = EditPasswordForm(request=request)
    return render(request, "users/ajax/edit_password_form.haml", {'form': form})


@ajax_only
@login_required
def edit_email_form(request):
    if request.method == 'POST':
        form = EditEmailForm(request.POST, request=request)
        if form.is_valid():
            request.user.email = form.cleaned_data['email']
            request.user.save()
            return HttpResponse('200')
    else:
        form = EditEmailForm(initial={'email': request.user.email},
                             request=request)
    return render(request, "users/ajax/edit_email_form.haml", {'form': form})


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
            instance=profile)

        if account_form.is_valid() and profile_form.is_valid():
            account_form.save()
            p = profile_form.save(commit=False)
            if account_form.cleaned_data['username'] != username:
                p.lock_username = True
            p.save()
            return HttpResponse("200")
    else:
        account_form = UserEditForm(edit_username=(not profile.lock_username),
                                    instance=request.user)
        profile_form = UserProfileInfoForm(instance=profile)
    return render(request, "users/ajax/edit_account_form.haml",
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
            return HttpResponse("200")
    else:
        form = UserProfileSettingsForm(instance=profile)
    return render(request, "users/ajax/edit_settings_form.haml", {'form': form})


@ajax_only
@login_required
def handle_dropped_picture(request):
    profile = request.user.get_profile()
    if request.method == 'POST':
        form = UserPictureForm(request.POST, request.FILES,
                               instance=profile)
        if form.is_valid():
            form.save()
            return HttpResponse("200")
    else:
        form = UserPictureForm(instance=profile)
    return render(request, "users/ajax/edit_picture_drop_form.haml",
                  {'form': form})


@ajax_only
@login_required
def edit_picture_form(request):
    profile = request.user.get_profile()
    if request.method == 'POST':
        form = UserPictureForm(request.POST, request.FILES,
                               instance=profile)
        if form.is_valid():
            form.save()
            return render(request, "users/ajax/edit_picture_ok.haml",
                          {'has_file': len(request.FILES)})
    else:
        form = UserPictureForm(instance=profile)
    return render(request, "users/ajax/edit_picture_form.haml",
                  {'form': form})


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
            return render(request, 'users/ajax/edit_avatar_ok.haml')
    else:
        form = UserAvatarForm(instance=profile)
    return render(request, "users/ajax/edit_avatar_form.haml", {'form': form})
