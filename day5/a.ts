const input = await Deno.readTextFile('day5/input.txt');
const inputArray = input.split('\n');

// Part 1
// Create stacks (arrays) from bottom row to top row
const rows = inputArray.slice(0, 8);
const initialStacks: string[][] = [];

// Start with rows 8 down to row 1 and push character into stack
for (let rowIndex = 7; rowIndex >= 0; rowIndex--) {
	for (let stackIndex = 0; stackIndex < 9; stackIndex++) {
		if (rows[rowIndex][stackIndex * 4 + 1] !== ' ') {
			if (initialStacks[stackIndex]) {
				initialStacks[stackIndex].push(rows[rowIndex][stackIndex * 4 + 1]);
			} else {
				initialStacks[stackIndex] = [rows[rowIndex][stackIndex * 4 + 1]];
			}
		}
	}
}

// Parse instructions as tuple [amount, fromRow, toRow]
const instructions = inputArray.slice(10).map((instructionText) => {
	const instructionArray = instructionText.split(' ');
	return [Number(instructionArray[1]), Number(instructionArray[3]), Number(instructionArray[5])] as const;
});

// Carry out instructions moving one crate at a time
const stacks1 = [...initialStacks.map((initialStack) => [...initialStack])];
instructions.map((instruction) => {
	for (let i = 0; i < instruction[0]; i++) {
		const crateToBeMoved = stacks1[instruction[1] - 1].pop();
		if (crateToBeMoved) {
			stacks1[instruction[2] - 1].push(crateToBeMoved);
		}
	}
});

// Print out top stack
const topCratesByStacks = stacks1.map((stack) => stack[stack.length - 1]).join('');
console.log('topCratesByStacks', topCratesByStacks);

// Part 2
// Carry out instructions if multiple crates could be moved at once
const stacks2 = [...initialStacks.map((initialStack) => [...initialStack])];
instructions.map((instruction) => {
	const fromStack = stacks2[instruction[1] - 1];
	const cratesToBeMoved = fromStack.splice(fromStack.length - instruction[0], instruction[0]);
	stacks2[instruction[2] - 1].push(...cratesToBeMoved);
});

// Print out top stack
const topCratesByStacks2 = stacks2.map((stack) => stack[stack.length - 1]).join('');
console.log('topCratesByStacks2', topCratesByStacks2);
