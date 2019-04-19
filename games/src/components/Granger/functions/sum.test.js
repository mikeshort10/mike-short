import { sum } from "./sum";

describe("sum", () => {
	it("add 1 and 2", done => {
		expect(sum(1, 2)).toEqual(3);
		done();
	});
});
