#!/usr/bin/env python2
import os, sys
from django.core.management import execute_manager

sys.path.append("/home/www/modules/")

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nivls_website.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
