from django.http import HttpResponseNotAllowed
from django.template import RequestContext, loader, TemplateDoesNotExist


class Http405Middleware(object):
    def process_response(self, request, response):
        if isinstance(response, HttpResponseNotAllowed):
            context = RequestContext(request)
            try:
                response.content = loader.render_to_string(
                    "405.html",
                    context_instance=context)
            except TemplateDoesNotExist:
                pass
        return response
