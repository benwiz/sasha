import os

from fbchat import Client
from fbchat.models import *

print('start fb messenger bot')

thread_id = '536288846'
thread_type = ThreadType.GROUP

authors = {
    536288846: 'Ben Wiz'
}

class CustomClient(Client):
    def onMessage(self, mid, author_id, message, thread_id, thread_type, ts, metadata, msg, **kwargs):
        """
        Handle a message.
        """
        self.markAsDelivered(author_id, thread_id)
        self.markAsRead(author_id)

        # If you're not the author
        if author_id != self.uid:

            # TODO: Record message.


            # TODO: Respond with entry datetime.
            response = 'Thanks! I\'ve recorded this in your journal. ' + \
                       'Anything else you send in this chat today will be ' + \
                       'recorded for today\'s entry.'
            self.sendMessage(response, thread_id=thread_id)

# For early dev just manually set env vars
client = CustomClient(os.environ['FB_ACCOUNT'], os.environ['FB_PASSWORD'])
client.listen()

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
