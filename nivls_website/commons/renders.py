from django.conf import settings
import markdown
import re


def markdown_to_html(markdownText, images):
    md = markdown.Markdown()

    for image in images:
        md.references[image.name] = (image.image.url, ' ')

    return re.sub(">\{\{([0-9]+)x([0-9]+)}}",
                  ' width="\\1" heigth="\\2">',
                  md.convert(markdownText))
