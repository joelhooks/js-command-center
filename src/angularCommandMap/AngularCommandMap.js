(function() {
    "use strict";
    /**
     * CommandMap to be used within an AngularJS application.
     *
     * @param {Object} injector AngularJS $injector
     * @param {Object} rootScope AngularJS $rootScope
     * @param {Object} commandCenter CommandCenter instance
     * @constructor
     */
    jscc.AngularCommandMap = function AngularCommandMap(injector, rootScope, commandCenter) {
        var createTrigger,
            triggers = new Hashtable();

        /**
         * Accepts an event string to listen for. Is followed by
         * `toCommand` to map to a Command object.
         *
         * `commandMap.map('myCommandTriggerEvent').toCommand(commands.MyCommand);`
         *
         * @param {String} eventType
         * @return {*}
         */
        this.map = function (eventType) {
            var trigger = triggers.get(eventType);

            if (!trigger) {
                trigger = createTrigger(eventType);
                triggers.put(eventType, trigger);
            }

            return commandCenter.map(trigger);
        };

        /**
         * This will unmap a command from the given event string. Is followed by
         * `fromCommand` to map to a Command object.
         *
         * `commandMap.unmap('myCommandTriggerEvent').fromCommand(commands.MyCommand);`
         *
         * @param {String} eventType
         * @return {*}
         */
        this.unmap = function (eventType) {
            var trigger = triggers.get(eventType);
            return commandCenter.unmap(trigger);
        };

        createTrigger = function (type) {
            return new jscc.AngularCommandTrigger(injector, rootScope, type);
        };
    };
}());