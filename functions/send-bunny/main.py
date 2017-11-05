"""
Text a bun.

TODO:
- Better file docstring.
"""

import os
import logging
import json

from libs import requests


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handle(event, context):
    """
    Lambda handler.
    """
    logger.info('%s - %s', event, context)

    phone = os.environ.get('PHONE_NUMBER')

    # response = client.publish(
    #     PhoneNumber=phone,
    #     Message='helllooo!',
    #     Subject='plz work',
    #     MessageStructure='string'
    # )

    url = 'https://sasha.benwiz.io/sns?topic=sms'
    headers = {'content-type': 'application/json'}
    payload = {
        'phone': phone,
        'message': 'poop'
    }
    data = json.dumps(payload)
    print(data)
    response = requests.post(url, headers=headers, data=data)
    logger.info('%s', response)
    result = response.json()
    return 'ok!'
