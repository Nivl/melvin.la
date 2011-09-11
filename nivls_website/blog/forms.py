from django import forms
from commons import happyforms
from commons.protection import akismet_is_valid

class ContactForm(forms.Form):
    subject     = forms.CharField(max_length=100)
    email       = forms.EmailField()
    message     = forms.CharField(widget=forms.Textarea)
    honeypot    = forms.CharField(required=False)

    def __init__(self, data=None, files=None, request=None, *args, **kwargs):
        if request is None:
            raise TypeError("Keyword argument 'request' must be supplied")
        super(ContactForm, self).__init__(data=data, files=files,
                                          *args, **kwargs)
        self.request = request

    def clean_honeypot(self):
        value = self.cleaned_data['honeypot']
        if value:
            raise forms.ValidationError('Spam attempt detected!')
        return value

    def clean_message(self):
        if akismet_is_valid(self.request, self.cleaned_data['message']):
            return self.cleaned_data['message']
        else:
            raise forms.ValidationError('Spam attempt detected!')
