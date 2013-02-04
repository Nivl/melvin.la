from django import forms
from django.utils.translation import ugettext_lazy as _
from commons import happyforms


class SmallProjectForm(happyforms.Form):
    description = forms.CharField(
        widget=forms.Textarea(attrs={'style': 'width: 100%;'}),
        label=_(' '))
