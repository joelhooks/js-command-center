(function() {
    window.CommandMapper = function CommandMapper(trigger) {
        var mappings = new Hashtable(),
            createMapping,
            deleteMapping,
            overwriteMapping;

        this.toCommand = function(commandConstructor) {
            var mapping = mappings.get(commandConstructor);
            return mapping ? overwriteMapping(mapping) : createMapping(commandConstructor);
        };

        createMapping = function(commandConstructor) {
            var mapping = {};
            trigger.addMapping(mapping);
            return mapping;
        };

        deleteMapping = function(commandConstructor) {
            trigger.removeMapping(commandConstructor);
            mappings.remove(commandConstructor);
        };

        overwriteMapping = function(commandConstructor) {

        }
    }
}());