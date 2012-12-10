(function() {
    "use strict";
    jscc.CommandMapper = function CommandMapper(trigger) {
        var mappings = new Hashtable(),
            createMapping,
            deleteMapping,
            overwriteMapping;

        this.toCommand = function(commandConstructor) {
            var mapping;

            if(mappings.containsKey(commandConstructor)) {
                mapping = mappings.get(commandConstructor);
            }

            return mapping ? overwriteMapping(mapping) : createMapping(commandConstructor);
        };

        this.fromCommand = function(commandConstructor) {
            var mapping = mappings.get(commandConstructor);
            deleteMapping(mapping);
        };

        this.fromAll = function() {
            mappings.each(function(key, value) {
                deleteMapping(value);
            });
        };

        createMapping = function(commandConstructor) {
            var mapping = new jscc.CommandMapping(commandConstructor);
            trigger.addMapping(mapping);
            mappings.put(commandConstructor, mapping);
            return mapping;
        };

        deleteMapping = function(mapping) {
            trigger.removeMapping(mapping);
            mappings.remove(mapping.commandConstructor);
        };

        overwriteMapping = function(mapping) {
            deleteMapping(mapping);
            return createMapping(mapping.commandConstructor);
        };
    };
}());