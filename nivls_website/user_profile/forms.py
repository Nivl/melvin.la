from django import forms
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from bootstrap.forms import BootstrapForm
from captcha.fields import CaptchaField
from commons import happyforms
from models import UserProfile

class UserForm(BootstrapForm, happyforms.Form):
    username = forms.RegexField(regex=r'^[\w.@+-]+$'
                                ,max_length=30
                                ,widget=forms.TextInput()
                                ,label=_('Username')
                                ,error_messages={'invalid':_('This value may contain only letters, numbers and @/./+/-/_ characters.')})
    first_name = forms.CharField(label=_("First name"))
    last_name  = forms.CharField(label=_("Last name"))
    email      = forms.EmailField(label=_("E-mail"))
    password1  = forms.CharField(widget=forms.PasswordInput(render_value=False)
                                 ,label=_("Password"))
    password2  = forms.CharField(widget=forms.PasswordInput(render_value=False)
                                 ,label=_("Password (again)"))
    captcha    = CaptchaField()

    def clean_username(self):
        data = self.cleaned_data.get('username')

        if User.objects.filter(username=data).exists():
            raise forms.ValidationError(_("Sorry, this username has already been taken."))
        return data

    def clean_email(self):
        data = self.cleaned_data.get('email')

        if User.objects.filter(email=data).exists():
            raise forms.ValidationError(_("This email address is already in use."))
        return data

    def clean(self):
        cleaned_data = super(UserForm, self).clean()
        psw1 = cleaned_data.get('password1')
        psw2 = cleaned_data.get('password2')

        if psw1 != psw2:
            raise forms.ValidationError(_("The passwords did not matched."))

        return cleaned_data

class UserProfileForm(UserForm):
    pass
#    class Meta:
#        model = UserProfile
#        exclude = ('user')
