(function() {

    window.CommandCenter = function CommandCenter () {
        var mappings = {};

        this.map = function(trigger) {
            return mappings[trigger] || (mappings[trigger] = {});
        };
    }

}());