(function() {
    "use strict";
    jscc.AngularCommandExecutor = function AngularCommandExecutor(trigger, mappings, injector) {
        this.execute = function (eventType, params) {
            var mapping = mappings.head,
                command;

            while (mapping) {
                command = injector.instantiate(mapping.commandConstructor, {params: params});
                if (command) {
                    if (mapping.fireOnce) {
                        trigger.removeMapping(mapping);
                    }
                    injector.invoke(command.execute, command, {params: params});
                    if (command.destroy) {
                        command.destroy();
                    }
                }
                mapping = mapping.next;
            }
        };
    };
}());