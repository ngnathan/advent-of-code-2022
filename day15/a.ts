const input = await Deno.readTextFile('day15/input.txt');
const inputArray = input.split('\n');

// Part 1
// Find all positions in any given line where there are no possible distress signal sources

// Types
type Coord = {
	x: number;
	y: number;
};
type SensorBeaconPairPosition = {
	sensorPosition: Coord;
	beaconPosition: Coord;
};
type Interval = {
	startX: number;
	endX: number;
};
type MaxAxisValues = { minY: number; minX: number; maxY: number; maxX: number };

// Helpers
const parseCoordsFromInputLine = (inputLine: string): [Coord, Coord] => {
	const inputLineArray = inputLine.split(' ');
	const sensorX = inputLineArray[2].slice(2, inputLineArray[2].length - 1);
	const sensorY = inputLineArray[3].slice(2, inputLineArray[3].length - 1);
	const beaconX = inputLineArray[8].slice(2, inputLineArray[8].length - 1);
	const beaconY = inputLineArray[9].slice(2, inputLineArray[9].length);
	const sensorPosition: Coord = { x: Number(sensorX), y: Number(sensorY) };
	const beaconPosition: Coord = { x: Number(beaconX), y: Number(beaconY) };
	return [sensorPosition, beaconPosition];
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
		maxX,
	};
};

const renderMapFromCoords = (coordsGroups: { coords: Coord[]; char: string }[]) => {
	let maxAxisValues: MaxAxisValues = {
		minY: Infinity,
		minX: Infinity,
		maxY: 0,
		maxX: 0,
	};
	coordsGroups.map((coordGroup) => {
		const values = findMaxAxisValuesFromCoords(coordGroup.coords);
		maxAxisValues = {
			minY: Math.min(values.minY, maxAxisValues.minY),
			minX: Math.min(values.minX, maxAxisValues.minX),
			maxY: Math.max(values.maxY, maxAxisValues.maxY),
			maxX: Math.max(values.maxX, maxAxisValues.maxX),
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

// For each sensor and beacon pair, determine distance and whether it intersects with given row
// Use distance to determine, for given row, the possible intervals that the sensor covers
const getPossibleIntervals = (sensorBeaconPairPositions: SensorBeaconPairPosition[], row: number) => {
	const intervals: Interval[] = [];
	sensorBeaconPairPositions.map((sensorBeaconPairPosition) => {
		const yDiff = sensorBeaconPairPosition.sensorPosition.y - sensorBeaconPairPosition.beaconPosition.y;
		const xDiff = sensorBeaconPairPosition.sensorPosition.x - sensorBeaconPairPosition.beaconPosition.x;
		const distance = Math.abs(yDiff) + Math.abs(xDiff);
		if (sensorBeaconPairPosition.sensorPosition.y - distance <= row && sensorBeaconPairPosition.sensorPosition.y + distance >= row) {
			const yDistance = Math.abs(sensorBeaconPairPosition.sensorPosition.y - row);
			const xDistance = Math.abs(distance - yDistance);
			const rowStartX = sensorBeaconPairPosition.sensorPosition.x - xDistance;
			const rowEndX = sensorBeaconPairPosition.sensorPosition.x + xDistance;
			intervals.push({ startX: rowStartX, endX: rowEndX });
		}
	});
	return intervals;
};

// Merge intervals
// Sort, then determine compare endX
const mergeIntervals = (intervals: Interval[]): Interval[] => {
	let updatedIntervals = [...intervals];
	updatedIntervals.sort((a, b) => a.startX - b.startX);
	updatedIntervals = updatedIntervals.reduce((acc, interval) => {
		if (acc.length < 1) return [interval];
		const updatedAcc = [...acc];
		const prevInterval = updatedAcc[updatedAcc.length - 1];
		if (interval.endX >= prevInterval.endX && interval.startX <= prevInterval.endX + 1) {
			prevInterval.endX = interval.endX;
		} else if (interval.startX > prevInterval.endX) {
			updatedAcc.push(interval);
		}
		return updatedAcc;
	}, [] as Interval[]);
	return updatedIntervals;
};

// Inputs
const givenRow = 2000000;

// Implementation
const sensorPositions: Coord[] = [];
const beaconPositions: Coord[] = [];
const sensorBeaconPairPositions: SensorBeaconPairPosition[] = [];
let givenRowIntervals: Interval[] = [];
let givenRowNonBeaconPositionsCounter = 0;

inputArray.map((inputLine) => {
	const [sensorPosition, beaconPosition] = parseCoordsFromInputLine(inputLine);
	sensorPositions.push(sensorPosition);
	sensorBeaconPairPositions.push({
		sensorPosition,
		beaconPosition,
	});
	if (!beaconPositions.find((_beaconPosition) => _beaconPosition.x === beaconPosition.x && _beaconPosition.y === beaconPosition.y)) {
		beaconPositions.push(beaconPosition);
	}
});

// Set all x intervals for every sensor/beacon pair that intersect with givenRow
givenRowIntervals = getPossibleIntervals(sensorBeaconPairPositions, givenRow);

// Merge row intervals
givenRowIntervals = mergeIntervals(givenRowIntervals);

// Determine all intervals for given row and calculate number of non-beacon nodes
// Subtract any beacons on current row
givenRowIntervals.map((interval) => {
	givenRowNonBeaconPositionsCounter = givenRowNonBeaconPositionsCounter + interval.endX - interval.startX + 1;
});
beaconPositions.map((beaconPosition) => {
	if (beaconPosition.y === givenRow) {
		givenRowNonBeaconPositionsCounter = givenRowNonBeaconPositionsCounter - 1;
	}
});

// Render for sample only
// renderMapFromCoords([
// 	{ coords: sensorPositions, char: 'S' },
// 	{ coords: beaconPositions, char: 'B' },
// ]);

console.log('givenRowNonBeaconPositionsCounter', givenRowNonBeaconPositionsCounter);

// Part 2
// For each row, determine possible beacon locations
const minCoord = 0;
const maxCoord = 4000000;
const distressSignalPosition: Coord[] = [];

for (let y = minCoord; y < maxCoord; y++) {
	let givenRowIntervals2: Interval[] = [];

	// Set all x intervals for every sensor/beacon pair that intersect with givenRow
	givenRowIntervals2 = getPossibleIntervals(sensorBeaconPairPositions, y);

	// Merge row intervals
	// Sort, then determine compare endX
	givenRowIntervals2 = mergeIntervals(givenRowIntervals2);

	// Determine if any non-beacon positions are available in row between minCoord and maxCoord
	let prevEndX = minCoord;
	givenRowIntervals2.map((interval, index) => {
		if (interval.endX < minCoord || interval.startX > maxCoord) return;
		// For first element, if start is after minCoord, everything before is available
		if (index < 1) {
			if (interval.startX > minCoord) {
				const coords: Coord[] = Array.from(Array(interval.startX - minCoord), (_, index) => {
					return { x: index, y: y };
				});
				distressSignalPosition.push(...coords);
			}
			prevEndX = interval.endX;
		}
		// Determine if start is greater than previous end
		else if (interval.startX > prevEndX) {
			const startX = prevEndX + 1;
			const endX = interval.startX - 1;
			const coords: Coord[] = Array.from(Array(endX - startX + 1), (_, index) => {
				return { x: startX + index, y: y };
			});
			distressSignalPosition.push(...coords);
			prevEndX = interval.endX;
		}
	});
}

// Assumes only one distress signal found
const tuningFrequency = distressSignalPosition[0].x * maxCoord + distressSignalPosition[0].y;
console.log('tuningFrequency', tuningFrequency);
