

def get_extra_data(backend, details, response, social_user, uid,
                   user, *args, **kwargs):
    username = backend.get_user_details(response)['username']
    social_user.extra_data["username"] = username
    social_user.save()
