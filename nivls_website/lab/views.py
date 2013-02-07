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
    return render(request, "lab/listing.haml",
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
    return render(request, "lab/project.haml", {'project': p})


#
# Ajax
#


# Description
@require_safe
def get_project_small(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "ajax/single_field_value_md.haml", {'value': p.description})


@ajax_only
def get_project_small_form(request, slug):
    project = get_object_or_404(Project,
      slug=slug,
      site=Site.objects.get_current())

    if not request.user.has_perm('lab.change_project'):
        return HttpResponseForbidden()

    render_args = {'template_name': "ajax/single_field_form.haml",
                   'dictionary': {'id': 'lab-project-description-form-' + slug,
                                  'url': reverse('lab-get-project-descr-form', args=[slug])
                                  }
                    }

    return validate_single_ajax_form(request, project, 'description', render_args, SingleTextareaForm)


# Name
@require_safe
def get_project_name(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "ajax/single_field_value.haml", {'value': p.name})


@ajax_only
def get_project_name_form(request, slug):
    project = get_object_or_404(Project,
      slug=slug,
      site=Site.objects.get_current())

    if not request.user.has_perm('lab.change_project'):
        return HttpResponseForbidden()

    render_args = {'template_name': "ajax/single_field_form_inline.haml",
                   'dictionary': {'id': 'lab-project-name-form-' + slug,
                                  'url': reverse('lab-get-project-name-form', args=[slug])
                                  }
                    }

    return validate_single_ajax_form(request, project, 'name', render_args, SingleCharFieldForm)


# Catchphrase
@require_safe
def get_project_catchphrase(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "ajax/single_field_value.haml", {'value': p.catchphrase})


@ajax_only
def get_project_catchphrase_form(request, slug):
    project = get_object_or_404(Project,
      slug=slug,
      site=Site.objects.get_current())

    if not request.user.has_perm('lab.change_project'):
        return HttpResponseForbidden()

    render_args = {'template_name': "ajax/single_field_form_inline.haml",
                   'dictionary': {'id': 'lab-project-catchphrase-form-' + slug,
                                  'url': reverse('lab-get-project-catchphrase-form', args=[slug])
                                  }
                    }

    return validate_single_ajax_form(request, project, 'catchphrase', render_args, SingleCharFieldForm)


# License
@require_safe
def get_project_license(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "ajax/single_field_link_value.haml", {'value': p.license.name, 'value_url': p.license.url})


@ajax_only
def get_project_license_form(request, slug):
    project = get_object_or_404(Project,
      slug=slug,
      site=Site.objects.get_current())

    licenses = License.objects.filter(site=Site.objects.get_current()) \
                              .values_list('pk', 'name')

    if not request.user.has_perm('lab.change_project'):
        return HttpResponseForbidden()

    render_args = {'template_name': "ajax/single_field_form_inline.haml",
                   'dictionary': {'id': 'lab-project-license-form-' + slug,
                                  'url': reverse('lab-get-project-license-form', args=[slug])
                                  }
                    }

    return validate_single_ajax_form(request, project, 'license', render_args, SingleChoiceFieldForm, {'choices': licenses}, ('License', 'pk'))


# real Clients
@require_safe
def get_project_realclients(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "lab/ajax/business_card.haml", {'items': p.clients_user.all(), 'is_user': True})


@ajax_only
def get_project_realclients_form(request, slug):
    project = get_object_or_404(Project,
      slug=slug,
      site=Site.objects.get_current())

    if not request.user.has_perm('lab.change_project'):
        return HttpResponseForbidden()

    render_args = {'template_name': "ajax/single_field_form.haml",
                   'dictionary': {'id': 'lab-project-realclients-form-' + slug,
                                  'url': reverse('lab-get-project-realclients-form', args=[slug])
                                  }
                    }

    form_args = {'queryset': User.objects.all()}

    return validate_single_ajax_form(request, project, 'clients_user', render_args, SingleMultipleChoiceFieldForm, form_args, has_many=True)


# Client
@require_safe
def get_project_clients(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "lab/ajax/business_card.haml", {'items': p.clients.all(), 'is_user': False})


@ajax_only
def get_project_clients_form(request, slug):
    project = get_object_or_404(Project,
      slug=slug,
      site=Site.objects.get_current())

    if not request.user.has_perm('lab.change_project'):
        return HttpResponseForbidden()

    render_args = {'template_name': "ajax/single_field_form.haml",
                   'dictionary': {'id': 'lab-project-clients-form-' + slug,
                                  'url': reverse('lab-get-project-clients-form', args=[slug])
                                  }
                    }

    form_args = {'queryset': Client.objects.filter(site=Site.objects.get_current())}

    return validate_single_ajax_form(request, project, 'clients', render_args, SingleMultipleChoiceFieldForm, form_args, has_many=True)


# real Coworker
@require_safe
def get_project_realcoworkers(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "lab/ajax/business_card.haml", {'items': p.coworkers_user.all(), 'is_user': True})


@ajax_only
def get_project_realcoworkers_form(request, slug):
    project = get_object_or_404(Project,
      slug=slug,
      site=Site.objects.get_current())

    if not request.user.has_perm('lab.change_project'):
        return HttpResponseForbidden()

    render_args = {'template_name': "ajax/single_field_form.haml",
                   'dictionary': {'id': 'lab-project-realcoworkers-form-' + slug,
                                  'url': reverse('lab-get-project-realcoworkers-form', args=[slug])
                                  }
                    }

    form_args = {'queryset': User.objects.all()}

    return validate_single_ajax_form(request, project, 'coworkers_user', render_args, SingleMultipleChoiceFieldForm, form_args, has_many=True)


# Coworker
@require_safe
def get_project_coworkers(request, slug):
    p = get_object_or_404(Project, slug=slug, site=settings.SITE_ID)
    return render(request, "lab/ajax/business_card.haml", {'items': p.coworkers.all(), 'is_user': False})


@ajax_only
def get_project_coworkers_form(request, slug):
    project = get_object_or_404(Project,
      slug=slug,
      site=Site.objects.get_current())

    if not request.user.has_perm('lab.change_project'):
        return HttpResponseForbidden()

    render_args = {'template_name': "ajax/single_field_form.haml",
                   'dictionary': {'id': 'lab-project-coworkers-form-' + slug,
                                  'url': reverse('lab-get-project-coworkers-form', args=[slug])
                                  }
                    }

    form_args = {'queryset': Coworker.objects.filter(site=Site.objects.get_current())}

    return validate_single_ajax_form(request, project, 'coworkers', render_args, SingleMultipleChoiceFieldForm, form_args, has_many=True)
