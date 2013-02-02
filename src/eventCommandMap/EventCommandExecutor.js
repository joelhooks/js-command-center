(function() {
    "use strict";
    jscc.EventCommandExecutor = function EventCommandExecutor(trigger, mappings, injector) {
        this.execute = function(eventType) {
            var mapping = mappings.head,
                command;

            while(mapping) {
                command = new mapping.commandConstructor();
                if(command) {
                    if(mapping.fireOnce) {
                        trigger.removeMapping(mapping);
                    }
                    command.execute();
                }
                mapping = mapping.next;
            }
        };
    };
}());