"""
Connect to Sasha's Facebook account and listen for messages. Handle certain
threads.
"""

import os
import datetime

from fbchat import Client
from fbchat.models import *
import pytz

from . import google_sheets


thread_id = '536288846'

authors = {
    '536288846': 'Ben Wiz',
    '1806001818': 'Marg Dalton'
}
threads = {
    'benmarg': '1372354939539577',
    'benwiz': '536288846'
}
sheets = {
    'benmarg': '1cM-yDqosHzSQ-K9ITPRIMST-aTJ6mF22LfYZnjMqO3g'
}


class CustomClient(Client):
    def onMessage(self, mid, author_id, message, thread_id, thread_type, ts, metadata, msg, **kwargs):
        """
        Handle a message.
        """

        # If you're not the author
        if author_id != self.uid:

            # Mark message as delivered and read
            self.markAsDelivered(author_id, thread_id)
            self.markAsRead(author_id)

            # If the thread is the one with benmarg
            if thread_id == threads['benmarg']:

                sheet_id = sheets['benmarg']
                timestamp = datetime.datetime.fromtimestamp(ts/1000)
                timestamp = timestamp.strftime('%Y-%m-%d %H:%M:%S')
                author = authors[author_id]

                rows = [
                    [timestamp, message, author]
                ]

                # Record message
                google_sheets.insert_data(sheet_id, rows)

                # Better response. Probably just entry datetime.
                response = 'I\'ve recorded %s\'s message for %s UTC.' \
                           % (author, timestamp)
                self.sendMessage(response,
                                 thread_id=thread_id,
                                 thread_type=ThreadType.GROUP)


def listen():
    """
    Listen to Facebook.
    """

    client = CustomClient(os.environ['FB_ACCOUNT'], os.environ['FB_PASSWORD'])
    client.listen()


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Executes every Monday morning at 7:30 a.m.
    sender.add_periodic_task(
        # crontab(hour=7, minute=30, day_of_week=1),
        5,
        test.s('Happy Mondays!')
    )

@app.task
def test(arg):
    print(arg)


#
#
#
#

# # Will send the default `like` emoji
# client.sendEmoji(emoji=None, size=EmojiSize.LARGE, thread_id=thread_id, thread_type=thread_type)

# # Will send the emoji `👍`
# client.sendEmoji(emoji='👍', size=EmojiSize.LARGE, thread_id=thread_id, thread_type=thread_type)

# # Will send the image located at `<image path>`
# client.sendLocalImage('<image path>', message='This is a local image', thread_id=thread_id, thread_type=thread_type)

# # Will download the image at the url `<image url>`, and then send it
# client.sendRemoteImage('<image url>', message='This is a remote image', thread_id=thread_id, thread_type=thread_type)


# # Only do these actions if the thread is a group
# if thread_type == ThreadType.GROUP:
#     # Will remove the user with ID `<user id>` from the thread
#     client.removeUserFromGroup('<user id>', thread_id=thread_id)

#     # Will add the user with ID `<user id>` to the thread
#     client.addUsersToGroup('<user id>', thread_id=thread_id)

#     # Will add the users with IDs `<1st user id>`, `<2nd user id>` and `<3th user id>` to the thread
#     client.addUsersToGroup(['<1st user id>', '<2nd user id>', '<3rd user id>'], thread_id=thread_id)


# # Will change the nickname of the user `<user_id>` to `<new nickname>`
# client.changeNickname('<new nickname>', '<user id>', thread_id=thread_id, thread_type=thread_type)

# # Will change the title of the thread to `<title>`
# client.changeThreadTitle('<title>', thread_id=thread_id, thread_type=thread_type)

# # Will set the typing status of the thread to `TYPING`
# client.setTypingStatus(TypingStatus.TYPING, thread_id=thread_id, thread_type=thread_type)

# # Will change the thread color to `MESSENGER_BLUE`
# client.changeThreadColor(ThreadColor.MESSENGER_BLUE, thread_id=thread_id)

# # Will change the thread emoji to `👍`
# client.changeThreadEmoji('👍', thread_id=thread_id)

# # Will react to a message with a 😍 emoji
# client.reactToMessage('i luv robots', MessageReaction.LOVE)
