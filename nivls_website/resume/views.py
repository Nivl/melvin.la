from commons.forms import *
from commons.views import *
from models import *


#
# Ajax
#
def get_single_form(request, pk, Obj, path_name, perm, template_name='ajax/single_field_form.haml', **kwargs):
    return ajax_get_single_form(request, pk, Obj, 'resume', path_name, perm, template_name, **kwargs)


# Category
def get_category_name(request, pk):
    return ajax_get_single_data(request, pk, Category, 'name', template_name='ajax/single_field_value.haml')


def get_category_name_form(request, pk):
    args = {'attr_name': 'name',
            'form_obj': SingleCharFieldForm,
            }

    return get_single_form(request, pk, Category, 'category-name', 'resume.change_category', **args)


# Content key
def get_content_key(request, pk):
    return ajax_get_single_data(request, pk, Content, 'key', template_name='ajax/single_field_value_md.haml')


def get_content_key_form(request, pk):
    args = {'attr_name': 'key',
            'form_obj': SingleCharFieldForm,
            }

    return get_single_form(request, pk, Content, 'content-key', 'resume.change_content', template_name='ajax/single_field_form_inline.haml', **args)


# Content value
def get_content_value(request, pk):
    return ajax_get_single_data(request, pk, Content, 'value', template_name='ajax/single_field_value_md.haml')


def get_content_value_form(request, pk):
    args = {'attr_name': 'value',
            'form_obj': SingleTextareaForm,
            }

    return get_single_form(request, pk, Content, 'content-value', 'resume.change_content', **args)
