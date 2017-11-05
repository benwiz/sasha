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

    # TODO: Hit unsplash or some other api for a link to an image of a bunny

    url = 'https://sasha.benwiz.io/sns?topic=sms'
    headers = {'content-type': 'application/json'}
    payload = {
        'phone': phone,
        'message': 'in the future, this will be a link to a bunny'
    }
    data = json.dumps(payload)
    print(data)
    response = requests.post(url, headers=headers, data=data)
    logger.info('%s', response)
    result = response.json()

    reply = {
      'statusCode': 200,
      'body': json.dumps({'message': 'Sent the text.'}),
    }
    return reply
