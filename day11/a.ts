const input = await Deno.readTextFile('day11/input.txt');

// Part 1
// Per round of monkeys, per monkey, determine the item worry level, and which monkey the current monkey throws the item to
// Calculate total number of times each monkey inspects items over 20 rounds
// Total monkeys: 8
// Total rounds: 20

// Parse monkey tests
// Assumes monkey numbers are parsed in order

// Parse items
// Assumes the following syntax (example):
// ---
// Starting items: 97, 81, 57, 57, 91, 61
const parseStartingItemsFromInput = (_input: string): number[] => {
	const _inputArray = _input.split(': ');
	if (_inputArray.length < 2) return [];
	const itemsInputArray = _inputArray[1].split(', ');
	const items = itemsInputArray.map((item) => Number(item));
	return items;
};

// Parse operation
// Calculate new worry level
// Assumes input only has + and * operations
// Assumes left side is always "old" and right side can be a number or "old"
// Assumes the following syntax (example):
// ---
// Operation: new = old * 7

const parseOperationFromInput = (_input: string): ['+' | '*', number | 'old'] | undefined => {
	const operationInputArray = _input.split('new = ');
	if (operationInputArray.length < 2) return;
	const operationParams = operationInputArray[1].split(' ');
	if (operationParams.length < 3) return;
	const operation: '+' | '*' | undefined = operationParams[1] === '+' ? '+' : operationParams[1] === '*' ? '*' : undefined;
	if (!operation) return;
	let operand: number | 'old' = 0;
	if (operationParams[2] === 'old') operand = 'old';
	else if (!isNaN(Number(operationParams[2]))) operand = Number(operationParams[2]);
	return [operation, operand];
};

const getUpdatedWorryLevel = (worryLevel: number, operation: '+' | '*', operand: number | 'old') => {
	let updatedWorryLevel = worryLevel;
	if (operation === '+') {
		updatedWorryLevel = worryLevel + (operand === 'old' ? worryLevel : operand);
	} else if (operation === '*') {
		updatedWorryLevel = worryLevel * (operand === 'old' ? worryLevel : operand);
	}
	updatedWorryLevel = Math.floor(updatedWorryLevel / 3);
	return updatedWorryLevel;
};

// Parse test
// Determine which monkey number to throw it to
// Assumes operation is only "divisible by"
// Assumes the following syntax (example)
// ---
// Test: divisible by 11
// If true: throw to monkey 5
// If false: throw to monkey 6

const parseTestFromInput = (_input: string): [number, number, number] | undefined => {
	const inputArray = _input.split('\n');
	if (inputArray.length < 2) return;
	const testInputArray = inputArray[0].split('divisible by ');
	if (testInputArray.length < 2) return;
	const testOperand = Number(testInputArray[1]);
	const trueMonkeyNumberArray = inputArray[1].split('monkey ');
	const falseMonkeyNumberArray = inputArray[2].split('monkey ');
	if (isNaN(testOperand) || trueMonkeyNumberArray.length < 2 || falseMonkeyNumberArray.length < 2) return;
	const trueMonkeyNumber = Number(trueMonkeyNumberArray[1]);
	const falseMonkeyNumber = Number(falseMonkeyNumberArray[1]);

	return [testOperand, trueMonkeyNumber, falseMonkeyNumber];
};

const getThrowToMonkeyNumberFromTest = (worryLevel: number, testOperand: number, trueMonkeyNumber: number, falseMonkeyNumber: number) => {
	const test = worryLevel % testOperand === 0;
	return test ? trueMonkeyNumber : falseMonkeyNumber;
};

// Parse monkey tests
// Store instructions as { startingItems: number[], operation: string, operand: number, testDivisibleBy: number, trueThrowToMonkeyNumber: number, falseThrowToMonkeyNumber: number}
const monkeysInputArray = input.split('\n\n');
const monkeyInstructions = monkeysInputArray.map((monkeyInput) => {
	const monkeyInputArray = monkeyInput.split('\n');
	if (monkeyInputArray.length < 6) return;
	const startingItems = parseStartingItemsFromInput(monkeyInputArray[1]);
	const operationArray = parseOperationFromInput(monkeyInputArray[2]);
	const testArray = parseTestFromInput(monkeyInputArray.slice(3, 6).join('\n'));
	if (!operationArray || !testArray) return;
	const [operation, operand] = operationArray;
	const [testDivisibleBy, trueThrowToMonkeyNumber, falseThrowToMonkeyNumber] = testArray;
	return {
		startingItems,
		operation,
		operand,
		testDivisibleBy,
		trueThrowToMonkeyNumber,
		falseThrowToMonkeyNumber
	};
});

// Iterate through 20 rounds
// Store data as an array of rounds
// Per round, store data as array of monkeys
// Per round, iterate through monkeys to set starting items, and then iterate through monkeys again to process it
// Per monkey, store object of starting items and ending items (so that the next round can reference the end result of the previous round)
// Per monkey, separately store counter for inspected items
const numOfRounds = 20;
const numOfMonkeys = monkeyInstructions.length;

type MonkeyData = {
	startingItems: number[];
	endingItems: number[];
};
type RoundData = MonkeyData[];
const roundsData: RoundData[] = [];
const numOfInspectedItemsByMonkeys: number[] = Array(numOfMonkeys).fill(0);

for (let roundIndex = 0; roundIndex < numOfRounds; roundIndex++) {
	const startingItems: number[][] = [];
	const endingItems: number[][] = [];

	// Set starting items
	// For roundIndex 0, initialize starting items from instructions and initialize ending items
	if (roundIndex === 0) {
		monkeyInstructions.map((monkeyInstruction, monkeyIndex) => {
			if (!monkeyInstruction) return;
			startingItems[monkeyIndex] = [...monkeyInstruction.startingItems];
			endingItems[monkeyIndex] = [];
		});
	} else {
		monkeyInstructions.map((monkeyInstruction, monkeyIndex) => {
			if (!monkeyInstruction || !roundsData[roundIndex - 1][monkeyIndex]) return;
			startingItems[monkeyIndex] = [...roundsData[roundIndex - 1][monkeyIndex].endingItems];
			endingItems[monkeyIndex] = [];
		});
	}

	// Process each monkey
	monkeyInstructions.map((monkeyInstruction, monkeyIndex) => {
		if (!monkeyInstruction || !startingItems[monkeyIndex]) return;

		// Iterate through starting items (worry levels)
		// Calculate updated worry level
		// Throw to monkey
		startingItems[monkeyIndex].map((worryLevel) => {
			const updatedWorryLevel = getUpdatedWorryLevel(worryLevel, monkeyInstruction.operation, monkeyInstruction.operand);
			if (updatedWorryLevel === undefined) return;
			const throwToMonkeyNumber = getThrowToMonkeyNumberFromTest(
				updatedWorryLevel,
				monkeyInstruction.testDivisibleBy,
				monkeyInstruction.trueThrowToMonkeyNumber,
				monkeyInstruction.falseThrowToMonkeyNumber
			);
			if (!endingItems[throwToMonkeyNumber]) return;
			if (throwToMonkeyNumber > monkeyIndex) {
				startingItems[throwToMonkeyNumber].push(updatedWorryLevel);
			} else {
				endingItems[throwToMonkeyNumber].push(updatedWorryLevel);
			}
			numOfInspectedItemsByMonkeys[monkeyIndex] = numOfInspectedItemsByMonkeys[monkeyIndex] + 1;
		});
	});

	// Set starting and ending items per round
	for (let monkeyIndex = 0; monkeyIndex < numOfMonkeys; monkeyIndex++) {
		if (roundsData[roundIndex]) {
			roundsData[roundIndex].push({
				startingItems: startingItems[monkeyIndex] ?? [],
				endingItems: endingItems[monkeyIndex] ?? []
			});
		} else {
			roundsData[roundIndex] = [
				{
					startingItems: startingItems[monkeyIndex] ?? [],
					endingItems: endingItems[monkeyIndex] ?? []
				}
			];
		}
	}
}

const sortedNumOfInspectedItemsByMonkeys = numOfInspectedItemsByMonkeys.sort((a, b) => b - a);
const monkeyBusiness = sortedNumOfInspectedItemsByMonkeys[0] * sortedNumOfInspectedItemsByMonkeys[1];
console.log('monkeyBusiness', monkeyBusiness);

// Part 2
// Reduction in worry levels is no longer divided by 3
// Instead of handling bigint math, because tests are based on modulo, you can use store the modulus of the worry levels that all tests could possibly run against
// Easiest way is to find the GCD (multiplying all test numbers together)
// Modify updated worry level to use the modulo of the GCD
const mod = monkeyInstructions.reduce((acc, monkeyInstruction) => acc * (monkeyInstruction ? monkeyInstruction.testDivisibleBy : 0), 1);

const getUpdatedWorryLevel2 = (worryLevel: number, operation: '+' | '*', operand: number | 'old') => {
	let updatedWorryLevel = worryLevel;
	if (operation === '+') {
		updatedWorryLevel = worryLevel + ((operand === 'old' ? worryLevel : operand) % mod);
	} else if (operation === '*') {
		updatedWorryLevel = (worryLevel * (operand === 'old' ? worryLevel : operand)) % mod;
	}
	return updatedWorryLevel;
};

const numOfRounds2 = 10000;
const roundsData2: RoundData[] = [];
const numOfInspectedItemsByMonkeys2: number[] = Array(numOfMonkeys).fill(0);

for (let roundIndex = 0; roundIndex < numOfRounds2; roundIndex++) {
	const startingItems: number[][] = [];
	const endingItems: number[][] = [];

	// Set starting items
	// For roundIndex 0, initialize starting items from instructions and initialize ending items
	if (roundIndex === 0) {
		monkeyInstructions.map((monkeyInstruction, monkeyIndex) => {
			if (!monkeyInstruction) return;
			startingItems[monkeyIndex] = [...monkeyInstruction.startingItems];
			endingItems[monkeyIndex] = [];
		});
	} else {
		monkeyInstructions.map((monkeyInstruction, monkeyIndex) => {
			if (!monkeyInstruction || !roundsData2[roundIndex - 1][monkeyIndex]) return;
			startingItems[monkeyIndex] = [...roundsData2[roundIndex - 1][monkeyIndex].endingItems];
			endingItems[monkeyIndex] = [];
		});
	}

	// Process each monkey
	monkeyInstructions.map((monkeyInstruction, monkeyIndex) => {
		if (!monkeyInstruction || !startingItems[monkeyIndex]) return;

		// Iterate through starting items (worry levels)
		// Calculate updated worry level
		// Throw to monkey
		startingItems[monkeyIndex].map((worryLevel) => {
			const updatedWorryLevel = getUpdatedWorryLevel2(worryLevel, monkeyInstruction.operation, monkeyInstruction.operand);
			if (updatedWorryLevel === undefined) return;
			const throwToMonkeyNumber = getThrowToMonkeyNumberFromTest(
				updatedWorryLevel,
				monkeyInstruction.testDivisibleBy,
				monkeyInstruction.trueThrowToMonkeyNumber,
				monkeyInstruction.falseThrowToMonkeyNumber
			);
			if (!endingItems[throwToMonkeyNumber]) return;
			if (throwToMonkeyNumber > monkeyIndex) {
				startingItems[throwToMonkeyNumber].push(updatedWorryLevel);
			} else {
				endingItems[throwToMonkeyNumber].push(updatedWorryLevel);
			}
			numOfInspectedItemsByMonkeys2[monkeyIndex] = numOfInspectedItemsByMonkeys2[monkeyIndex] + 1;
		});
	});

	// Set starting and ending items per round
	for (let monkeyIndex = 0; monkeyIndex < numOfMonkeys; monkeyIndex++) {
		if (roundsData2[roundIndex]) {
			roundsData2[roundIndex].push({
				startingItems: startingItems[monkeyIndex] ?? [],
				endingItems: endingItems[monkeyIndex] ?? []
			});
		} else {
			roundsData2[roundIndex] = [
				{
					startingItems: startingItems[monkeyIndex] ?? [],
					endingItems: endingItems[monkeyIndex] ?? []
				}
			];
		}
	}
}

const sortedNumOfInspectedItemsByMonkeys2 = numOfInspectedItemsByMonkeys2.sort((a, b) => b - a);
const monkeyBusiness2 = sortedNumOfInspectedItemsByMonkeys2[0] * sortedNumOfInspectedItemsByMonkeys2[1];
console.log('monkeyBusiness2', monkeyBusiness2);
