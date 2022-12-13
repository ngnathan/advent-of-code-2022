const input = await Deno.readTextFile('day12/input.txt');

// Part 1
// Track possible steps in elevation to get from S (starting point with elevation a) to E (destination with elevation z)
// Store position as [y, x] (i.e. col, row) with top-left as (0, 0)
// Use Breadth-First-Search to find shortest path

// Types
type Coord = [number, number];

// Initialize
let startPos: Coord = [-1, -1];
let endPos: Coord = [-1, -1];

const heightMap = input.split('\n').map((row, rowIndex) =>
	row.split('').map((char, colIndex) => {
		if (char === 'S') {
			startPos = [rowIndex, colIndex];
			return 0;
		}
		if (char === 'E') {
			endPos = [rowIndex, colIndex];
			return 27;
		}
		return char.charCodeAt(0) - 96;
	})
);

const maxRows = heightMap.length;
const maxCols = heightMap[0].length;

// Util functions
const printMap = (map: number[][]) => {
	console.log(map.map((row) => row.join('')).join('\n'));
};

// Implement BFS in reverse

// Track visited nodes
const visited = heightMap.map((row) => row.map(() => false));
// Track shortestPaths from any specific node to the end point (set end point to 0)
const shortestPaths = heightMap.map((row) => row.map(() => Infinity));
shortestPaths[endPos[0]][endPos[1]] = 0;
// Create queue starting with end position
const queue = [endPos];

// Iterate while there are nodes in the queue
// For each node, evaluate neighbough nodes, set shortest path, set visited, and enqueue new nodes
while (queue.length > 0) {
	const currentPos = queue.shift();
	if (!currentPos) {
		continue;
	}
	const [y, x] = currentPos;
	visited[y][x] = true;

	// Set neighbours (u, r, d, l)
	const neighbours: Coord[] = [
		[y - 1, x],
		[y, x + 1],
		[y + 1, x],
		[y, x - 1]
	];

	// Evaluate nodes in each neighbour
	neighbours.map((neighbour) => {
		const [neighbourY, neighbourX] = neighbour;
		if (neighbourY < 0 || neighbourY > maxRows - 1 || neighbourX < 0 || neighbourX > maxCols - 1) return;
		const currentHeight = heightMap[y][x];
		const nextHeight = heightMap[neighbourY][neighbourX];

		// If any of the neighbour node can be hiked to, update shortest path for current node
		if (nextHeight - currentHeight <= 1) {
			const shortestDistance = shortestPaths[neighbourY][neighbourX] + 1;
			const currentShortestDistance = shortestPaths[y][x];
			shortestPaths[y][x] = Math.min(currentShortestDistance, shortestDistance);
		}

		// If neighbour is not visited, and is a possible next step, set visited and enqueue current node to be evaluated
		if (!visited[neighbourY][neighbourX] && nextHeight - currentHeight >= -1) {
			queue.push(neighbour);
			visited[neighbourY][neighbourX] = true;
		}
	});
}

console.log('shortestPaths', shortestPaths[startPos[0]][startPos[1]]);

// Part 2
// Evaluate shortest path from any point with elevation a (height 1)
let shortestPathFromLowestElevation: number = shortestPaths[startPos[0]][startPos[1]];
const lowestElevationNodes: Coord[] = [];
heightMap.map((row, rowIndex) =>
	row.map((height, colIndex) => {
		if (height === 1) lowestElevationNodes.push([rowIndex, colIndex]);
	})
);

lowestElevationNodes.map((node) => {
	const [y, x] = node;
	const shortestPath = shortestPaths[y][x];
	if (shortestPath < shortestPathFromLowestElevation) {
		shortestPathFromLowestElevation = shortestPath;
	}
});

console.log('shortestPathFromLowestElevation', shortestPathFromLowestElevation);
