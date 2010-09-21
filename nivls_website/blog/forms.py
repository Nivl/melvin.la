# -*- coding: utf-8 -*-

from django             import forms
from nivls_website.libs import happyforms


class ContactForm(happyforms.Form):
    subject   = forms.CharField(max_length=100)
    email     = forms.EmailField()
    message   = forms.CharField(widget=forms.Textarea)
    honeypot  = forms.CharField(required=False,
                                help_text="This field must be empty.",
                                label="captcha")

    def clean_honeypot(self):
        value = self.cleaned_data['honeypot']
        if value:
            raise forms.ValidationError("Spam attempt detected !")
        return value


class CommentForm(happyforms.Form):
    user_name        = forms.CharField(label="Name", max_length=25)
    user_email       = forms.EmailField(label="E-mail")
    user_website     = forms.URLField(label="Website", required=False)
    content          = forms.CharField(label="Comment", widget=forms.Textarea)
    remember_me      = forms.BooleanField(required=False)
    honeypot         = forms.CharField(required=False,
                                       help_text="This field must be empty.",
                                       label="captcha")

    def __init__(self, request, *args, **kwargs):
        super(CommentForm, self).__init__(*args, **kwargs)
        self.fields['user_name'].initial = request.COOKIES.get("name", "")
        self.fields['user_email'].initial = request.COOKIES.get("email", "")
        self.fields['user_website'].initial = request.COOKIES.get("website","")


    def remember(self, response):
        if self.cleaned_data['remember_me'] == True:
            one_year = 60*60*24*365
            response.set_cookie('name',
                                self.cleaned_data['user_name'],
                                max_age=one_year)
            response.set_cookie('email',
                                self.cleaned_data['user_email'],
                                max_age=one_year)
            response.set_cookie('website',
                                self.cleaned_data['user_website'],
                                max_age=one_year)


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
