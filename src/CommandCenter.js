(function() {

    window.CommandCenter = function CommandCenter () {
        var mappings = new Hashtable(),
            nullUnmapper = {
                fromCommand: function(commandConstructor) {

                },
                fromAll: function() {

                }
            };

        this.map = function(trigger) {
            var mapper = mappings.get(trigger);

            if(!mapper) {
                mappings.put(trigger, new CommandMapper(trigger));
                mapper = mappings.get(trigger);
            }

            return mapper;
        };

        this.unmap = function(trigger) {
            return mappings.get(trigger) || nullUnmapper;
        }
    }

}());