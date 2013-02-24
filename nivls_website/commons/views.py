# -*- coding: utf-8 -*-

import sys
import subprocess
from django.http import HttpResponse
from django.template.loader import get_template
from django.template import Context
from django.views.generic.base import TemplateView
from django.contrib.sites.models import Site
from django.core.urlresolvers import reverse
from django.conf import settings
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_safe
from commons.decorators import ajax_only
# Needed to deal with manyToMany with getattr on sys.modules[__name__]
from lab.models import License
from blog.models import Category


class TexplainView(TemplateView):
    def get_context_data(self, **kwargs):
        context = super(TexplainView, self).get_context_data(**kwargs)
        context['site'] = Site.objects.get_current()
        return context

    def render_to_response(self, context, **kwargs):
        return super(TexplainView, self).render_to_response(
            context,
            content_type='text/plain',
            **kwargs)


def write_pdf(template_src, context_dict, output):
    template = get_template(template_src)
    context = Context(context_dict)
    rendered = template.render(context)

    temp_html_file_name = '/tmp/nivl_temp_template.html'
    file = open(temp_html_file_name, 'w')
    file.write(rendered.encode('utf-8'))
    file.close()

    command_args = '%s --page-size Letter --disable-javascript %s -' % (
        settings.WKHTMLTOPDF_PATH,
        temp_html_file_name)

    popen = subprocess.Popen(command_args,
                             stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE,
                             shell=True)
    pdf_contents = popen.communicate()[0]

    response = HttpResponse(pdf_contents, mimetype='application/pdf')
    response['Content-Disposition'] = 'filename=' + output
    return response


#
# Ajax
#

def validate_model_ajax_form(request, obj, render_args, form_obj):
    """
    obj : Object to update
    render_arg : render() arguments
    form_obj : form object needed to validate/render the form
    """

    if request.method == 'POST':
        form = form_obj(request.POST, instance=obj)
        if form.is_valid():
            form.save()
            return HttpResponse()
    else:
        form = form_obj(instance=obj)

    render_args['dictionary']['form'] = form
    return render(request, **render_args)


def validate_single_ajax_form(request, obj, attr_name, render_args, form_obj, form_args={}, inital_fix=(), has_many=False):
    """
    obj : Object to update
    attr_name : attribute of $obj to update
    render_arg : render() arguments
    form_obj : form object needed to validate/render the form
    form_args : Arguments to give to the form object
    initial_fix : (Object, attr) used when the new value to store is a foreign key.
    """

    if request.method == 'POST':
        form = form_obj(request.POST, **form_args)
        if form.is_valid():
            if len(inital_fix) > 0:
                intermediate_obj = getattr(sys.modules[__name__], inital_fix[0])
                new_value = intermediate_obj.objects.get(pk=form.cleaned_data['single'])
            else:
                new_value = form.cleaned_data['single']
            setattr(obj, attr_name, new_value)
            obj.save()
            return HttpResponse()
    else:
        initial_value = getattr(obj, attr_name)
        if len(inital_fix) > 0:
            initial_value = getattr(initial_value, inital_fix[1])
        if (has_many):
            initial_value = initial_value.values_list('pk', flat=True)
        form = form_obj(initial={'single': initial_value}, **form_args)

    render_args['dictionary']['form'] = form
    return render(request, **render_args)


@ajax_only
def ajax_get_form(request, pk, Obj, app_name, path_name, perm, template_name='ajax/single_field_form.haml', is_single=True, **kwargs):
    if not request.user.has_perm(perm):
        return HttpResponseForbidden()

    obj = get_object_or_404(Obj, pk=pk)

    kwargs['render_args'] = {
    'template_name': template_name,
    'dictionary': {'id': '%s-%s-form-%s' % (app_name, path_name, pk),
                   'url': reverse('%s-get-%s-form' % (app_name, path_name), args=[pk])
                   }
    }

    if is_single:
        return validate_single_ajax_form(request, obj, **kwargs)
    else:
        return validate_model_ajax_form(request, obj, **kwargs)


@require_safe
@ajax_only
def ajax_get_single_data(request, pk, Obj, field, template_name='ajax/single_field_value.haml'):
    obj = get_object_or_404(Obj, pk=pk)
    return render(request, template_name, {'value': getattr(obj, field)})


@require_safe
@ajax_only
def ajax_get_model_data(request, pk, Obj, template_name):
    obj = get_object_or_404(Obj, pk=pk)
    return render(request, template_name, {'object': obj})
