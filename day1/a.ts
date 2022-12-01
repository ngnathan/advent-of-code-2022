const results = await Deno.readTextFile('day1/input.txt');

// Part 1: Get strongest elf
// Get elves
const elves = results.split('\n').reduce((acc, foodItem) => {
	if (foodItem) {
		if (acc.length > 0) {
			const updatedAcc = [...acc];
			updatedAcc[updatedAcc.length - 1] = [...updatedAcc[updatedAcc.length - 1], foodItem];
			return updatedAcc;
		} else {
			return [...acc, [foodItem]];
		}
	} else {
		return [...acc, []];
	}
}, [] as string[][]);

// Find strongest elf
let strongestElfIndex = 0;
let strongestElfCalories = elves[0].reduce((acc, value) => acc + Number(value), 0);
elves.map((elf, index) => {
	const elfCalories = elf.reduce((acc, value) => acc + Number(value), 0);
	if (elfCalories > strongestElfCalories) {
		strongestElfIndex = index;
		strongestElfCalories = elfCalories;
	}
});
console.log('strongestElfIndex', strongestElfIndex);
console.log('strongestElfCalories', strongestElfCalories);

// Part 2: Get top 3 strongest elves
// Sort elves
const elvesSummedCalories = elves.map((elf) => elf.reduce((acc, value) => acc + Number(value), 0));
const sortedElvesByCalories = elvesSummedCalories.sort((a, b) => b - a);
const top3ElvesByCalories = sortedElvesByCalories.slice(0, 3);
const top3ElvesSummedCalories = top3ElvesByCalories.reduce((acc, value) => acc + value, 0);
console.log('top3ElvesByCalories', top3ElvesByCalories);
console.log('top3ElvesSummedCalories', top3ElvesSummedCalories);
