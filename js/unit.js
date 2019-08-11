class Unit {
    constructor(name, unitClass, affiliation, pos, mugshot, mov, item) {
        this.name = name;
        this.unitClass = unitClass;
        this.affiliation = affiliation;
        this.pos = pos;
        this.mov = mov;
        this.mugshot = mugshot;

        this.item = item;

        this.isSelected = false;
    }
}