from django.db import models
from django import forms
from nivlsblog.libs import happyforms

class ContactForm(happyforms.Form):
    subject   = forms.CharField(max_length=100)
    email     = forms.EmailField()
    message   = forms.CharField(widget=forms.Textarea)
