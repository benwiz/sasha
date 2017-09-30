"""
Core views.

The core application is for communication with external services and should do
no more than calcuate differences between the current and desired states.

Probably should not use this application for any front-end work.

TODO: Use Django REST Framework, it looks amazing.
"""

import json
from multiprocessing import Process
from pprint import pprint

from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from core.worldstate import WorldState

m_current_state = WorldState('current')
m_desired_state = WorldState('desired')

# # Set state for testing
# m_current_state.set_state({'salt_lamp': {'state': 'on'}})
# m_desired_state.set_state({'salt_lamp': {'state': 'on'}})


def index(request):
    """
    Main UI.
    """

    context = {
        'current_state': json.dumps(m_current_state.get_state()),
        'desired_state': json.dumps(m_desired_state.get_state())
    }
    return render(request, 'index.html', context)


def status(request):
    """
    Status. Health.
    """

    response = {
        'message': 'Sasha is alive.'
    }
    response = json.dumps(response)
    return HttpResponse(response, content_type='application/json', status=200)


@csrf_exempt  # For development.
def state(request):
    """
    Get the states.

    GET query string
        - states (optional): comma deliminated list (string)
    PUT body
        - current_state {} (optional)
        - desired_state {} (optional)
    """

    # If GET state
    # TODO: This should get one, some, or all states and all if none specified.
    if request.method == 'GET':

        response = {
            'current_state': m_current_state.get_state(),
            'desired_state': m_desired_state.get_state(),
            'commands': m_current_state.get_commands(m_desired_state)
        }
        response = json.dumps(response)
        return HttpResponse(response,
                            content_type='application/json',
                            status=200)

    # If PUT state; TODO: Get rid of POST from here.
    elif request.method == 'PUT' or request.method == 'POST':

        payload = json.loads(request.body)
        print(payload)

        # The states from payload
        new_current_state = payload.get('current_state')
        new_desired_state = payload.get('desired_state')

        # TODO: Dynamically parse through the state tree. This is not the first
        # time dynamic parsing has come up. There should definitely be a
        # generic function.

        # Set state for salt_lamp. This will have to go away in favor of above.
        if new_current_state:
            m_current_state.set_property(
                'salt_lamp.state', new_current_state['salt_lamp']['state'])
        if new_desired_state:
            m_desired_state.set_property(
                'salt_lamp.state', new_desired_state['salt_lamp']['state'])

        response = {
            'current_state': m_current_state.get_state(),
            'desired_state': m_desired_state.get_state()
        }
        response = json.dumps(response)
        return HttpResponse(response,
                            content_type='application/json',
                            status=200)

    # If anything else
    else:
        response = {
            'status': 405,
            'message': 'Method %s not allowed.' % request.method
        }
        response = json.dumps(response)
        return HttpResponse(response,
                            content_type='application/json',
                            status=405)
