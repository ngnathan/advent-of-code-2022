const input = await Deno.readTextFile('day8/input.txt');

// Part 1
// Calculate visibility of each tree from the edge

// Create 2d matrix that allows you to search across all directions
const matrix = input.split('\n').map((inputLine) => inputLine.split(''));

// Iterate through each row
// Per row, iterate through each column
// Per tree, if edge, it is visible
// Per tree, look up, down, left, right to determine if there is another tree bigger.
// If bigger tree is found, it is not visible by that edge
// If still visible by any edge, it is visible

let numOfTreesVisibleFromOutside = 0;
for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
	for (let columnIndex = 0; columnIndex < matrix[rowIndex].length; columnIndex++) {
		// If edge, add to visible counter
		if (rowIndex === 0 || rowIndex === matrix.length - 1 || columnIndex === 0 || columnIndex === matrix[rowIndex].length - 1) {
			numOfTreesVisibleFromOutside = numOfTreesVisibleFromOutside + 1;
		} else {
			const treeHeight = matrix[rowIndex][columnIndex];
			let visibleFromAbove = true;
			let visibleFromBelow = true;
			let visibleFromLeft = true;
			let visibleFromRight = true;
			// Look up and down
			for (let lookUpRowIndex = 0; lookUpRowIndex < matrix.length; lookUpRowIndex++) {
				const comparedTreeHeight = matrix[lookUpRowIndex][columnIndex];
				if (comparedTreeHeight >= treeHeight && lookUpRowIndex < rowIndex) {
					visibleFromAbove = false;
				} else if (comparedTreeHeight >= treeHeight && lookUpRowIndex > rowIndex) {
					visibleFromBelow = false;
				}
			}
			// Look left and right
			for (let lookUpColumnIndex = 0; lookUpColumnIndex < matrix[rowIndex].length; lookUpColumnIndex++) {
				const comparedTreeHeight = matrix[rowIndex][lookUpColumnIndex];
				if (comparedTreeHeight >= treeHeight && lookUpColumnIndex < columnIndex) {
					visibleFromLeft = false;
				} else if (comparedTreeHeight >= treeHeight && lookUpColumnIndex > columnIndex) {
					visibleFromRight = false;
				}
			}
			// Evaluate if visible from outside
			if (visibleFromAbove || visibleFromBelow || visibleFromLeft || visibleFromRight) {
				numOfTreesVisibleFromOutside = numOfTreesVisibleFromOutside + 1;
			}
		}
	}
}

console.log('numOfTreesVisibleFromOutside', numOfTreesVisibleFromOutside);

// Part 2
// Iterate through each row
// Per row, iterate through each column
// Per tree, look up, down, left, right to determine if there is another tree bigger or equal and increment counter.
// If bigger or equal tree is found, count that tree, and then stop counting
// Calculate scenic score by multiplying all trees visible together

let highestTotalScenicScore = 0;
for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
	for (let columnIndex = 0; columnIndex < matrix[rowIndex].length; columnIndex++) {
		const treeHeight = matrix[rowIndex][columnIndex];
		let numTreesVisibleAbove = 0;
		let numTreesVisibleBelow = 0;
		let numTreesVisibleLeft = 0;
		let numTreesVisibleRight = 0;

		// Per tree, look up, down, left, right to determine if there is another tree bigger or equal and increment counter.
		// Use two counters (one to include the tall tree, one to stop)

		// Look up
		let tallTreeFound = false;
		let isTreeVisible = true;
		for (let lookUpRowIndex = rowIndex - 1; lookUpRowIndex >= 0; lookUpRowIndex--) {
			const comparedTreeHeight = matrix[lookUpRowIndex][columnIndex];
			if (isTreeVisible) {
				if (tallTreeFound) {
					isTreeVisible = false;
				} else if (!tallTreeFound && comparedTreeHeight < treeHeight) {
					numTreesVisibleAbove = numTreesVisibleAbove + 1;
				} else {
					numTreesVisibleAbove = numTreesVisibleAbove + 1;
					tallTreeFound = true;
				}
			}
		}
		// Look down
		tallTreeFound = false;
		isTreeVisible = true;
		for (let lookUpRowIndex = rowIndex + 1; lookUpRowIndex < matrix.length; lookUpRowIndex++) {
			const comparedTreeHeight = matrix[lookUpRowIndex][columnIndex];
			if (isTreeVisible) {
				if (tallTreeFound) {
					isTreeVisible = false;
				} else if (!tallTreeFound && comparedTreeHeight < treeHeight) {
					numTreesVisibleBelow = numTreesVisibleBelow + 1;
				} else {
					numTreesVisibleBelow = numTreesVisibleBelow + 1;
					tallTreeFound = true;
				}
			}
		}
		// Look left
		tallTreeFound = false;
		isTreeVisible = true;
		for (let lookUpColumnIndex = columnIndex - 1; lookUpColumnIndex >= 0; lookUpColumnIndex--) {
			const comparedTreeHeight = matrix[rowIndex][lookUpColumnIndex];
			if (isTreeVisible) {
				if (tallTreeFound) {
					isTreeVisible = false;
				} else if (!tallTreeFound && comparedTreeHeight < treeHeight) {
					numTreesVisibleLeft = numTreesVisibleLeft + 1;
				} else {
					numTreesVisibleLeft = numTreesVisibleLeft + 1;
					tallTreeFound = true;
				}
			}
		}
		// Look right
		tallTreeFound = false;
		isTreeVisible = true;
		for (let lookUpColumnIndex = columnIndex + 1; lookUpColumnIndex < matrix[rowIndex].length; lookUpColumnIndex++) {
			const comparedTreeHeight = matrix[rowIndex][lookUpColumnIndex];
			if (isTreeVisible) {
				if (tallTreeFound) {
					isTreeVisible = false;
				} else if (!tallTreeFound && comparedTreeHeight < treeHeight) {
					numTreesVisibleRight = numTreesVisibleRight + 1;
				} else {
					numTreesVisibleRight = numTreesVisibleRight + 1;
					tallTreeFound = true;
				}
			}
		}
		// Calculate Scenic Score
		const totalScenicScore = numTreesVisibleAbove * numTreesVisibleBelow * numTreesVisibleLeft * numTreesVisibleRight;
		if (totalScenicScore > highestTotalScenicScore) {
			highestTotalScenicScore = totalScenicScore;
		}
	}
}

console.log('highestTotalScenicScore', highestTotalScenicScore);
