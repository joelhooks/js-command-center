(function() {
    window.EventCommandTrigger = function EventCommandTrigger(dispatcher) {
        var verifyCommand,
            addListener,
            removeListener,
            mappings = new CommandMappingList();

        this.addMapping = function(mapping) {
            verifyCommand(mapping);
            mappings.head || addListener();
            mappings.add(mapping);
        };

        this.removeMapping = function(mapping) {
            mappings.remove(mapping);
            mappings.head || removeListener();
        };

        verifyCommand = function(mapping) {
            var execute = mapping.commandConstructor.prototype.execute;
            if(!execute) {
                throw new Error("No execute() method on CommandMapping");
            }
        };

        //TODO Need to flesh out how/what is the event dispatcher here...

        addListener = function() {
            dispatcher.addEventListener()
        };

        removeListener = function() {
            dispatcher.removeEventListener();
        }
    }
}());