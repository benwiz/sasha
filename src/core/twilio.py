"""
Twilio api wrapper.
"""

from twilio.rest import Client

from django.conf import settings

# the following line needs your Twilio Account SID and Auth Token
client = Client(settings.TWILIO_ACCOUNT, settings.TWILIO_TOKEN)

# change the "from_" number to your Twilio number and the "to" number
# to the phone number you signed up for Twilio with, or upgrade your
# account to send SMS to any phone number
client.messages.create(to="+19732644152",
                       from_="+12023351278",
                       body="Hello from Python!")
