from django import forms
from commons import happyforms
from models import Comment
from commons.protection import akismet_is_valid


class CommentForm(happyforms.ModelForm):
    class Meta:
        model = Comment
        fields = ('name', 'email', 'website', 'comment')

    honeypot = forms.CharField(
        required=False,
        label=' ',
        widget=forms.TextInput(attrs={'class': 'hidden'}))

    def __init__(self, storage_key='comment-content',
                 data=None, files=None, user=None, request=None,
                 *args, **kwargs):
        if request is None:
            raise TypeError("Keyword argument 'request' must be supplied")
        super(CommentForm, self).__init__(data=data, files=files,
                                          *args, **kwargs)
        self.fields['comment'].widget.attrs['data-parse'] = '#form-preview'
        self.fields['comment'].widget.attrs['data-storage'] = storage_key
        if user.is_authenticated():
            del self.fields['email']
            del self.fields['name']
            del self.fields['website']
        else:
            self.fields['email'].required = True
            self.fields['name'].required = True
        self.request = request

    def clean_honeypot(self):
        value = self.cleaned_data['honeypot']
        if value:
            raise forms.ValidationError('Spam attempt detected!')
        return value

    def clean(self):
        cleaned_data = self.cleaned_data
        akismet_status = False

        if self.request.user.is_authenticated():
            akismet_status = akismet_is_valid(self.request,
                                              cleaned_data.get('comment'))
        elif cleaned_data.get('email') and cleaned_data.get('comment'):
                akismet_status = akismet_is_valid(self.request,
                                                  cleaned_data.get('comment'),
                                                  cleaned_data.get('email'),
                                                  cleaned_data.get('website'))

        if not akismet_status:
            self._errors['comment'] = forms.ValidationError('Spam attempt detected!')
            del cleaned_data['comment']

        return cleaned_data
