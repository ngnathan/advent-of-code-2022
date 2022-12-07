const input = await Deno.readTextFile('day7/input.txt');
const inputArray = input.split('\n');

// Part 1
// From instructions, build directory and file list as a single JS object
// Each folder and file is added to each root folder as a property
// Each embedded folder is also added to the root folder as a property (to help answer the question)

const maxFolderSize = 100000;
const folderSizes: Record<string, number> = {};
let currentFolder = '/';
inputArray.map((outputLine) => {
	// Detect command
	const output = outputLine.split(' ');
	if (!output[0]) return;
	if (output[0] === '$') {
		// Parse command output
		if (output[1] === 'cd') {
			// Parse folder navigation
			if (output[2] === '..') {
				const currentFolderArray = currentFolder.slice(0, currentFolder.length - 1).split('/');
				currentFolderArray.pop();
				currentFolder = currentFolderArray.join('/') + '/';
			} else if (output[2] === '/') {
				currentFolder = '/';
			} else {
				currentFolder = currentFolder + output[2] + '/';
			}
		} else if (output[1] === 'ls') {
			// Do nothing
		}
	}
	// Detect folder output
	else if (output[0] === 'dir') {
		// Do nothing
	}
	// Detect file output
	else if (!isNaN(Number(output[0]))) {
		const fileSize = Number(output[0]);
		// For each parent folder, update parent folder size
		const currentFolderArray = currentFolder.slice(1, currentFolder.length - 1).split('/');
		let currentParentFolder = '/';
		currentFolderArray.map((currentFolderItem) => {
			currentParentFolder = currentParentFolder.concat(currentFolderItem, '/');
			folderSizes[currentParentFolder] = folderSizes[currentParentFolder] ? folderSizes[currentParentFolder] + fileSize : fileSize;
		});
	}
});

// Iterate through filesystem to find directories with total size <= maxFolderSize
const sumOfFolderSizesLessThanMaxFolderSize = Object.entries(folderSizes).reduce(
	(acc, [_, value]) => (value <= maxFolderSize ? acc + value : acc),
	0
);

console.log('sumOfFolderSizesLessThanMaxFolderSize', sumOfFolderSizesLessThanMaxFolderSize);

// Part 2
// Find smallest size of folder that is bigger than the total space
// needed to be have enough space for the ugprade

// Calculate total space needed
const maxSpace = 70000000;
const minSpaceNeeded = 30000000;
const totalFilesystemSize = inputArray.reduce(
	(acc, value) => (isNaN(Number(value.split(' ')[0])) ? acc : acc + Number(value.split(' ')[0])),
	0
);
const totalSpaceNeeded = totalFilesystemSize - (maxSpace - minSpaceNeeded);
if (totalSpaceNeeded <= 0) {
	console.log('filesystem has enough space');
}

// Find smallest size of folder that is bigger than totalSpaceNeeded
const smallestFolderSize = Object.entries(folderSizes).reduce(
	(acc, [_, value]) => (value > totalSpaceNeeded && value < acc ? value : acc),
	totalFilesystemSize
);

console.log('smallestFolderSize', smallestFolderSize);
