from django import template

register = template.Library()


@register.inclusion_tag("resumes/templatetags/display_cat.haml", takes_context=True)
def display_cat(context, cats, is_downloadable):
    data = {'cats': cats,
            'is_downloadable': is_downloadable}
    return template.RequestContext(context['request'], data)


@register.inclusion_tag("resumes/templatetags/cat_as_list.haml", takes_context=True)
def cat_as_list(context, cat, is_downloadable):
    data = {'cat': cat,
            'is_downloadable': is_downloadable}
    return template.RequestContext(context['request'], data)


@register.inclusion_tag("resumes/templatetags/cat_as_description_list.haml", takes_context=True)
def cat_as_description_list(context, cat, is_downloadable):
    data = {'cat': cat,
            'is_downloadable': is_downloadable}
    return template.RequestContext(context['request'], data)


@register.inclusion_tag("resumes/templatetags/cat_as_block.haml", takes_context=True)
def cat_as_block(context, cat, is_downloadable):
    data = {'cat': cat,
            'is_downloadable': is_downloadable}
    return template.RequestContext(context['request'], data)
