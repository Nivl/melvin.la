from django import forms
from django.utils.translation import ugettext_lazy as _
import happyforms


class SingleCharFieldForm(happyforms.Form):
    single = forms.CharField(
        label=_(' '))

    def __init__(self, data=None, files=None, size=100, prefix='single_', is_textarea=False, *args, **kwargs):
        super(SingleCharFieldForm, self).__init__(data=data, files=files, prefix=prefix, *args, **kwargs)

        if is_textarea:
            self.fields['single'].widget = forms.Textarea(attrs={'style': 'width: ' + str(size) + '%;'})
        else:
            self.fields['single'].widget.attrs['style'] = 'width: ' + str(size) + '%;'


class SingleTextareaForm(SingleCharFieldForm):
    def __init__(self, data=None, files=None, size=100, prefix='single_', *args, **kwargs):
        super(SingleTextareaForm, self).__init__(data=data, files=files, size=size, is_textarea=True, prefix=prefix, *args, **kwargs)


class CroppedImageForm(forms.Form):
    coordinates = forms.RegexField(
        regex=r'^\d+x\d+ \d+x\d+$',
        max_length=30,
        widget=forms.HiddenInput(),
        error_messages={'invalid': _('Invalid coordinates.')})

    def __init__(self, data=None, files=None,
                 image=None, obj=None, field=None, *args, **kwargs):
        if image is None:
            raise TypeError("Keyword argument 'image' must be supplied")
        if field is None:
            raise TypeError("Keyword argument 'field' must be supplied")
        if obj is None:
            raise TypeError("Keyword argument 'obj' must be supplied")
        super(CroppedImageForm, self).__init__(data=data, files=files,
                                               *args, **kwargs)
        self.image = image
        self.field = field
        self.obj = obj

    def clean_coordinates(self):
        pic_ratio_l = self.obj._meta.get_field(self.field).ratio.split('x')
        min_size = self.obj._meta.get_field(self.field).min_size
        max_size = self.obj._meta.get_field(self.field).max_size

        data = self.cleaned_data.get('coordinates').split(' ')
        x, y = data[0].split('x')
        w, h = data[1].split('x')

        avatar_ratio = round(int(w) / int(h), 2)
        pic_ratio = round(int(pic_ratio_l[0]) / int(pic_ratio_l[1]), 2)
        ratio = abs(pic_ratio - avatar_ratio)

        if (w < min_size[0] and min_size[0] != 0) \
                or (w > max_size[0] and max_size[0] != 0) \
                or (h < min_size[1] and min_size[1] != 0) \
                or (h > max_size[1] and max_size[1] != 0) \
                or ratio > 0.01 \
                or int(x) + int(w) > self.image.width \
                or int(y) + int(h) > self.image.height:
            raise forms.ValidationError(_("Invalid coordinates."))
        return self.cleaned_data.get('coordinates')
