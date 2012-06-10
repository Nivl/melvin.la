from django.http import HttpResponseNotAllowed, HttpResponseRedirect
from django.core.urlresolvers import reverse
from functools import wraps, update_wrapper


def ajax_only(func):
    def inner_decorator(request, *arg, **kwarg):
        if not request.is_ajax():
            return HttpResponseNotAllowed("Ajax requests only")
        return func(request, *arg, **kwarg)
    return wraps(func)(inner_decorator)


def login_forbidden(*func, **kwargs):
    view = kwargs.pop('view', 'home')
    if kwargs:
        raise TypeError('Unsuported keyword arguments: %s' %
                        ','.join(kwargs.keys()))

    def wrapper(request, *arg, **kwarg):
        if request.user.is_authenticated():
            return HttpResponseRedirect(reverse(view))

    if func:
        return update_wrapper(wrapper, func[0])
    else:
        def decorator(func):
            return update_wrapper(wrapper, func)
        return decorator
