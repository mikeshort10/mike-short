export class Player {
	constructor() {
		this.HP = this.maxHP = 30;
	}
	row: number = 28;
	column: number = 28;
	lastCheckpoint: number[] = [23, 33];
	checkpointCode: string = "1";
	level: number = 1;
	randomLimit: number = 4;
	baseAttack: number = 6;
	HP: number;
	maxHP: number;
	XP: number = 0;
	attack: string = "Stupify";
	hasCloak: boolean = false;
	cloaked: boolean = false;
	lumosPlus: boolean = false;
	lumosToggle: boolean = false;
	alohomora: boolean = false;
	direction?: 37 | 38 | 39 | 40;

	addXP = (XP: number): void => {
		const XPtoNextLevel = (this.level + 1) * 10;
		if (XP >= XPtoNextLevel) {
			this.XP = XP % XPtoNextLevel;
			this.level++;
			this.maxHP += 10;
			this.addHP(10);
			this.baseAttack += 2;
		}
		if (this.level === 3) {
			this.hasCloak = this.cloaked = true;
		} else if (this.level === 5) {
			this.lumosPlus = true;
		}
	};

	addHP = (HP: number): void => {
		this.HP = Math.min(HP + this.HP, this.maxHP);
	};

	getPosition = (): number[] => {
		return [this.row, this.column];
	};

	setPosition = (row: number, column: number): void => {
		this.row = row;
		this.column = column;
	};
}
