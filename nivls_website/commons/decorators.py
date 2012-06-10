from django.http import HttpResponseNotAllowed, HttpResponseRedirect
from django.core.urlresolvers import reverse
from functools import wraps


def ajax_only():
    def decorator(func):
        def inner_decorator(request, *arg, **kwarg):
            if not request.is_ajax():
                return HttpResponseNotAllowed("Ajax requests only")
            return func(request, *arg, **kwarg)
        return wraps(func)(inner_decorator)
    return decorator


def login_forbidden(view='home'):
    def decorator(func):
        def inner_decorator(request, *arg, **kwarg):
            if request.user.is_authenticated():
                return HttpResponseRedirect(reverse(view))
            return func(request, *arg, **kwarg)
        return wraps(func)(inner_decorator)
    return decorator
