from registration.backends.default import DefaultBackend

class CustomBackend(DefaultBackend):
    def register(self, request, **kwargs):
        user = super(CustomBackend, self).register(request, **kwargs)
        user.first_name = kwargs['first_name']
        user.last_name = kwargs['last_name']
        user.save()
        return user

    def activate(self, request, activation_key):
        return super(CustomBackend, self).activate(request, activation_key)

    def registration_allowed(self, request):
        return super(CustomBackend, self).registration_allowed(request)

    def post_registration_redirect(self, request, user):
        return super(CustomBackend, self).post_registration_redirect(request, user)

    def post_activation_redirect(self, request, user):
        return super(CustomBackend, self).post_activation_redirect(request, user)
