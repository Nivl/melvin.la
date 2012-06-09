from django.http import HttpResponseNotAllowed
from functools import wraps


def ajax_only():
    def decorator(func):
        def inner_decorator(request, *arg, **kwarg):
            if not request.is_ajax():
                return HttpResponseNotAllowed("Ajax requests only")
            return func(request, *arg, **kwarg)
        return wraps(func)(inner_decorator)
    return decorator
