from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.views.decorators.http import require_safe
from django.contrib.sites.models import Site
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from commons.decorators import ajax_only
from commons.paginator import simple_paginator
from commons.forms import *
from commons.views import validate_single_ajax_form
from models import *
from forms import *


@require_safe
def home(request):
    project_list = Project.objects.filter(site=settings.SITE_ID)
    projects = simple_paginator(project_list, 5, request.GET.get('page'))
    return render(request, 'lab/listing.haml',
                  {'projects': projects,
                   'menu_name': 'home'})


@require_safe
def tag(request, slug):
    tag = get_object_or_404(Tag, slug=slug, site=Site.objects.get_current())
    project_list = Project.objects.filter(tags=tag)
    projects = simple_paginator(project_list, 5, request.GET.get('page'))
    return render(request, "lab/listing.haml", {'projects': projects,
                                                'tag': tag,
                                                'menu_name': tag.slug})


@require_safe
def project(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, 'lab/project.haml', {'project': p})


#
# Ajax
#

@require_safe
@ajax_only
def get_single_data(request, slug, field, template_name='ajax/single_field_value.haml'):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, template_name, {'value': getattr(p, field)})


@ajax_only
def get_single_form(request, slug, path_name='', template_name='ajax/single_field_form.haml', **kwargs):
    project = get_object_or_404(Project,
      slug=slug,
      site=Site.objects.get_current())

    if len(path_name) == 0:
        path_name = kwargs['attr_name']

    kwargs['render_args'] = {
    'template_name': template_name,
    'dictionary': {'id': 'lab-project-%s-form-%s' % (path_name, slug),
                   'url': reverse('lab-get-project-%s-form' % path_name, args=[slug])
                   }
    }

    if not request.user.has_perm('lab.change_project'):
        return HttpResponseForbidden()

    return validate_single_ajax_form(request, project, **kwargs)


# Description
def get_project_description(request, slug):
    return get_single_data(request, slug, 'description', template_name='ajax/single_field_value_md.haml')


@ajax_only
def get_project_description_form(request, slug):
    args = {'attr_name': 'description',
            'form_obj': SingleTextareaForm,
            }

    return get_single_form(request, slug, **args)


# Name
def get_project_name(request, slug):
    return get_single_data(request, slug, 'name')


def get_project_name_form(request, slug):
    args = {'attr_name': 'name',
            'form_obj': SingleCharFieldForm
            }

    return get_single_form(request, slug, template_name='ajax/single_field_form_inline.haml', **args)


# Catchphrase
def get_project_catchphrase(request, slug):
    return get_single_data(request, slug, 'catchphrase')


def get_project_catchphrase_form(request, slug):
    args = {'attr_name': 'catchphrase',
            'form_obj': SingleCharFieldForm
            }

    return get_single_form(request, slug, template_name='ajax/single_field_form_inline.haml', **args)


# License
@require_safe
@ajax_only
def get_project_license(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "ajax/single_field_link_value.haml",
                 {'value': p.license.name, 'value_url': p.license.url})


def get_project_license_form(request, slug):
    licenses = License.objects.filter(site=Site.objects.get_current()) \
                              .values_list('pk', 'name')
    args = {'attr_name': 'license',
            'form_obj': SingleChoiceFieldForm,
            'form_args': {'choices': licenses},
            'inital_fix': ('License', 'pk'),
            }

    return get_single_form(request, slug, template_name='ajax/single_field_form_inline.haml', **args)


# real Clients
@require_safe
def get_project_realclients(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "lab/ajax/business_card.haml", {'items': p.clients_user.all(),
                                                           'is_user': True})


def get_project_realclients_form(request, slug):
    args = {'attr_name': 'clients_user',
            'form_obj': SingleMultipleChoiceFieldForm,
            'form_args': {'queryset': User.objects.all()},
            'has_many': True,
            }

    return get_single_form(request, slug, path_name='realclients', **args)


# Client
@require_safe
def get_project_clients(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "lab/ajax/business_card.haml", {'items': p.clients.all(),
                                                           'is_user': False})


def get_project_clients_form(request, slug):
    queryset = Client.objects.filter(site=Site.objects.get_current())
    args = {'attr_name': 'clients',
            'form_obj': SingleMultipleChoiceFieldForm,
            'form_args': {'queryset': queryset},
            'has_many': True,
            }

    return get_single_form(request, slug, **args)


# real Coworker
@require_safe
def get_project_realcoworkers(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "lab/ajax/business_card.haml", {'items': p.coworkers_user.all(),
                                                           'is_user': True})


def get_project_realcoworkers_form(request, slug):
    args = {'attr_name': 'coworkers_user',
            'form_obj': SingleMultipleChoiceFieldForm,
            'form_args': {'queryset': User.objects.all()},
            'has_many': True,
            }

    return get_single_form(request, slug, path_name='realcoworkers', **args)


# Coworker
@require_safe
def get_project_coworkers(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "lab/ajax/business_card.haml", {'items': p.coworkers.all(),
                                                           'is_user': False})


def get_project_coworkers_form(request, slug):
    args = {'attr_name': 'coworkers',
            'form_obj': SingleMultipleChoiceFieldForm,
            'form_args': {'queryset': Coworker.objects.filter(site=Site.objects.get_current())},
            'has_many': True,
            }

    return get_single_form(request, slug, **args)
