import { moveSwitch } from "./index";

describe("moveSwitch tests", () => {
	let row: number;
	let column: number;
	beforeEach(() => {
		row = 28;
		column = 28;
	});
	it("invalid code 45", done => {
		expect(moveSwitch(45, row, column)).toEqual([row, column]);
		done();
	});

	it("on toggleLumos, code 32", done => {
		expect(moveSwitch(32, row, column)).toEqual([row, column]);
		done();
	});

	it("on attack, code 65", done => {
		expect(moveSwitch(65, row, column)).toEqual([row, column]);
		done();
	});

	it("move left", done => {
		expect(moveSwitch(37, row, column)).toEqual([row, column - 1]);
		done();
	});

	it("move up", done => {
		expect(moveSwitch(38, row, column)).toEqual([row - 1, column]);
		done();
	});

	it("move right", done => {
		expect(moveSwitch(39, row, column)).toEqual([row, column + 1]);
		done();
	});

	it("move down", done => {
		expect(moveSwitch(40, row, column)).toEqual([row + 1, column]);
		done();
	});
});
