from commons.forms import SingleCharFieldForm, SingleTextareaForm
from commons.views import ajax_get_form, ajax_get_single_data
from resume.models import Category, Content


#
# Ajax
#
def get_single_form(request, model, path_name, pk, perm,
                    template_name='ajax/single_field_form.haml', **kwargs):

    path_name = 'resume-' + path_name
    return ajax_get_form(request, model, path_name, pk=pk, perm=perm,
                         template_name=template_name, **kwargs)


# Category
def get_category_name(request, pk):
    return ajax_get_single_data(request, pk, Category, 'name',
                                template_name='ajax/single_field_value.haml')


def get_category_name_form(request, pk):
    args = {'attr_name': 'name',
            'form_obj': SingleCharFieldForm,
            }

    return get_single_form(request, Category, 'category-name', pk=pk,
                            perm='resume.change_category', **args)


# Content key
def get_content_key(request, pk):
    return ajax_get_single_data(request, pk, Content, 'key',
                                template_name='ajax/single_field_value_md.haml')


def get_content_key_form(request, pk):
    args = {'attr_name': 'key',
            'form_obj': SingleCharFieldForm,
            }

    return get_single_form(request, Content, 'content-key', pk=pk,
                           perm='resume.change_content',
                           template_name='ajax/single_field_form_inline.haml',
                           **args)


# Content value
def get_content_value(request, pk):
    return ajax_get_single_data(request, pk, Content, 'value',
                                template_name='ajax/single_field_value_md.haml')


def get_content_value_form(request, pk):
    args = {'attr_name': 'value',
            'form_obj': SingleTextareaForm,
            }

    return get_single_form(request, Content, 'content-value', pk=pk,
                           perm='resume.change_content', **args)
