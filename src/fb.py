import os

from fbchat import Client
from fbchat.models import *

# client = Client(settings.FB_ACCOUNT, settings.FB_PASSWORD)

# For early dev just manually set env vars
client = Client(os.environ['FB_ACCOUNT'], os.environ['FB_PASSWORD'])

thread_id = '100021852848092'
thread_type = ThreadType.GROUP

# Will send a message to the thread
client.sendMessage('hi', thread_id=thread_id)

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

client.listen()  # https://github.com/carpedm20/fbchat/blob/master/examples/echobot.py
