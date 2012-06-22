from django import forms
from django.contrib.auth.models import User
from django.template.defaultfilters import filesizeformat
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.core.files.images import get_image_dimensions
from bootstrap.forms import BootstrapForm, BootstrapModelForm
from captcha.fields import CaptchaField
from commons import happyforms
from models import UserProfile


class UserForm(BootstrapModelForm, happyforms.ModelForm):
    class Meta:
        model = User
        exclude = ('password', 'is_active', 'is_staff',
                   'is_superuser', 'groups', 'user_permissions',
                   'last_login', 'date_joined')

    password1 = forms.CharField(
        widget=forms.PasswordInput(render_value=False),
        label=_("Password")
        )
    password2 = forms.CharField(
        widget=forms.PasswordInput(render_value=False),
        label=_("Password (again)")
        )
    captcha = CaptchaField()

    def __init__(self, data=None, files=None, *args, **kwargs):
        super(UserForm, self).__init__(data=data, files=files,
                                       *args, **kwargs)
        self.fields['email'].required = True
        self.fields['first_name'].required = True
        self.fields['last_name'].required = True
        self.fields['username'] = forms.RegexField(
            regex=r'^[\w.@+-]+$',
            max_length=30,
            widget=forms.TextInput(),
            label=_('Username'),
            error_messages={'invalid':_('This value may contain only '\
                                             'letters, numbers and '\
                                             '@/./+/-/_ characters.')}
            )

    def clean_username(self):
        data = self.cleaned_data.get('username')

        if User.objects.filter(username=data).exists():
            raise forms.ValidationError(_('Sorry, this username has already' \
                                              ' been taken.'))
        return data

    def clean_email(self):
        data = self.cleaned_data.get('email')

        if User.objects.filter(email=data).exists():
            raise forms.ValidationError(_('This email address is already ' \
                                              'in use.'))
        return data

    def clean(self):
        cleaned_data = super(UserForm, self).clean()
        psw1 = cleaned_data.get('password1')
        psw2 = cleaned_data.get('password2')

        if psw1 != psw2:
            raise forms.ValidationError(_("The passwords did not matched."))

        return cleaned_data


class UserEditForm(UserForm):
    def __init__(self, data=None, files=None, edit_username=False,
                 *args, **kwargs):
        super(UserEditForm, self).__init__(data=data, files=files,
                                           *args, **kwargs)
        self.fields.pop('captcha')
        self.fields.pop('password1')
        self.fields.pop('password2')
        self.fields.pop('email')

        if not edit_username:
            self.fields['username'].widget.attrs['readonly'] = True
        else:
            self.fields['username'].help_text = _(
                'This is a one shot field, you can only edit your '\
                    'username once.'
                )
        self.edit_username = edit_username


    def clean_username(self):
        if not self.edit_username:
            return self.instance.username

        data = self.cleaned_data.get('username')
        if data != self.instance.username \
                and User.objects.filter(username=data).exists():
            raise forms.ValidationError(_('Sorry, this username has '\
                                              'already been taken.'))
        return data


class UserProfileForm(BootstrapModelForm):
    class Meta:
        model = UserProfile
        exclude = ('user', 'activation_code', 'avatar', 'has_password',
                   'lock_username')

    def clean_picture(self):
        data = self.cleaned_data.get('picture')

        try:
            min_size = UserProfile._meta.get_field('avatar').min_size
            max_size = UserProfile._meta.get_field('avatar').max_size

            if data._size > settings.MAX_UPLOAD_SIZE:
                raise forms.ValidationError(
                    _('Please keep filesize under %s. Current filesize %s') \
                        % (filesizeformat(settings.MAX_UPLOAD_SIZE),
                           filesizeformat(data._size))
                    )
            w, h = get_image_dimensions(data)

            if (min_size[0] != 0 and w < min_size[0]) \
                    or (min_size[1] != 0 and h < min_size[1]):
                raise forms.ValidationError(
                    _('Your image is to small. the minimum size ' \
                          'is %(x)dx%(y)d' \
                          % {'x': min_size[0], 'y': min_size[1]})
                    )

            if (max_size[0] != 0 and w > max_size[0]) \
                    or (max_size[1] != 0 and h > max_size[1]):
                raise forms.ValidationError(
                    _('Your image is to large. the maximum size ' \
                          'is %(x)dx%(y)d' \
                          % {'x': max_size[0],
                             'y': max_size[1]})
                    )

        except AttributeError:
            pass
        return data


class UserProfileInfoForm(UserProfileForm):
    class Meta:
        model = UserProfile
        exclude = ('user', 'activation_code', 'avatar', 'lock_username',
                   'show_twitter', 'show_google_plus', 'show_facebook',
                   'use_name', 'show_github', 'has_password')


class UserProfileSettingsForm(UserProfileForm):
    class Meta:
        model = UserProfile
        exclude = ('user', 'activation_code', 'avatar', 'lock_username',
                   'picture', 'website', 'hobbies', 'occupation',
                   'has_password')


class EditEmailForm(UserForm):
    class Meta:
        model = User
        exclude = ('password', 'is_active', 'is_staff',
                   'is_superuser', 'groups', 'user_permissions',
                   'last_login', 'date_joined')


class EditEmailForm(BootstrapForm, happyforms.Form):
    password = forms.CharField(
        widget=forms.PasswordInput(render_value=False),
        label=_("Password"),
        required=True,
        )
    email = forms.EmailField(
        label=_("E-mail address"),
        required=True,
        )


    def __init__(self, data=None, files=None, request=None, *args, **kwargs):
        if request is None:
            raise TypeError("Keyword argument 'request' must be supplied")
        super(EditEmailForm, self).__init__(data=data, files=files,
                                               *args, **kwargs)
        self.request = request


    def clean_email(self):
        data = self.cleaned_data.get('email')
        if data != self.request.user.email \
                and User.objects.filter(email=data).exists():
            raise forms.ValidationError(_('This email address is already '\
                                              'in use.'))
        return data

    def clean_password(self):
        data = self.cleaned_data.get('password')
        if not self.request.user.check_password(data):
            raise forms.ValidationError(_("Wrong password."))
        return data

class EditPasswordForm(BootstrapForm, happyforms.Form):
    old_password = forms.CharField(
        widget=forms.PasswordInput(),
        label=_("Old password"),
        required=True,
        )
    new_password = forms.CharField(
        widget=forms.PasswordInput(),
        label=_("New password"),
        required=True,
        )
    new_password_again = forms.CharField(
        widget=forms.PasswordInput(),
        label=_("New password again"),
        required=True,
        )

    def __init__(self, data=None, files=None, request=None, *args, **kwargs):
        if request is None:
            raise TypeError("Keyword argument 'request' must be supplied")
        super(EditPasswordForm, self).__init__(data=data, files=files,
                                               *args, **kwargs)
        if not request.user.get_profile().has_password:
            self.fields.pop('old_password')
        self.request = request


    def clean(self):
        cleaned_data = super(EditPasswordForm, self).clean()
        psw1 = cleaned_data.get('new_password')
        psw2 = cleaned_data.get('new_password_again')
        if psw1 != psw2:
            raise forms.ValidationError(_("The passwords did not matched."))
        return cleaned_data


    def clean_old_password(self):
        data = self.cleaned_data.get('old_password')
        if self.request.user.get_profile().has_password:
            if not self.request.user.check_password(data):
                raise forms.ValidationError(_("Wrong password."))
        return data
