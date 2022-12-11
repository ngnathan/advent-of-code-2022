const input = await Deno.readTextFile('day10/input.txt');

// Part 1
// Calculate register values for each cycle
// Store register values as [startValue, duringExecutionValue, afterExecutionValue]
// Register starts at value 1

const instructions = input.split('\n');
const registerValues: [number, number, number][] = instructions.reduce((acc, instruction) => {
	const instructionArray = instruction.split(' ');
	if (instructionArray.length > 2) return acc;
	const command = instructionArray[0];
	if (command !== 'noop' && command !== 'addx') return acc;

	// Retrieve previous value
	const prevRegisterValue = acc.length > 1 ? acc[acc.length - 1][2] : 1;

	// Process command 'noop'
	if (command === 'noop') {
		return [...acc, [prevRegisterValue, prevRegisterValue, prevRegisterValue]];
	}
	if (instructionArray.length < 1) return acc;

	// Process command 'addx'
	const value = Number(instructionArray[1]);
	if (isNaN(value)) return acc;
	return [
		...acc,
		[prevRegisterValue, prevRegisterValue, prevRegisterValue],
		[prevRegisterValue, prevRegisterValue, prevRegisterValue + value]
	];
}, [] as [number, number, number][]);

// Calculate signal strengths (cycleNumber * value) *during* cycles: 20, 60, 100, 140, 180, 220
// Sum signal strengths
const cycleNumbers = [20, 60, 100, 140, 180, 220];
const sumOfSignalStrengths = cycleNumbers.reduce((acc, cycleNumber) => {
	if (registerValues.length < cycleNumber || !registerValues[cycleNumber]) return acc;
	// Use duringExecutionValue (i.e. array position index 1)
	const signalStrength = cycleNumber * registerValues[cycleNumber - 1][1];
	return acc + signalStrength;
}, 0);

console.log('sumOfSignalStrengths', sumOfSignalStrengths);
console.log('---------');

// Part 2
// During each cycle of the CRT Scan, determine whether the sprite position (Register X) is visible.
// Each CRT row has 40 pixels (rendered by 40 cycles)
// The sprite position is 3 pixels wide (Register X position - 1, Register X position, Register X position + 1)

const renderedRows: boolean[][] = registerValues.reduce((acc, registerValue, index) => {
	const positionInRow = index % 40;
	const spritePosition = registerValue[1];
	let isPixelVisible = false;
	if (positionInRow >= spritePosition - 1 && positionInRow <= spritePosition + 1) {
		isPixelVisible = true;
	}
	// New row
	if (positionInRow === 0) {
		return [...acc, [isPixelVisible]];
	}
	// Existing row
	else {
		const updatedAcc = [...acc];
		const lastItem = updatedAcc[updatedAcc.length - 1];
		lastItem.push(isPixelVisible);
		return updatedAcc;
	}
}, [] as boolean[][]);

renderedRows.map((renderedRow) => console.log(renderedRow.map((isPixelVisible) => (isPixelVisible ? '#' : ' ')).join('')));
