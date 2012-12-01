(function() {
    window.CommandMapping = function CommandMapping(commandConstructor) {
        this.commandConstructor = commandConstructor;

        this.fireOnce = false;

        this.once = function(isOnce) {
            if(isOnce === undefined) {
                isOnce = true;
            }
            this.fireOnce = isOnce;
            return this;
        }
    }
}());