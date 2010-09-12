# -*- coding: utf-8 -*-

from django import forms
from nivls_website.libs import happyforms 


class ContactForm(happyforms.Form):
    subject   = forms.CharField(max_length=100)
    email     = forms.EmailField()
    message   = forms.CharField(widget=forms.Textarea)