class Unit {
    constructor(name, unitClass, affiliation, pos, profileId, mov, item) {
        this.name = name;
        this.dir = new Vector2D(0, -1);
        this.unitClass = unitClass;
        this.affiliation = affiliation;
        this.pos = pos;
        this.mov = mov;
        this.profileId = profileId;

        this.item = item;

        this.isSelected = false;
        this.isHovered = false;
    }
}