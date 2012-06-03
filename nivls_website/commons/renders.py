from django.conf import settings
import re


def image_name_to_link(text, images):
    for image in images:
        text = text.replace("{{" + image.name + "}}",
                            image.image.url)
    return text
