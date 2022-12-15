const input = await Deno.readTextFile('day14/input.txt');
const inputArray = input.split('\n');

// Part 1
// Parse from input the nodes (vertices) and paths (edges) of each rock and create a map
// Questions: Should I render each node in the map, or should I try and infer sand paths based on nodes / paths
type Coord = {
	x: number;
	y: number;
};
type MaxAxisValues = { minY: number; minX: number; maxY: number; maxX: number };

const parseCoordsFromInputLine = (line: string): Coord[] => {
	const lineCoords: Coord[] = [];
	line.split(' -> ').reduce((prevCoord, coordInput) => {
		const coordInputArray = coordInput.split(',');
		const [xInput, yInput] = coordInputArray;
		const coord = { x: Number(xInput), y: Number(yInput) };
		if (isNaN(coord.x) || isNaN(coord.y)) return coord;
		if (prevCoord) {
			if (prevCoord.x === coord.x) {
				const yDiff = coord.y - prevCoord.y;
				for (let i = 1; i <= Math.abs(yDiff); i++) {
					lineCoords.push({ x: coord.x, y: yDiff > 0 ? prevCoord.y + i : yDiff < 0 ? prevCoord.y - i : 0 });
				}
			} else if (prevCoord.y === coord.y) {
				const xDiff = coord.x - prevCoord.x;
				for (let i = 1; i <= Math.abs(xDiff); i++) {
					lineCoords.push({ x: xDiff > 0 ? prevCoord.x + i : xDiff < 0 ? prevCoord.x - i : 0, y: coord.y });
				}
			}
			return coord;
		} else {
			lineCoords.push({ x: coord.x, y: coord.y });
			return coord;
		}
	}, undefined as Coord | undefined);
	return lineCoords;
};

const findMaxAxisValuesFromCoords = (coords: Coord[]): MaxAxisValues => {
	let minY = Infinity;
	let minX = Infinity;
	let maxY = 0;
	let maxX = 0;
	// Find max X / max Y
	coords.map((coord) => {
		minY = Math.min(coord.y, minY);
		minX = Math.min(coord.x, minX);
		maxY = Math.max(coord.y, maxY);
		maxX = Math.max(coord.x, maxX);
	});
	return {
		minY,
		minX,
		maxY,
		maxX
	};
};

const renderMapFromCoords = (coordsGroups: { coords: Coord[]; char: string }[]) => {
	let maxAxisValues: MaxAxisValues = {
		minY: Infinity,
		minX: Infinity,
		maxY: 0,
		maxX: 0
	};
	coordsGroups.map((coordGroup) => {
		const values = findMaxAxisValuesFromCoords(coordGroup.coords);
		maxAxisValues = {
			minY: Math.min(values.minY, maxAxisValues.minY),
			minX: Math.min(values.minX, maxAxisValues.minX),
			maxY: Math.max(values.maxY, maxAxisValues.maxY),
			maxX: Math.max(values.maxX, maxAxisValues.maxX)
		};
	});

	// Draw map
	if (maxAxisValues.minY === Infinity || maxAxisValues.minX === Infinity || !maxAxisValues.maxY || !maxAxisValues.maxX) return;
	for (let y = maxAxisValues.minY; y <= maxAxisValues.maxY; y++) {
		const row: string[] = [];
		for (let x = maxAxisValues.minX; x <= maxAxisValues.maxX; x++) {
			coordsGroups.map((coordsGroup) => {
				const coord = coordsGroup.coords.find((coord) => coord.x === x && coord.y === y);
				if (row[x] && row[x] !== '.') return;
				else if (coord) row[x] = coordsGroup.char;
				else row[x] = '.';
			});
		}
		console.log(row.join(''));
	}
};

const simulateFallingSand = (startSandCoord: Coord, rockCoords: Coord[], addFloor?: boolean): Coord[] => {
	const maxAxisValues = findMaxAxisValuesFromCoords(rockCoords);
	const sandCoords: Coord[] = [];

	// Loop as sand continues falling until it no longer rests or falls out of bounds
	// Loop as one sand falls
	// Track startSandCoord, currentSandCoord, nextSandCoord (to determine if it is going to stop moving)
	let isSandFallingOutOfBounds = false;
	let isSandBlockedAtSource = false;

	while (!isSandFallingOutOfBounds && !isSandBlockedAtSource) {
		let isSandResting = false;
		let currentSandCoord: Coord = { x: startSandCoord.x, y: startSandCoord.y };

		while (!isSandResting && !isSandFallingOutOfBounds) {
			// Check below, below left, and below right for rocks or sand
			const belowCoord = { x: currentSandCoord.x, y: currentSandCoord.y + 1 };
			const belowLeftCoord = { x: currentSandCoord.x - 1, y: currentSandCoord.y + 1 };
			const belowRightCoord = { x: currentSandCoord.x + 1, y: currentSandCoord.y + 1 };
			let isRockBelow = false;
			let isRockBelowLeft = false;
			let isRockBelowRight = false;
			let isSandBelow = false;
			let isSandBelowLeft = false;
			let isSandBelowRight = false;

			rockCoords.find((rockCoord) => {
				if (rockCoord.x === belowCoord.x && rockCoord.y === belowCoord.y) {
					isRockBelow = true;
				}
				if (rockCoord.x === belowLeftCoord.x && rockCoord.y === belowLeftCoord.y) {
					isRockBelowLeft = true;
				}
				if (rockCoord.x === belowRightCoord.x && rockCoord.y === belowRightCoord.y) isRockBelowRight = true;
			});

			sandCoords.find((sandCoord) => {
				if (sandCoord.x === belowCoord.x && sandCoord.y === belowCoord.y) isSandBelow = true;
				if (sandCoord.x === belowLeftCoord.x && sandCoord.y === belowLeftCoord.y) isSandBelowLeft = true;
				if (sandCoord.x === belowRightCoord.x && sandCoord.y === belowRightCoord.y) isSandBelowRight = true;
			});

			// Added for Part 2
			if (addFloor) {
				const floorY = maxAxisValues.maxY + 2;
				if (belowCoord.y >= floorY) {
					isRockBelow = true;
				}
				if (belowLeftCoord.y >= floorY) {
					isRockBelowLeft = true;
				}
				if (belowRightCoord.y >= floorY) {
					isRockBelowRight = true;
				}
			}

			// Determine if sand can fall below, below left, or below right
			let nextSandCoord: Coord | undefined = undefined;
			if (!isRockBelow && !isSandBelow) {
				nextSandCoord = { x: belowCoord.x, y: belowCoord.y };
			} else if (!isRockBelowLeft && !isSandBelowLeft) {
				nextSandCoord = { x: belowLeftCoord.x, y: belowLeftCoord.y };
			} else if (!isRockBelowRight && !isSandBelowRight) {
				nextSandCoord = { x: belowRightCoord.x, y: belowRightCoord.y };
			} else {
				nextSandCoord = { x: currentSandCoord.x, y: currentSandCoord.y };
			}

			// Detect if resting
			// If not resting, move currentSandCoord to nextSandCoord
			if (nextSandCoord.x === currentSandCoord.x && nextSandCoord.y === currentSandCoord.y) {
				isSandResting = true;
				sandCoords.push(currentSandCoord);
			} else {
				currentSandCoord = { x: nextSandCoord.x, y: nextSandCoord.y };
			}

			// Detect if falling out of bounds
			// If floor is added (Part 2), check if sand is blocked at starting point
			if (currentSandCoord.x === startSandCoord.x && currentSandCoord.y === startSandCoord.y) {
				isSandBlockedAtSource = true;
			} else if (!addFloor && (currentSandCoord.x > maxAxisValues.maxX || currentSandCoord.y > maxAxisValues.maxY)) {
				isSandFallingOutOfBounds = true;
			}
		}
	}
	return sandCoords;
};

const rockCoords: Coord[] = [];
const startSandCoord: Coord = { x: 500, y: 0 };

inputArray.map((line) => {
	const lineCoords = parseCoordsFromInputLine(line);
	lineCoords.map((coord) => {
		rockCoords.push(coord);
	});
});
const sandCoords = simulateFallingSand(startSandCoord, rockCoords);
// Render map
// renderMapFromCoords([
// 	{ coords: rockCoords, char: '#' },
// 	{ coords: sandCoords, char: 'o' }
// ]);
const totalUnitsOfSand = sandCoords.length;
console.log('totalUnitsOfSand', totalUnitsOfSand);

// Part 2
// Add floor that is 2 units past maxY spanning all X
const maxAxisValues = findMaxAxisValuesFromCoords(rockCoords);
const sandCoords2 = simulateFallingSand(startSandCoord, rockCoords, true);

// Render map
const floorCoords: Coord[] = Array.from(Array(maxAxisValues.maxX - maxAxisValues.minX), (_, index) => {
	return { x: maxAxisValues.minX + index, y: maxAxisValues.maxY + 2 };
});
renderMapFromCoords([
	{ coords: rockCoords, char: '#' },
	{ coords: sandCoords2, char: 'o' },
	{ coords: floorCoords, char: '#' }
]);
const totalUnitsOfSand2 = sandCoords2.length;
console.log('totalUnitsOfSand2', totalUnitsOfSand2);
