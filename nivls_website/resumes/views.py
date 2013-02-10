from django.shortcuts import render, get_object_or_404
from django.core.urlresolvers import reverse
from django.views.decorators.http import require_safe
from django.http import HttpResponseForbidden
from commons.decorators import ajax_only
from commons.forms import *
from commons.views import validate_single_ajax_form
from models import *

#
# Ajax
#


@require_safe
@ajax_only
def get_single_data(request, pk, Obj, field, template_name='ajax/single_field_value.haml'):
    obj = get_object_or_404(Obj, pk=pk)
    return render(request, template_name, {'value': getattr(obj, field)})


@ajax_only
def get_single_form(request, pk, Obj, path_name, perm, template_name='ajax/single_field_form.haml', **kwargs):
    obj = get_object_or_404(Obj, pk=pk)

    kwargs['render_args'] = {
    'template_name': template_name,
    'dictionary': {'id': 'resume-%s-form-%s' % (path_name, pk),
                   'url': reverse('resume-get-%s-form' % path_name, args=[pk])
                   }
    }

    if not request.user.has_perm(perm):
        return HttpResponseForbidden()

    return validate_single_ajax_form(request, obj, **kwargs)


# Category
def get_category(request, pk):
    return get_single_data(request, pk, Category, 'name', template_name='ajax/single_field_value.haml')


@ajax_only
def get_category_form(request, pk):
    args = {'attr_name': 'name',
            'form_obj': SingleCharFieldForm,
            }

    return get_single_form(request, pk, Category, 'category', 'resumes.change_category', **args)


# Content key
def get_content_key(request, pk):
    return get_single_data(request, pk, Content, 'key', template_name='ajax/single_field_value_md.haml')


@ajax_only
def get_content_key_form(request, pk):
    args = {'attr_name': 'key',
            'form_obj': SingleCharFieldForm,
            }

    return get_single_form(request, pk, Content, 'content-key', 'resumes.change_content', template_name='ajax/single_field_form_inline.haml', **args)


# Content value
def get_content_value(request, pk):
    return get_single_data(request, pk, Content, 'value', template_name='ajax/single_field_value_md.haml')


@ajax_only
def get_content_value_form(request, pk):
    args = {'attr_name': 'value',
            'form_obj': SingleTextareaForm,
            }

    return get_single_form(request, pk, Content, 'content-value', 'resumes.change_content', **args)
