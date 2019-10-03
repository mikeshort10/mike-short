import { Player } from "../classes/Player";
import { Enemy } from "../classes/Enemy";
import { SpaceProps } from "../components/Board";
import { ICheckpoint, ICheckpoints } from "../types";

type IndexArray = Array<"0" | "1" | "2" | "3" | "4" | "5">;

export const indexes: IndexArray = ["0", "1", "2", "3", "4", "5"];

export const findCheckpoint = (
	code: string,
	goingToCenter: boolean,
	route: ICheckpoint,
): number[] => {
	const firstChar = code[0] as "0" | "1" | "2" | "3" | "4" | "5";
	const restOfCode: string = code.slice(1);
	const newRoute = route[firstChar];
	if (newRoute) {
		if (!restOfCode.length) {
			const { toCenter, toEdge } = newRoute;
			const nextStep = goingToCenter ? toEdge : toCenter;
			return nextStep ? nextStep[0] : [];
		}
		const slicedString = code.substr(1);
		return findCheckpoint(slicedString, goingToCenter, newRoute);
	}
	console.error("invalid checkpoint");
	return [];
};

export const determineCheckpoint = (
	player: Player | Enemy,
	lastSpace: SpaceProps,
	currentSpace: SpaceProps,
	checkpoints: ICheckpoints,
): { lastCheckpoint: number[]; checkpointCode: string } => {
	const { checkpoint, toCenter } = currentSpace;
	let { lastCheckpoint, checkpointCode } = player;
	const sameCheckpoint = lastSpace.checkpoint === checkpoint;
	const differentDirection = lastSpace.toCenter !== toCenter;
	if (toCenter && checkpoint && sameCheckpoint && differentDirection) {
		checkpointCode =
			lastSpace.toCenter || checkpoint.length === 1
				? checkpoint
				: checkpoint.substr(0, checkpoint.length - 1);
		const cp = findCheckpoint(checkpointCode, toCenter, checkpoints);
		if (cp) {
			lastCheckpoint = cp;
		}
	}
	return { lastCheckpoint, checkpointCode };
};
