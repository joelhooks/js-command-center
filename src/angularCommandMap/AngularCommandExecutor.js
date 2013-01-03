(function() {
    "use strict";
    jscc.AngularCommandExecutor = function AngularCommandExecutor(trigger, mappings, injector) {
        this.execute = function (eventType, params) {
            var mapping = mappings.head,
                command;

            while (mapping) {
                command = new mapping.commandConstructor();
                if (command) {
                    injector.invoke(command.execute, command, {params: params});
                }
                mapping = mapping.next;
            }
        };
    };
}());