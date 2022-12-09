const input = await Deno.readTextFile('day9/input.txt');

// Part 1
// Track head and tail positions as it moves along a 2d grid
// Head and tail start at position (x,y): 0,0
// Track positions that tail has been been

let headPosition: [number, number] = [0, 0];
let tailPosition: [number, number] = [0, 0];
const uniqueTailPositions: [number, number][] = [];

const getDirection = (input: string): 'L' | 'R' | 'U' | 'D' | undefined => {
	if (input === 'L' || input === 'R' || input === 'U' || input === 'D') return input;
	else return undefined;
};

const getUpdatedPositionFromDirection = (currentPosition: [number, number], direction: 'L' | 'R' | 'U' | 'D'): [number, number] => {
	const updatedCurrentPosition: [number, number] = [currentPosition[0], currentPosition[1]];
	switch (direction) {
		case 'L':
			updatedCurrentPosition[0] = updatedCurrentPosition[0] - 1;
			break;
		case 'R':
			updatedCurrentPosition[0] = updatedCurrentPosition[0] + 1;
			break;
		case 'U':
			updatedCurrentPosition[1] = updatedCurrentPosition[1] + 1;
			break;
		case 'D':
			updatedCurrentPosition[1] = updatedCurrentPosition[1] - 1;
			break;
	}
	return updatedCurrentPosition;
};

const instructions = input.split('\n');
instructions.map((instruction) => {
	const instructionArray = instruction.split(' ');
	if (instructionArray.length > 2) return;
	const direction = getDirection(instructionArray[0]);
	if (!direction) return;
	const moves = Number(instructionArray[1]);
	if (isNaN(moves)) return;

	// Per move, calculate updated position of head and then tail
	for (let i = 0; i < moves; i++) {
		// Calculate head position
		headPosition = getUpdatedPositionFromDirection(headPosition, direction);

		// Calculate tail position based on updated head position
		const xPositionDiff = headPosition[0] - tailPosition[0];
		const yPositionDiff = headPosition[1] - tailPosition[1];

		// Diagonally left + up
		if ((xPositionDiff < -1 && yPositionDiff > 0) || (xPositionDiff < 0 && yPositionDiff > 1)) {
			tailPosition = getUpdatedPositionFromDirection(tailPosition, 'L');
			tailPosition = getUpdatedPositionFromDirection(tailPosition, 'U');
		}
		// Diagonally left + down
		else if ((xPositionDiff < -1 && yPositionDiff < 0) || (xPositionDiff < 0 && yPositionDiff < -1)) {
			tailPosition = getUpdatedPositionFromDirection(tailPosition, 'L');
			tailPosition = getUpdatedPositionFromDirection(tailPosition, 'D');
		}
		// Diagonally right + up
		else if ((xPositionDiff > 1 && yPositionDiff > 0) || (xPositionDiff > 0 && yPositionDiff > 1)) {
			tailPosition = getUpdatedPositionFromDirection(tailPosition, 'R');
			tailPosition = getUpdatedPositionFromDirection(tailPosition, 'U');
		}
		// Diagonally right + down
		else if ((xPositionDiff > 1 && yPositionDiff < 0) || (xPositionDiff > 0 && yPositionDiff < -1)) {
			tailPosition = getUpdatedPositionFromDirection(tailPosition, 'R');
			tailPosition = getUpdatedPositionFromDirection(tailPosition, 'D');
		}
		// Straight left
		else if (xPositionDiff < -1) {
			tailPosition = getUpdatedPositionFromDirection(tailPosition, 'L');
		}
		// Straight right
		else if (xPositionDiff > 1) {
			tailPosition = getUpdatedPositionFromDirection(tailPosition, 'R');
		}
		// Straight up
		else if (yPositionDiff > 1) {
			tailPosition = getUpdatedPositionFromDirection(tailPosition, 'U');
		}
		// Straight down
		else if (yPositionDiff < -1) {
			tailPosition = getUpdatedPositionFromDirection(tailPosition, 'D');
		}

		// Update uniqueTailPositions
		let isUniqueTailPosition = true;
		uniqueTailPositions.map((uniqueTailPosition) => {
			if (uniqueTailPosition[0] === tailPosition[0] && uniqueTailPosition[1] === tailPosition[1]) {
				isUniqueTailPosition = false;
			}
		});
		if (isUniqueTailPosition) uniqueTailPositions.push(tailPosition);
	}
});

const numOfUniqueTailPositions = uniqueTailPositions.length;
console.log('numOfUniqueTailPositions', numOfUniqueTailPositions);

// Part 2
// Repeat the instructions, but with 10 knots (H, 1, 2, 3, 4, 5, 6, 7, 8, 9)
const knotPositions: [number, number][] = [
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0]
];
const uniqueTailPositions2: [number, number][] = [];

instructions.map((instruction) => {
	const instructionArray = instruction.split(' ');
	if (instructionArray.length > 2) return;
	const direction = getDirection(instructionArray[0]);
	if (!direction) return;
	const moves = Number(instructionArray[1]);
	if (isNaN(moves)) return;

	// Per move, calculate updated position of head and then tail
	for (let i = 0; i < moves; i++) {
		// Calculate head position
		knotPositions[0] = getUpdatedPositionFromDirection(knotPositions[0], direction);

		// Per head position update, iterate through each knot to determine subsequent knot positions
		for (let index = 1; index < knotPositions.length; index++) {
			// Calculate tail position based on updated head position
			const xPositionDiff = knotPositions[index - 1][0] - knotPositions[index][0];
			const yPositionDiff = knotPositions[index - 1][1] - knotPositions[index][1];

			// Diagonally left + up
			if ((xPositionDiff < -1 && yPositionDiff > 0) || (xPositionDiff < 0 && yPositionDiff > 1)) {
				knotPositions[index] = getUpdatedPositionFromDirection(knotPositions[index], 'L');
				knotPositions[index] = getUpdatedPositionFromDirection(knotPositions[index], 'U');
			}
			// Diagonally left + down
			else if ((xPositionDiff < -1 && yPositionDiff < 0) || (xPositionDiff < 0 && yPositionDiff < -1)) {
				knotPositions[index] = getUpdatedPositionFromDirection(knotPositions[index], 'L');
				knotPositions[index] = getUpdatedPositionFromDirection(knotPositions[index], 'D');
			}
			// Diagonally right + up
			else if ((xPositionDiff > 1 && yPositionDiff > 0) || (xPositionDiff > 0 && yPositionDiff > 1)) {
				knotPositions[index] = getUpdatedPositionFromDirection(knotPositions[index], 'R');
				knotPositions[index] = getUpdatedPositionFromDirection(knotPositions[index], 'U');
			}
			// Diagonally right + down
			else if ((xPositionDiff > 1 && yPositionDiff < 0) || (xPositionDiff > 0 && yPositionDiff < -1)) {
				knotPositions[index] = getUpdatedPositionFromDirection(knotPositions[index], 'R');
				knotPositions[index] = getUpdatedPositionFromDirection(knotPositions[index], 'D');
			}
			// Straight left
			else if (xPositionDiff < -1) {
				knotPositions[index] = getUpdatedPositionFromDirection(knotPositions[index], 'L');
			}
			// Straight right
			else if (xPositionDiff > 1) {
				knotPositions[index] = getUpdatedPositionFromDirection(knotPositions[index], 'R');
			}
			// Straight up
			else if (yPositionDiff > 1) {
				knotPositions[index] = getUpdatedPositionFromDirection(knotPositions[index], 'U');
			}
			// Straight down
			else if (yPositionDiff < -1) {
				knotPositions[index] = getUpdatedPositionFromDirection(knotPositions[index], 'D');
			}
		}

		// Update uniqueTailPositions
		let isUniqueTailPosition = true;
		uniqueTailPositions2.map((uniqueTailPosition) => {
			if (uniqueTailPosition[0] === knotPositions[9][0] && uniqueTailPosition[1] === knotPositions[9][1]) {
				isUniqueTailPosition = false;
			}
		});
		if (isUniqueTailPosition) uniqueTailPositions2.push(knotPositions[9]);
	}
});

const numOfUniqueTailPositions2 = uniqueTailPositions2.length;
console.log('numOfUniqueTailPositions2', numOfUniqueTailPositions2);
