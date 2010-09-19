# -*- coding: utf-8 -*-

from django import forms
from nivls_website.libs import happyforms


class ContactForm(happyforms.Form):
    subject   = forms.CharField(max_length=100)
    email     = forms.EmailField()
    message   = forms.CharField(widget=forms.Textarea)


class CommentForm(happyforms.Form):
    user_name        = forms.CharField(label="Name", max_length=25)
    user_email       = forms.EmailField(label="E-mail")
    user_website     = forms.URLField(label="Website", required=False)
    content          = forms.CharField(label="Comment", widget=forms.Textarea)
    honeypot         = forms.CharField(required=False,
                                       help_text="This field must be empty.",
                                       label="captcha")
    def clean_honeypot(self):
        value = self.cleaned_data['honeypot']
        if value:
            raise forms.ValidationError("Spam attempt detected !")
        return value

    def get_cleaned_data(self):
        return dict(user_name     = self.cleaned_data['user_name'],
                    user_email    = self.cleaned_data['user_email'],
                    user_website  = self.cleaned_data['user_website'],
                    content       = self.cleaned_data['content'])
