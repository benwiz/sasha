"""
The file implements a "state-of-the-world" class. All properties must be
accessed through getter and setter functions.
"""


class WorldState:

    def __init__(self, name):
        self._name = name

        # I have chosen to store the state of the world as a single dictionary
        # rather than as a collection of properties because I think it will be
        # easier to change in the future.
        #
        # For on/off states use 1/0. Use `None` for unknown.
        self._state = {
            'salt_lamp': {
                'state': None
            }
        }

    def get_state(self):
        return self._state

    def set_state(self, state):
        self._state = state

    def get_property(self, path):
        """
        Get the property at the given, dot separated path.
        """

        # Get the squence of keys
        keys = path.split('.')

        # Get the top level of the state (the whole thing)
        sub_state = self._state

        # Iterate through the sequence of keys
        for key in keys:
            # Get the next level of the state dictionary
            sub_state = sub_state[key]
            # If the final key
            if key == keys[-1]:
                # Return the current sub_state
                return sub_state

    def set_property(self, path, value):
        """
        Set the property at the given, dot separated path. This function should
        not create new properties. For now, I want the dictionary hardcoded
        into the class.
        """

        # Get the sequence of keys
        keys = path.split('.')

        # Get the top leve of the state (the whole thing)
        sub_state = self._state

        # Iterate through sequence of keys
        for key in keys:
            # Get the next level of the state dictionary
            sub_state = sub_state.get(key)
            # If there was no next level found
            if sub_state is None:
                # Raise an exception
                raise KeyError('Could not find "%s" in provided path "%s"'
                               % key, path)
            # If the final key
            if key == keys[-1]:
                # Set the value
                sub_state = value

    def get_differences(self, future_state):
        """
        This functions what changes to this state are necessary to reach the
        provided future state.

        `future_state` is a WorldClass instance.
        """

        return
