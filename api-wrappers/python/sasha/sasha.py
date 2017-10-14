"""
Interface/wrapper for Sasha's HTTP APIs. This file will evolve into a pip
module (not to be deployed publically).

TODO: Tests should be built in.
"""

import sys
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
        """

        url = self._host + '/api/state'

        try:
            res = requests.get(url, headers=self._headers)
        except requests.exceptions.Timeout as e:
            # Maybe set up for a retry, or continue in a retry loop
            print(e)
            return self.get_state(path=path)
        except requests.exceptions.TooManyRedirects as e:
            # Tell the user their URL was bad and try a different one
            print(e)
            return 'bad url?'
        except requests.exceptions.RequestException as e:
            # Catastrophic error. Bail.
            print(e)
            sys.exit(1)

        response = res.json()
        return response

    def update_state(self, current_state=None, desired_state=None):
        """
        Update the state(s) endpoint. It update current_state, desired_sate,
        and commands. Behaves like a patch, so only what is provided will be
        updated.
        """

        state = {}
        if current_state:
            state['current_state'] = current_state
        if desired_state:
            state['desired_state'] = desired_state

        url = self._host + '/api/state'
        data = json.dumps(state)

        try:
            res = requests.patch(url, headers=self._headers, data=data)
        except requests.exceptions.Timeout as e:
            # Maybe set up for a retry, or continue in a retry loop
            print(e)
            return self.update_state(current_state=current_state,
                                     desired_state=desired_state)
        except requests.exceptions.TooManyRedirects as e:
            # Tell the user their URL was bad and try a different one
            print(e)
            return 'bad url?'
        except requests.exceptions.RequestException as e:
            # Catastrophic error. Bail.
            print(e)
            sys.exit(1)

        response = res.json()
        return response


if __name__ == '__main__':
    print('Run Sasha.')
    sasha = Sasha()

    print('\nget state:')
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


