(function() {
    window.EventCommandTrigger = function EventCommandTrigger(injector, dispatcher, type) {
        var verifyCommand,
            addListener,
            removeListener,
            mappings = new CommandMappingList(),
            executor = new EventCommandExecutor(this, mappings, injector);

        this.addMapping = function(mapping) {
            verifyCommand(mapping);
            if (!mappings.head) {
                addListener();
            }
            mappings.add(mapping);
        };

        this.removeMapping = function(mapping) {
            mappings.remove(mapping);
            if(!mappings.head) {
                removeListener();
            }
        };

        verifyCommand = function(mapping) {
            var execute = mapping.commandConstructor.prototype.execute;
            if(!execute) {
                throw new Error("No execute() method on CommandMapping");
            }
        };

        addListener = function() {
            dispatcher.addEventListener(type, executor.execute);
        };

        removeListener = function() {
            dispatcher.removeEventListener(type, executor.execute);
        };
    };
}());