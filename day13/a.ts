const input = await Deno.readTextFile('day13/input.txt');

// Part 1
// Store indices that are in the right order

// Initialize
type List = (number | List)[];
const indices: number[] = [];
const pairs = input.split('\n\n');

// Parse lists
// Assumes list include opening "[" and "]"
const parseItemsFromItemInput = (itemInput: string): number | List => {
	// Base case
	// If "[]", return empty array
	if (itemInput === '[]') return [];
	// If number, return number;
	else if (!isNaN(Number(itemInput))) return Number(itemInput);
	// If array of numbers, return number[];
	else if (!itemInput.slice(1).includes('[') && !itemInput.slice(0, itemInput.length - 1).includes(']')) {
		const itemsArray = itemInput.slice(1, itemInput.length - 1).split(',');
		const numbers: number[] = itemsArray.map((item) => Number(item));
		return numbers;
	}
	// If array of mixed data in a list, return List
	else if (itemInput[0] === '[' && itemInput[itemInput.length - 1] === ']') {
		// Determine whether next item is a number or List
		const listArray: string[] = [];
		const list: number | List = [];
		const slicedInput = itemInput.slice(1, itemInput.length - 1);
		let queue = '';
		let numOfOpeningBrackets = 0;
		let numOfClosingBrackets = 0;

		slicedInput.split('').map((char, charIndex) => {
			// If char is "[", iterate until you find a matching "]"
			// Calculate number of opening and closing brackets to ensure we have equal amounts
			if (char === '[') {
				numOfOpeningBrackets = numOfOpeningBrackets + 1;
				queue = queue.concat(char);
			} else if (char === ']') {
				numOfClosingBrackets = numOfClosingBrackets + 1;
				queue = queue.concat(char);
				// Close out list
				if (numOfOpeningBrackets === numOfClosingBrackets) {
					listArray.push(queue);
					queue = '';
					numOfOpeningBrackets = 0;
					numOfClosingBrackets = 0;
				}
			}

			// Close out number, or keep comma as part of a list, or don't do anything (would be omitted)
			else if (char === ',') {
				if (queue.length > 0) {
					if (queue[0] === '[') {
						queue = queue.concat(char);
					} else {
						listArray.push(queue);
						queue = '';
					}
				}
			}
			// Push to queue
			else {
				queue = queue.concat(char);
			}
		});
		// Process leftover items in queue
		if (queue.length > 0) {
			if (!isNaN(Number(queue))) {
				listArray.push(queue);
			}
		}
		listArray.map((item) => {
			const parsedItems = parseItemsFromItemInput(item);
			if (typeof parsedItems === 'number') {
				list.push(parsedItems);
			} else {
				list.push(parsedItems);
			}
		});
		return list;
	}
	return [];
};

// Compare items
// Compare left / right integers (left === right ? undefined : left < right)
// Compare left / right lists
// If comparison is found, no need to go through the rest of the list
// Compared mixed types, converting integers to lists and comparing the resulting lists

const compareItems = (left: number | List, right: number | List, showComments?: boolean): boolean | undefined => {
	let isPairInCorrectOrder: boolean | undefined = undefined;

	// Compare left / right integers (left === right ? undefined : left < right)
	if (typeof left === 'number' && typeof right === 'number') {
		if (left === right) isPairInCorrectOrder = undefined;
		else isPairInCorrectOrder = left < right;
	}
	// Compare left and right lists
	else if (typeof left !== 'number' && typeof right !== 'number') {
		// If comparison is found, no need to iterate through the rest of the list
		let isComparisonFound = false;
		left.map((leftItem, leftIndex) => {
			if (isComparisonFound) return;
			const rightItem = right[leftIndex];
			// If right side has run out of items, pair is not in correct order
			if (rightItem === undefined) {
				isPairInCorrectOrder = false;
			}
			// Compare left and right lists recursively
			else {
				const comparedItems = compareItems(leftItem, rightItem);
				if (comparedItems !== undefined) {
					isComparisonFound = true;
					isPairInCorrectOrder = comparedItems;
				}
			}
		});
		// If left side has run out of items, pair is in correct order
		if (!isComparisonFound && left.length < right.length) {
			isPairInCorrectOrder = true;
		}
	}
	// Compared mixed types, converting integers to lists and comparing the resulting lists
	else {
		if (typeof left !== 'number') {
			isPairInCorrectOrder = compareItems(left, [right]);
		} else if (typeof right !== 'number') {
			isPairInCorrectOrder = compareItems([left], right);
		}
	}
	return isPairInCorrectOrder;
};

// For each pair:
// Compare items in first and second arrays to determine if they are in the right order
// Convert mixed types from number to array if necessary
pairs.map((pair, pairIndex) => {
	const pairArray = pair.split('\n');
	if (!pairArray || pairArray.length < 2) return;

	let isPairInCorrectOrder: boolean | undefined = true;
	const [leftInput, rightInput] = pairArray;

	// Parse left / right
	if (pairIndex < 200) {
		const left = parseItemsFromItemInput(leftInput);
		const right = parseItemsFromItemInput(rightInput);

		// Assumes root items cannot be a number
		isPairInCorrectOrder = compareItems(left, right);
		if (isPairInCorrectOrder) {
			indices.push(pairIndex + 1);
		}
	}
});

const sumOfIndices = indices.length > 0 ? indices.reduce((acc, value) => acc + value) : 0;
console.log('sumOfIndices', sumOfIndices);

// Part 2
// Sort all packets and insert divider packets [[2]] and [[6]]
// Remove double carriage returns
const packets = input.split('\n\n').join('\n').split('\n');

const distressPacketA = [[2]];
const distressPacketB = [[6]];
let distressPacketAIndex = -1;
let distressPacketBIndex = -1;

const sortedPackets = packets.sort((a, b) => {
	const aList = parseItemsFromItemInput(a);
	const bList = parseItemsFromItemInput(b);
	const comparedItems = compareItems(aList, bList);
	if (comparedItems !== undefined) {
		return comparedItems ? -1 : 1;
	}
	return 0;
});

sortedPackets.map((packet, packetIndex) => {
	const list = parseItemsFromItemInput(packet);
	if (distressPacketAIndex < 0) {
		const comparedItems = compareItems(list, distressPacketA);
		if (comparedItems === false) {
			distressPacketAIndex = packetIndex;
		}
	}
	if (distressPacketBIndex < 0) {
		const comparedItems = compareItems(list, distressPacketB);
		if (comparedItems === false) {
			distressPacketBIndex = packetIndex;
		}
	}
});

if (distressPacketAIndex < 0 || distressPacketBIndex < 0) throw new Error('distress packets not inserted');

// Add 1 index to Packet A and 2 to Packet B due to insertion
const decoderKey = (distressPacketAIndex + 1) * (distressPacketBIndex + 2);
console.log('decoderKey', decoderKey);
