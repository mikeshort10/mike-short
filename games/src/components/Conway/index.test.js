import React from "react";
import { shallow } from "enzyme";
import { Conway } from "./index";
describe("<Conway />", () => {
	it("renders without crashin", done => {
		shallow(<Conway />);
		done();
	});

	describe("check renderings in <Conway />", () => {
		let wrapper;
		beforeEach(() => {
			wrapper = shallow(<Conway />);
		});
		it("correct amount of cells render", done => {
			expect(wrapper.find(".cell")).toHaveLength(1500);
			done();
		});

		it("state renders as expected", done => {
			const state = wrapper.state();
			expect(state).toHaveProperty("generation", 0);
			expect(state).toHaveProperty("gamePlay", true);
			expect(state).toHaveProperty("changeSpeed", "Slow Down");
			expect(state).toHaveProperty("timer");
			done();
		});

		it("not all cells render dead", done => {
			expect(wrapper.find(".dead").length).toBeLessThan(1500);
			expect(wrapper.find(".alive").length).toBeGreaterThan(0);
			done();
		});

		it("cells are not frozen", async done => {
			expect(wrapper.state()).toHaveProperty("generation");
			setTimeout(function() {
				const state = wrapper.state();
				expect(state.generation).toBeGreaterThan(1);
				expect(wrapper.find(".dead").length).toBeLessThan(1500);
				expect(wrapper.find(".alive").length).toBeGreaterThan(0);
				done();
			}, 500);
		});

		it("buttons render", done => {
			expect(wrapper.find("#buttons").props().children).toHaveLength(4);
			done();
		});
	});
});
