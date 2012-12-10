(function() {
    "use strict";
    jscc.CommandMappingList = function CommandMappingList() {
        this.head = null;
        this.tail = null;

        this.add = function(node) {
            if(this.tail) {
                this.tail.next = node;
                node.previous = this.tail;
                this.tail = node;
            } else {
                this.head = this.tail = node;
            }
        };

        this.remove = function(node) {
            if(node === this.head) {
                this.head = this.head.next;
            }

            if(node === this.tail) {
                this.tail = this.tail.previous;
            }

            if(node.previous) {
                node.previous.next = node.next;
            }

            if(node.next) {
                node.next.previous = node.previous;
            }

        };
    };
}());