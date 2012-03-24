from django.contrib.auth.forms import AuthenticationForm
from bootstrap.forms import BootstrapForm

class BootstrapLoginForm(AuthenticationForm, BootstrapForm):
    pass;
