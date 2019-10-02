import React from "react";
import { shallow } from "enzyme";
import { Granger } from "./index";

//As I level up, my attack changes
//directions for cloak
//directions for lumos
//directions for book
//I can move on to level 2 😱

describe("<Granger />", () => {
	test("renders without crashing", done => {
		shallow(<Granger />);
		done();
	});

	describe("state renders as expected", () => {
		let wrapper;
		let state;
		beforeEach(() => {
			wrapper = shallow(<Granger />);
			state = wrapper.state();
		});

		test("state exists", () => {
			expect(state).toBeDefined();
		});

		test("enemies assigned correctly", () => {
			expect(state).toHaveProperty("enemies");
			expect(state.enemies).toHaveProperty("11");
			const enemy = state.enemies[5];
			expect(enemy).toHaveProperty("XP", 15);
			expect(enemy).toHaveProperty("HP", 20);
			expect(enemy).toHaveProperty("baseAttack", 6);
			expect(enemy).toHaveProperty("position");
			expect(enemy.position).toBeInstanceOf(Array);
			expect(enemy).toHaveProperty("attack", false);
			expect(enemy).toHaveProperty("player", "hufflepuff");
			expect(enemy).toHaveProperty("checkpointCode");
			expect(enemy.checkpointCode).toBeDefined();
			expect(enemy).toHaveProperty("lastCheckpoint");
			expect(enemy.lastCheckpoint).toBeInstanceOf(Array);
		});

		test("player assigned correctly", () => {
			const player = state.player;
			expect(player).toBeDefined();
			expect(player).toHaveProperty("XP", 0);
			expect(player).toHaveProperty("HP", 30);
			expect(player).toHaveProperty("maxHP", player.HP);
			expect(player).toHaveProperty("baseAttack", 6);
			expect(player).toHaveProperty("randomLimit", 4);
			expect(player).toHaveProperty("level", 1);
			expect(player).toHaveProperty("attack", "Stupify");
		});

		test("board generates correctly", () => {
			const board = state.board;
			expect(board).toBeDefined();
			expect(board).toHaveProperty("53");
			expect(board["53"]["53"]).toBeDefined();
			expect(board["54"]).toBeUndefined();
			expect(board["23"]["54"]).toBeUndefined();
			const row = "12",
				column = "37";
			const space = board[row][column];
			expect(space).toHaveProperty("row", Number(row));
			expect(space).toHaveProperty("column", Number(column));
			expect(space).toHaveProperty("playable", true);
			expect(board["0"]["0"]).toHaveProperty("playable", false);
			expect(board["27"]["28"]).toHaveProperty("playable", true);
			expect(space).toHaveProperty("darkness", true);
			expect(board["36"]["48"]).toHaveProperty("player", "book");
			expect(board["23"]["46"]).toHaveProperty("player", "door");
			expect(board["23"]["46"]).toHaveProperty("playable", false);
			expect(board["28"]["28"]).toHaveProperty("player", "player");
		});

		test("timers are started", () => {
			const timer = state.timer;
			expect(timer).toBeDefined;
			expect(timer).toHaveProperty("count", 500);
			expect(timer.id).toBeDefined();
		});
	});

	xdescribe("all functions are called on render", () => {
		let wrapper;
		beforeEach(() => {
			wrapper = shallow(<Granger />);
		});

		test("boardSetup is called", () => {});
	});

	xdescribe("change settings generates correct state", () => {
		let wrapper;
		test("18 enemies generates correct state", () => {
			wrapper = shallow(<Granger />).setState({ numOfEnemies: 18 });
			const state = wrapper.state();
			expect(state.enemies).toHaveProperty("17");
			expect(state.enemies["18"]).toBeUndefined();
		});
	});
});
