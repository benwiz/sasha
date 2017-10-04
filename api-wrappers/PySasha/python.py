"""
Interface/wrapper for Sasha's HTTP APIs. This file will evolve into a pip
module (not to be deployed publically).

TODO: Tests should be built in.
"""


import json
from pprint import pprint

import requests


class Sasha:

    def __init__(self, host='http://localhost:8000'):
        self._host = host
        self._headers = {
            'Content-Type': 'application/json'
        }

    def __str__(self):
        return 'Sasha@%s' % self._host

    def get_state(self, path=None):
        """
        Get the state(s) endpoint. It gets current_state, desired_sate, and
        commands.

        TODO: Once GET /api/state supports it, handle a path.
        TODO: Error handling.
        """

        url = self._host + '/api/state'
        res = requests.get(url, headers=self._headers)
        response = res.json()

        return response

    def update_state(self, current_state=None, desired_state=None):
        """
        Update the state(s) endpoint. It update current_state, desired_sate,
        and commands. Behaves like a patch, so only what is provided will be
        updated.

        TODO: Error handling.
        """

        state = {}
        if current_state:
            state['current_state'] = current_state
        if desired_state:
            state['desired_state'] = desired_state

        url = self._host + '/api/state'
        data = json.dumps(state)
        res = requests.patch(url, headers=self._headers, data=data)
        response = res.json()

        return response


if __name__ == '__main__':
    sasha = Sasha()

    print('get state:')
    state = sasha.get_state()
    pprint(state)

    print('\nupdate state:')
    current_state = {
        'salt_lamp': {
            'state': 'off'
        }
    }
    desired_state = {
        'salt_lamp': {
            'state': 'on'
        }
    }
    state = sasha.update_state(current_state=current_state, desired_state=desired_state)
    pprint(state)
