(function() {
    window.EventCommandExecutor = function EventCommandExecutor(trigger, mappings, injector) {
        this.execute = function(eventType) {
            var mapping = mappings.head,
                command;

            while(mapping) {
                command = new mapping.commandConstructor();
                if(command) {
                    command.execute();
                }
                mapping = mapping.next;
            }
        }
    }
}());