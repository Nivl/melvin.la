from django import template

register = template.Library()


@register.inclusion_tag("about/templatetags/display_cat.haml")
def display_cat(cats, is_downloadable):
    return {'cats': cats,
            'is_downloadable': is_downloadable}


@register.inclusion_tag("about/templatetags/cat_as_list.haml")
def cat_as_list(cat, is_downloadable):
    return {'cat': cat,
            'is_downloadable': is_downloadable}


@register.inclusion_tag("about/templatetags/cat_as_description_list.haml")
def cat_as_description_list(cat, is_downloadable):
    return {'cat': cat,
            'is_downloadable': is_downloadable}


@register.inclusion_tag("about/templatetags/cat_as_block.haml")
def cat_as_block(cat, is_downloadable):
    return {'cat': cat,
            'is_downloadable': is_downloadable}
