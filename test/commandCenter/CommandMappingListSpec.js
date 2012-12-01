describe("CommandMappingList", function() {
    var list,
        mapping1,
        mapping2;

    beforeEach(function() {
        list = new CommandMappingList();
        mapping1 = {name: "mapping1", previous: null, next:null};
        mapping2 = {name: "mapping2", previous:null, next:null};
        mapping3 = {name: "mapping3", previous:null, next: null};
    });

    it("should be instantiated", function() {
        expect(list).toBeDefined();
    });

    it("should not have head when empty", function() {
        expect(list.head).toBeNull();
    });

    it("should not have tail when empty", function() {
        expect(list.tail).toBeNull();
    });

    describe("add", function() {
        it("should set head with addition of first node", function () {
            list.add(mapping1);
            expect(list.head).toEqual(mapping1);
        });

        it("should set head with addition of first node", function () {
            list.add(mapping1);
            expect(list.tail).toBe(mapping1);
        });

        it("should keep first mapping as head when another is added", function () {
            list.add(mapping1);
            list.add(mapping2);

            expect(list.head).toBe(mapping1);
        });

        it("should as second mapping as tail", function () {
            list.add(mapping1);
            list.add(mapping2);

            expect(list.tail).toBe(mapping2);
        });

        it("should set node pointers", function() {
            list.add(mapping1);
            list.add(mapping2);
            list.add(mapping3);

            expect(list.head).toBe(mapping1);
            expect(list.tail).toBe(mapping3);
            expect(mapping1.previous).toBeNull();
            expect(mapping1.next).toBe(mapping2);
            expect(mapping2.previous).toBe(mapping1);
            expect(mapping2.next).toBe(mapping3);
            expect(mapping3.previous).toBe(mapping2);
            expect(mapping3.next).toBeNull();
        });
    });

    describe("remove", function() {

        it("should remove head", function() {
            list.add(mapping1);
            list.remove(mapping1);

            expect(list.head).toBeNull();
        });

        it("should remove tail", function() {
            list.add(mapping1);
            list.remove(mapping1);

            expect(list.tail).toBeNull();
        });

        it("should remove middle node and preserve head and tail", function() {
            list.add(mapping1);
            list.add(mapping2);
            list.add(mapping3);

            list.remove(mapping2);

            expect(list.head).toBe(mapping1);
            expect(list.tail).toBe(mapping3);
        });

        it("should set new head node when head node is removed", function() {
            list.add(mapping1);
            list.add(mapping2);

            list.remove(mapping1);

            expect(list.head).toBe(mapping2);
        });

        it("should set new head previous to null when head is removed", function() {
            list.add(mapping1);
            list.add(mapping2);

            list.remove(mapping1);

            expect(mapping2.previous).toBeNull();
        });

        it("should set new tail node when tail node is removed", function() {
            list.add(mapping1);
            list.add(mapping2);

            list.remove(mapping2);

            expect(list.head).toBe(mapping1);
        });

        it("should set new tail next to null when tail is removed", function() {
            list.add(mapping1);
            list.add(mapping2);

            list.remove(mapping2);

            expect(mapping1.next).toBeNull();
        });

        it("should stitch siblings when middle node is removed", function() {
            list.add(mapping1);
            list.add(mapping2);
            list.add(mapping3);

            list.remove(mapping2);

            expect(mapping1.next).toBe(mapping3);
            expect(mapping3.previous).toBe(mapping1);
        });
    });
});