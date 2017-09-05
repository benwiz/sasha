"""
Core views.

As views start to collect, they should be broken into smaller apps.
"""

import json
from multiprocessing import Process

from . import fb

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


p = Process(target=fb.listen)
p.start()
