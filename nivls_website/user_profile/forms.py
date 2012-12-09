from django import forms
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from captcha.fields import CaptchaField
from commons import happyforms
from models import UserProfile


class UserForm(happyforms.ModelForm):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')

    password1 = forms.CharField(
        widget=forms.PasswordInput(render_value=False),
        label=_("Password"))

    password2 = forms.CharField(
        widget=forms.PasswordInput(render_value=False),
        label=_("Password (again)"))

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
            error_messages={'invalid': _('This value may contain only '
                                         'letters, numbers and '
                                         '@/./+/-/_ characters.')}, )

    def clean_username(self):
        data = self.cleaned_data.get('username')

        if User.objects.filter(username=data).exists():
            raise forms.ValidationError(_('Sorry, this username has already'
                                          ' been taken.'))
        return data

    def clean_email(self):
        data = self.cleaned_data.get('email')

        if User.objects.filter(email=data).exists():
            raise forms.ValidationError(_('This email address is already '
                                          'in use.'))
        return data

    def clean(self):
        cleaned_data = super(UserForm, self).clean()
        psw1 = cleaned_data.get('password1')
        psw2 = cleaned_data.get('password2')

        if psw1 != psw2:
            raise forms.ValidationError(_("The passwords did not matched."))

        return cleaned_data


class UserEditForm(happyforms.ModelForm):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name')

    def __init__(self, data=None, files=None, edit_username=False,
                 *args, **kwargs):
        super(UserEditForm, self).__init__(data=data, files=files,
                                           *args, **kwargs)
        self.fields['username'] = forms.RegexField(
            regex=r'^[\w.@+-]+$',
            max_length=30,
            widget=forms.TextInput(),
            label=_('Username'),
            error_messages={'invalid': _('This value may contain only '
                                         'letters, numbers and '
                                         '@/./+/-/_ characters.')}, )

        if not edit_username:
            self.fields['username'].widget.attrs['readonly'] = True
        else:
            self.fields['username'].help_text = _(
                'This is a one shot field, you can only edit your '
                'username once.')
        self.edit_username = edit_username

    def clean_username(self):
        if not self.edit_username:
            return self.instance.username

        data = self.cleaned_data.get('username')
        if data != self.instance.username \
                and User.objects.filter(username=data).exists():
            raise forms.ValidationError(_('Sorry, this username has '
                                          'already been taken.'))
        return data


class UserProfileInfoForm(happyforms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('occupation', 'hobbies', 'website')


class UserProfileSettingsForm(happyforms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('show_twitter', 'show_google_plus', 'show_facebook',
                  'use_name', 'show_github')


class EditEmailForm(happyforms.Form):
    password = forms.CharField(
        widget=forms.PasswordInput(render_value=False),
        required=True,
        label=_("Password"))

    email = forms.EmailField(
        required=True,
        label=_("E-mail address"))

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
            raise forms.ValidationError(_('This email address is already '
                                          'in use.'))
        return data

    def clean_password(self):
        data = self.cleaned_data.get('password')
        if not self.request.user.check_password(data):
            raise forms.ValidationError(_("Wrong password."))
        return data


class EditPasswordForm(happyforms.Form):
    old_password = forms.CharField(
        widget=forms.PasswordInput(),
        required=True,
        label=_("Old password"))

    new_password = forms.CharField(
        widget=forms.PasswordInput(),
        required=True,
        label=_("New password"))

    new_password_again = forms.CharField(
        widget=forms.PasswordInput(),
        required=True,
        label=_("New password again"))

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


class UserAvatarForm(happyforms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('avatar', )


class UserPictureForm(happyforms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('picture', )
