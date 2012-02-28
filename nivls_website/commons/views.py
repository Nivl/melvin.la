# -*- coding: utf-8 -*-
import subprocess
from django.http import HttpResponse
from django.template.loader import get_template
from django.template import Context

def write_pdf(template_src, context_dict, output):
    template = get_template(template_src)
    context = Context(context_dict)
    rendered = template.render(context)

    temp_html_file_name = '/tmp/nivl_temp_template.html'
    file = open(temp_html_file_name, 'w')
    file.write(rendered.encode('utf-8'))
    file.close()

    command_args = '/usr/bin/wkhtmltopdf --page-size Letter ' + \
        temp_html_file_name + ' -'

    popen = subprocess.Popen(command_args,
                             stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE,
                             shell=True)
    pdf_contents = popen.communicate()[0]

    response = HttpResponse(pdf_contents, mimetype='application/pdf')
    response['Content-Disposition'] = 'filename=' + output
    return response
