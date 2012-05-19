from social_auth.backends import USERNAME

def get_extra_data(backend, details, response, social_user, uid, user, *args
                   , **kwargs):
    social_user.extra_data["username"] = backend.get_user_details(response)[USERNAME]
    social_user.save()
