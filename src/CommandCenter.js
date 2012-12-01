(function() {

    window.CommandCenter = function CommandCenter () {
        var mappings = new Hashtable();

        this.map = function(trigger) {
            return mappings[trigger] || (mappings[trigger] = {trigger:trigger});
        };
    }

}());