"""
Send an image to someone. Right now, this uses an environment variable to send
an sms message.

TODO:
- Handle any query in `/marg/{query}`
- Require phone number in payload instead of env var
"""

import os
import logging
import json
import random

from libs import requests

PHONE_NUMBER = os.environ.get('PHONE_NUMBER')
UNSPLASH_APPLICATION_ID = os.environ.get('UNSPLASH_APPLICATION_ID')

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handle(event, context):
    """
    Lambda handler.
    """
    logger.info('%s\n%s', json.dumps(event), context)

    query = event['pathParameters']['query']
    logger.info('query: %s', query)

    # Get image url from unsplash
    # 30 max per page
    url = 'https://api.unsplash.com/search/photos/?per_page=30&query=%s&client_id=%s' % (query, UNSPLASH_APPLICATION_ID)
    response = requests.get(url)
    result = response.json()
    results = result['results']

    if len(results) == 0:
        body = {
            'success': False,
            'message': 'Could not find any images for `%s`.' % query
        }
        reply = {
            'statusCode': 404,
            'body': json.dumps(body),
        }
        return reply

    index = random.randint(0, len(results))
    image_url = results[index]['urls']['small']

    # Send text
    url = 'https://sasha.benwiz.io/sns?topic=sms'
    headers = {'content-type': 'application/json'}
    payload = {
        'phone': PHONE_NUMBER,
        'message': image_url
    }
    data = json.dumps(payload)
    response = requests.post(url, headers=headers, data=data)
    logger.info('%s', response)
    result = response.json()

    body = {
        'message': 'Sent a text with an image of `%s`.' % query,
        'image': image_url
    }
    reply = {
      'statusCode': 200,
      'body': json.dumps(body),
    }
    return reply
