const input = await Deno.readTextFile('day6/input.txt');

// Part 1
// Find first sequence of 4 unique characters
// Use a stack to keep track of the 4 characters as the string is being iterated through
const fourCharsArray: string[] = [];
let uniqueFourCharsIndex = -1;
for (let i = 0; i < input.length; i++) {
	const char = input[i];
	// Update array
	fourCharsArray.unshift(char);
	if (fourCharsArray.length > 4) {
		fourCharsArray.pop();
		// Determine if array has duplicates
		const hasDuplicateLetters = fourCharsArray.some((_char) => fourCharsArray.indexOf(_char) !== fourCharsArray.lastIndexOf(_char));
		if (!hasDuplicateLetters) {
			uniqueFourCharsIndex = i;
			break;
		}
	}
}

// Set marker to the char after the unique four chars index
const marker = uniqueFourCharsIndex + 1;
console.log('marker', marker);

// Part 2
// Find 14 distinct characters
const fourteenCharsArray: string[] = [];
let uniqueFourteenCharsIndex = -1;
for (let i = 0; i < input.length; i++) {
	const char = input[i];
	// Update array
	fourteenCharsArray.unshift(char);
	if (fourteenCharsArray.length > 14) {
		fourteenCharsArray.pop();
		// Determine if array has duplicates
		const hasDuplicateLetters = fourteenCharsArray.some(
			(_char) => fourteenCharsArray.indexOf(_char) !== fourteenCharsArray.lastIndexOf(_char)
		);
		if (!hasDuplicateLetters) {
			uniqueFourteenCharsIndex = i;
			break;
		}
	}
}

// Set marker to the char after the unique four chars index
const marker2 = uniqueFourteenCharsIndex + 1;
console.log('marker2', marker2);
