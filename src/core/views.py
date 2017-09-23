"""
Core views.

The core application is for communication with external services and should do
no more than calcuate differences between the current and desired states.

Probably should not use this application for any front-end work.
"""

import json
from multiprocessing import Process
from pprint import pprint

from django.shortcuts import render, HttpResponse
from core.worldstate import WorldState

current_state = WorldState('current')
desired_state = WorldState('desired')


def status(request):
    """
    Status. Health.
    """

    response = {
        'message': 'Sasha is alive.'
    }
    response = json.dumps(response)
    return HttpResponse(response, content_type='application/json', status=200)


def state(request):
    """
    Get the states.
    """

    if request.method == 'GET':

        response = {
            'current_state': current_state.get_state(),
            'desired_state': desired_state.get_state(),
            'commands': current_state.get_commands(desired_state)
        }
        response = json.dumps(response)
        return HttpResponse(response,
                            content_type='application/json',
                            status=200)

    else:
        response = {
            'status': 405,
            'message': 'Method %s not allowed.' % request.method
        }
        response = json.dumps(response)
        return HttpResponse(response,
                            content_type='application/json',
                            status=405)
