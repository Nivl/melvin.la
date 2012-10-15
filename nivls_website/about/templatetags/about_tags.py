from django import template

register = template.Library()


@register.inclusion_tag("about/templatetags/display_cat.html")
def display_cat(cats, is_downloadable):
    return {'cats': cats,
            'is_downloadable': is_downloadable}


@register.inclusion_tag("about/templatetags/cat_as_list.html")
def cat_as_list(cat, is_downloadable):
    return {'cat': cat,
            'is_downloadable': is_downloadable}


@register.inclusion_tag("about/templatetags/cat_as_description_list.html")
def cat_as_description_list(cat, is_downloadable):
    return {'cat': cat,
            'is_downloadable': is_downloadable}


@register.inclusion_tag("about/templatetags/cat_as_block.html")
def cat_as_block(cat, is_downloadable):
    return {'cat': cat,
            'is_downloadable': is_downloadable}
