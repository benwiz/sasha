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

    def get_commands(self, future_state):
        """
        This functions determines what changes to this state are necessary to
        reach the provided future state. For now, we know that all states have
        the same properties.

        `future_state` is a WorldClass instance.
        """

        return _identify_differences(state1, state2)

    def _idenfity_differences(state1, state2, differences={}):
        """
        Recursively identify the differences between two states and return
        it as a similarly shaped dictionary. This currently assumes the states
        both have the exact same shape.

        In the future, once properties can be added and removed from statues,
        this function will need to validate the properties while traversing.

        NOTE: This probably won't work without some messing around. Maybe
        smarter to also create a `_idenfity_differences_simple()` function that
        just looks at the top level.
        """

        # For each item in the base state
        for item in state1.items():
            # Get the value from old and new states
            key = item[0]
            value = item[1]
            new_value = state2[key]
            # Check if the value is a dictionary
            if type(value) == dict:
                # Recurse
                differences[key] = _idenfity_differences(value, state, differences)
            # Otherwise, compare the two values
            else:
                if value != new_value:
                    # Update the differences dict
                    differences[key] = new_value

            # Return the differences dict
        return differences
