import re
from django import forms
from django.db import models
from django.utils.translation import ugettext_lazy as _
from widgets import ColorPickerWidget, CroppedImageWidget
from django.core.exceptions import ValidationError


class ColorField(models.CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 10
        super(ColorField, self).__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        kwargs['widget'] = ColorPickerWidget
        return super(ColorField, self).formfield(**kwargs)


class CroppedImageField(models.CharField):
    def __init__(self,
                 image, ratio, min_size=[0, 0], max_size=[0, 0],
                 set_select=[[0, 0], [0, 0]], *args, **kwargs):
        kwargs['max_length'] = 30
        self.ratio = ratio
        self.min_size = min_size
        self.max_size = max_size
        self.set_select = set_select
        self.image_field_name = image
        super(CroppedImageField, self).__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        kwargs['widget'] = CroppedImageWidget(self, attrs={
                'data-target': self.image_field_name
                })
        return super(CroppedImageField, self).formfield(**kwargs)

    def clean(self, value, model_instance):
        if not re.match(r'^\d+x\d+ \d+x\d+$', value):
            raise forms.ValidationError('Invalid coordinates: %s' % value)
        value = super(CroppedImageField, self).clean(value, model_instance)
        pic_ratio_l = self.ratio.split('x')
        min_size = self.min_size
        max_size = self.max_size

        data = value.split(' ')
        x, y = data[0].split('x')
        w, h = data[1].split('x')

        avatar_ratio = round(int(w) / int(h), 2)
        pic_ratio = round(int(pic_ratio_l[0]) / int(pic_ratio_l[1]), 2)
        ratio = abs(pic_ratio - avatar_ratio)

        image = getattr(model_instance, self.image_field_name);

        if (w < min_size[0] and min_size[0] != 0) \
                or (w > max_size[0] and max_size[0] != 0) \
                or (h < min_size[1] and min_size[1] != 0) \
                or (h > max_size[1] and max_size[1] != 0) \
                or ratio > 0.01 \
                or int(x) + int(w) > image.width \
                or int(y) + int(h) > image.height:
            raise forms.ValidationError(_("Invalid coordinates."))
        return value
