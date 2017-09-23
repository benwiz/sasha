"""
Core views.

As views start to collect, they should be broken into smaller applications.
"""

import json
from multiprocessing import Process

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
