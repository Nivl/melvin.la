from django import forms
from django.template.defaultfilters import filesizeformat
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.core.files.images import get_image_dimensions
from bootstrap.forms import BootstrapForm, BootstrapModelForm
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


class UserProfileForm(BootstrapModelForm):
    class Meta:
        model = UserProfile
        exclude = ('user', 'activation_code', 'avatar')

    def clean_picture(self):
        data        = self.cleaned_data.get('picture')

        if data:
            min_size    = UserProfile._meta.get_field('avatar').min_size
            max_size    = UserProfile._meta.get_field('avatar').max_size

            if data._size > settings.MAX_UPLOAD_SIZE:
                raise forms.ValidationError(_('Please keep filesize under %s. Current filesize %s') % (filesizeformat(settings.MAX_UPLOAD_SIZE), filesizeformat(data._size)))

            w, h = get_image_dimensions(data)

            if (min_size[0] != 0 and w < min_size[0]) \
                    or (min_size[1] != 0 and h < min_size[1]):
                raise forms.ValidationError(_("Your image is to small. the minimum size is %(x)dx%(y)d" % {'x': min_size[0], 'y': min_size[1]}))

            if (max_size[0] != 0 and w > max_size[0]) \
                    or (max_size[1] != 0 and h > max_size[1]):
                raise forms.ValidationError(_("Your image is to large. the maximum size is %(x)dx%(y)d" % {'x': max_size[0], 'y': max_size[1]}))

        return data;

class CroppedImageForm(forms.Form):
    coordinates = forms.RegexField(regex=r'^\d+x\d+ \d+x\d+$'
                                   ,max_length=30
                                   ,widget=forms.HiddenInput()
                                   ,error_messages={'invalid':_('Invalid coordinates.')})

    def __init__(self, data=None, files=None
                 , image=None, obj=None, field=None, *args, **kwargs):
        if image is None:
            raise TypeError("Keyword argument 'image' must be supplied")
        if field is None:
            raise TypeError("Keyword argument 'field' must be supplied")
        if obj is None:
            raise TypeError("Keyword argument 'obj' must be supplied")
        super(CroppedImageForm, self).__init__(data=data, files=files
                                               , *args, **kwargs)
        self.image = image
        self.field = field
        self.obj = obj

    def clean_coordinates(self):
        pic_ratio_l = self.obj._meta.get_field(self.field).ratio.split('x')
        min_size    = self.obj._meta.get_field(self.field).min_size
        max_size    = self.obj._meta.get_field(self.field).max_size

        data = self.cleaned_data.get('coordinates').split(' ')
        x, y = data[0].split('x')
        w, h = data[1].split('x')

        avatar_ratio = round(int(w) / int(h), 2)
        pic_ratio    = round(int(pic_ratio_l[0]) / int(pic_ratio_l[1]), 2)
        ratio        = abs(pic_ratio - avatar_ratio)

        if (w < min_size[0] and min_size[0] != 0) \
                or (w > max_size[0] and max_size[0] != 0) \
                or (h < min_size[1] and min_size[1] != 0) \
                or (h > max_size[1] and max_size[1] != 0) \
                or ratio > 0.01 \
                or int(x) + int(w) > self.image.width \
                or int(y) + int(h) > self.image.height:
            raise forms.ValidationError(_("Invalid coordinates."))
        return self.cleaned_data.get('coordinates')
