"""
Core views.

As views start to collect, they should be broken into smaller apps.
"""

import json
from multiprocessing import Process

from . import fb

from celery import Celery
from celery.schedules import crontab

from django.shortcuts import render, HttpResponse


def index(request):
    """
    Health.
    """

    response = {
        'message': 'Sasha is alive.'
    }
    response = json.dumps(response)
    return HttpResponse(response, content_type='application/json', status=200)

# Start listeneing to Facebook threads in another process. If I start adding
# more and more services I should figure out a better way to run parallel
# processes in Django or consider separating out these jobs into another Docker
# container.
p = Process(target=fb.listen)
p.start()
