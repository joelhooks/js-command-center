(function() {
    /**
     * Minimal event dispatcher
     * @see http://stackoverflow.com/q/7026709/87002
     * @constructor
     */
    window.EventDispatcher = function EventDispatcher() {

        var listeners = {};

        this.addEventListener = function (event, listener, context) {
            if (listeners.hasOwnProperty(event)) {
                listeners[event].push([listener, context]);
            } else {
                listeners[event] = [
                    [listener, context]
                ];
            }
        };

        this.removeEventListener = function (event, listener) {
            var i;
            if (listeners.hasOwnProperty(event)) {
                for (i in listeners[event]) {
                    if (listeners[event][i][0] == listener) {
                        listeners[event].splice(i, 1);
                        return true;
                    }
                }
            }

            return false;
        };

        this.dispatchEvent = function (type) {
            var i;
            if (type && listeners.hasOwnProperty(type)) {
                for (i in listeners[type]) {
                    if (typeof listeners[type][i][0] == 'function') {
                        listeners[type][i][0].call(listeners[type][i][1], event);
                    }
                }
            }
        };
    };
}());