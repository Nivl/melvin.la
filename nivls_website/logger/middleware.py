from django.middleware.common import _is_ignorable_404
from models import Logger404


class LoggerMiddleware():
    def process_response(self, request, response):
        if response.status_code == 404 and \
                not _is_ignorable_404(request.get_full_path()):
            l, _ = Logger404.objects.get_or_create(
                url=request.build_absolute_uri(),
                defaults={
                    'host': request.META.get('HTTP_HOST', ''),
                    'referer': request.META.get('HTTP_REFERER', ''),
                    'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                    'remote_addr': request.META.get('REMOTE_ADDR', ''),
                    'remote_host': request.META.get('REMOTE_HOST', ''),
                    'method': request.META.get('REQUEST_METHOD', '')
                    })
            l.hit = l.hit + 1
            l.save()
        return response
