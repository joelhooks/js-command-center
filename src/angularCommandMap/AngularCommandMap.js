(function() {
    "use strict";
    jscc.AngularCommandMap = function AngularCommandMap(injector, scope, commandCenter) {
        var createTrigger,
            triggers = new Hashtable();

        this.map = function(eventType) {
            var trigger = triggers.get(eventType);

            if(!trigger) {
                trigger = createTrigger(eventType);
                triggers.put(eventType, trigger);
            }

            return commandCenter.map(trigger);
        };

        createTrigger = function(type) {
            return new jscc.AngularCommandTrigger(injector, scope, type);
        };
    };
}());