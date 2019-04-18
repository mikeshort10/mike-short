import React from "react";
import { shallow } from "enzyme";
import { Conway } from "./index";
describe("First React component test with Enzyme", () => {
	it("renders without crashin", () => {
		shallow(<Conway />);
	});
});
