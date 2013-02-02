(function() {
    "use strict";
    /**
     * Handles event listening for the CommandMap. Generally no need to access
     * this object directly.
     *
     * @param injector
     * @param scope
     * @param type
     * @constructor
     */
    jscc.AngularCommandTrigger = function AngularCommandTrigger(injector, scope, type) {
        var verifyCommand,
            addListener,
            removeListener,
            mappings = new jscc.CommandMappingList(),
            executor = new jscc.AngularCommandExecutor(this, mappings, injector),
            _removeListenerFunction;

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
            _removeListenerFunction = scope.$on(type, executor.execute);
        };

        removeListener = function() {
            if(_removeListenerFunction) {
                _removeListenerFunction.call(null);
            }
        };
    };
}());