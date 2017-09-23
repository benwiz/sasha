"""
Core views.

The core application is for communication with external services and should do
no more than calcuate differences between the current and desired states.

Probably should not use this application for any front-end work.
"""

import json
from multiprocessing import Process

from django.shortcuts import render, HttpResponse


def status(request):
    """
    Status. Health.
    """

    response = {
        'message': 'Sasha is alive.'
    }
    response = json.dumps(response)
    return HttpResponse(response, content_type='application/json', status=200)
