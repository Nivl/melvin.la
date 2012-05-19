from django import forms
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from models import UserProfile

class UserForm(forms.Form):
    username = forms.RegexField(regex=r'^[\w.@+-]+$',
                                max_length=30,
                                widget=forms.TextInput(),
                                label=_("Username"),
                                error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
    first_name = forms.CharField(label=_("First name"))
    last_name  = forms.CharField(label=_("Last name"))
    email      = forms.EmailField(label=_("E-mail"))
    password1  = forms.CharField(widget=forms.PasswordInput(render_value=False)
                                 ,label=_("Password"))
    password2  = forms.CharField(widget=forms.PasswordInput(render_value=False)
                                 ,label=_("Password (again)"))

class UserProfileForm(UserForm):
    pass
#    class Meta:
#        model = UserProfile
#        exclude = ('user')
