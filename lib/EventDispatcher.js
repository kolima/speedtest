export default class EventDispatcher {

    constructor()
    {
        // Contains all the event callbacks, organized by event types.
        this._events = {};
    }

    on(eventTypes, callback)
    {
        eventTypes = Array.isArray(eventTypes) ? eventTypes : [eventTypes];

        eventTypes.forEach(eventType => {
            var events = this._events[eventType] = this._events[eventType] || [];

            // If the callback isn't already registered, store it.
            if (!~events.indexOf(callback)) {
                events.push(callback);
            }
        });

        return this;
    }

    off(eventTypes, callback)
    {
        eventTypes = Array.isArray(eventTypes) ? eventTypes : [eventTypes];

        eventTypes.forEach(eventType => {
            var events = this._events[eventType];

            // If there is no specified callback, simply delete all the callbacks binded to the provided event type.
            if (callback == undefined && events) {
                delete this._events[eventType];
            } else {
                var eventIndex = events ? events.indexOf(callback) : -1;

                // If the callback is registered, remove it from the array.
                if (~eventIndex) {
                    events.splice(eventIndex, 1);
                }
            }
        });

        return this;
    }

    trigger(eventType, ...extraParameters)
    {
        var events = this._events[eventType] || [];

        // A callback can return a boolean value which will be logically compared to the other callbacks values before
        // being returned by the trigger() method. This allows a callback to send a "signal" to the caller, like
        // cancelling an action.
        var returnValue = true;

        events.forEach(callback => {
            // A callback must explicitly return false if it wants the trigger() method to return false, undefined will
            // not work. This avoids crappy callbacks to mess up with the triggering system.
            var value = callback(...extraParameters);
            value = value !== false ? true : false;

            returnValue = returnValue && value; // Compare the result of the callback to the actual return value
        });

        return returnValue;
    }

}
