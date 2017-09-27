"""
The file implements a "state-of-the-world" class. All properties must be
accessed through getter and setter functions.

TODO: Use sqlite database (or other longer term solution) so that the state
isn't reset every time the webserver restarts.
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

    def __str__(self):
        return self._name

    def get_state(self, path=None):
        """
        Get the state. If a path is provided that part of the dictionary will
        be returned.
        """

        if path is None:
            return self._state

        # Get the squence of keys
        keys = path.split('.')

        # Get the top level of the state (the whole thing)
        sub_state = self._state

        # Iterate through the sequence of keys
        for key in keys:
            # Get the next level of the state dictionary
            sub_state = sub_state.get(key, '&empty')

            # If there was no next level found
            if sub_state == '&empty':
                # Raise an exception
                raise KeyError('Could not find "%s" in provided path "%s"'
                               % (key, path))

            # If the final key
            if key == keys[-1]:
                # Return the current sub_state
                return sub_state

    def set_state(self, state):
        self._state = state

    def set_property(self, path, value):
        """
        Set the property at the given, dot separated path. Currently new leaves
        may be created but not new nodes.
        """

        # Get the sequence of keys
        keys = path.split('.')

        # Get the top level of the state (the whole thing)
        sub_state = self._state
        print(sub_state)

        # Iterate through sequence of keys
        for key in keys:
            # If the final key
            if key == keys[-1]:
                # Set the value
                sub_state[key] = value
            else:
                # Get the next level of the state dictionary. We set the value to
                # `'&empty'` instead of `None` here because it is possible that the
                # value of the state is `None`.
                sub_state = sub_state.get(key, '&empty')
                print(sub_state)

                # If there was no next level found
                if sub_state == '&empty':
                    # Raise an exception
                    raise KeyError('Could not find "%s" in provided path "%s"'
                                   % (key, path))

    def get_commands(self, future_state):
        """
        This functions determines what changes to this state are necessary to
        reach the provided future state. For now, we know that all states have
        the same properties.

        `future_state` is a WorldClass instance.
        """

        future = future_state.get_state()
        return self._identify_differences(self._state, future)

    def _identify_differences(self, state1, state2, differences={}):
        """
        Recursively identify the differences between two states and return
        it as a similarly shaped dictionary. This currently assumes the states
        both have the exact same shape.

        In the future, once properties can be added and removed from statues,
        this function will need to validate the properties while traversing.
        """

        # Init differences dict
        differences = {}

        # For each item in the base state
        for item in state1.items():
            # Get the value from old and new states
            key = item[0]
            value = item[1]
            value2 = state2[key]
            # Check if the value is a dictionary
            if type(value) == dict:
                # Recurse
                differences[key] = self._identify_differences(value, value2, differences)
            # Otherwise, compare the two values
            else:
                if value != value2:
                    # Update the differences dict
                    differences[key] = value2

            # Return the differences dict
        return differences
