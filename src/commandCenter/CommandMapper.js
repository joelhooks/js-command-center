(function () {
    "use strict";
    /**
     * Describes a fluent interface for mapping and unmapping commands.
     *
     * @param trigger
     * @constructor
     */
    jscc.CommandMapper = function CommandMapper(trigger) {
        var mappings = new Hashtable(),
            createMapping,
            deleteMapping,
            overwriteMapping;

        /**
         * Used after `commandMap.map('event')` to specify the command
         * object that will be instantiated when an event of the given type
         * is received.
         *
         * @param {Function} commandConstructor
         * @return {*}
         */
        this.toCommand = function (commandConstructor) {
            var mapping;

            if (mappings.containsKey(commandConstructor)) {
                mapping = mappings.get(commandConstructor);
            }

            return mapping ? overwriteMapping(mapping) : createMapping(commandConstructor);
        };

        /**
         * Used after `commandMap.unmap('event')` to specify the command
         * object that will be removed from the event supplied.
         *
         * @param {Function} commandConstructor
         * @return {*}
         */
        this.fromCommand = function (commandConstructor) {
            var mapping = mappings.get(commandConstructor);
            if (mapping) {
                deleteMapping(mapping);
            }
        };

        /**
         * Will remove ALL mappings for the given trigger.
         *
         * `commandMap.unmap('event').fromAll();`
         */
        this.fromAll = function () {
            mappings.each(function (key, value) {
                deleteMapping(value);
            });
        };

        createMapping = function (commandConstructor) {
            var mapping = new jscc.CommandMapping(commandConstructor);
            trigger.addMapping(mapping);
            mappings.put(commandConstructor, mapping);
            return mapping;
        };

        deleteMapping = function (mapping) {
            trigger.removeMapping(mapping);
            mappings.remove(mapping.commandConstructor);
        };

        overwriteMapping = function (mapping) {
            deleteMapping(mapping);
            return createMapping(mapping.commandConstructor);
        };
    };
}());