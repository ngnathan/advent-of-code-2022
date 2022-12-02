const rounds = await Deno.readTextFile('day2/input.txt');

// Assumes input does not have any unaccepted characters other than A, B, C, X, Y, Z
// Therefore, we can typecast the input to the accepted characters

const getShapeScore = (shape: 'rock' | 'paper' | 'scissors') => {
	switch (shape) {
		case 'rock':
			return 1;
		case 'paper':
			return 2;
		case 'scissors':
			return 3;
		default:
			break;
	}
};

const getShapeByLetter = (letter: 'A' | 'B' | 'C' | 'X' | 'Y' | 'Z') => {
	switch (letter) {
		case 'A':
			return 'rock';
		case 'B':
			return 'paper';
		case 'C':
			return 'scissors';
		case 'X':
			return 'rock';
		case 'Y':
			return 'paper';
		case 'Z':
			return 'scissors';
		default:
			break;
	}
};

const getRoundResult = (opponentShape: 'rock' | 'paper' | 'scissors', yourShape: 'rock' | 'paper' | 'scissors') => {
	switch (opponentShape) {
		case 'rock':
			switch (yourShape) {
				case 'rock':
					return 'draw';
				case 'paper':
					return 'win';
				case 'scissors':
					return 'lose';
				default:
					break;
			}
			break;
		case 'paper':
			switch (yourShape) {
				case 'rock':
					return 'lose';
				case 'paper':
					return 'draw';
				case 'scissors':
					return 'win';
				default:
					break;
			}
			break;
		case 'scissors':
			switch (yourShape) {
				case 'rock':
					return 'win';
				case 'paper':
					return 'lose';
				case 'scissors':
					return 'draw';
				default:
					break;
			}
			break;
	}
};

const getRoundScore = (result: 'lose' | 'draw' | 'win') => {
	switch (result) {
		case 'win':
			return 6;
		case 'draw':
			return 3;
		case 'lose':
			return 0;
	}
};

// Part 1: Get total score for all rounds
// Assumes second column is the shape needed to win
// Put all scores in an array
const scores = rounds.split('\n').map((round) => {
	const [opponentLetter, yourLetter] = round.split(' ');
	const opponentShape = getShapeByLetter(opponentLetter as 'A' | 'B' | 'C');
	const yourShape = getShapeByLetter(yourLetter as 'X' | 'Y' | 'Z');
	if (!opponentShape || !yourShape) return 0;
	const yourShapeScore = getShapeScore(yourShape);
	const roundResult = getRoundResult(opponentShape, yourShape);

	if (!yourShapeScore || !roundResult) return 0;
	const roundScore = getRoundScore(roundResult);
	const totalScore = yourShapeScore + roundScore;
	return totalScore;
});

const totalScore = scores.reduce((acc, value) => acc + value, 0);
console.log('Part 1 - totalScore', totalScore);

// Part 2: Get total score for all rounds
// Assumes second column is the result you need to select

const getResultByResultLetter = (resultLetter: 'X' | 'Y' | 'Z') => {
	switch (resultLetter) {
		case 'X':
			return 'lose';
		case 'Y':
			return 'draw';
		case 'Z':
			return 'win';
	}
};

const getShapeByResult = (opponentShape: 'rock' | 'paper' | 'scissors', result: 'lose' | 'draw' | 'win') => {
	switch (opponentShape) {
		case 'rock':
			switch (result) {
				case 'lose':
					return 'scissors';
				case 'draw':
					return 'rock';
				case 'win':
					return 'paper';
				default:
					break;
			}
			break;
		case 'paper':
			switch (result) {
				case 'lose':
					return 'rock';
				case 'draw':
					return 'paper';
				case 'win':
					return 'scissors';
				default:
					break;
			}
			break;
		case 'scissors':
			switch (result) {
				case 'lose':
					return 'paper';
				case 'draw':
					return 'scissors';
				case 'win':
					return 'rock';
				default:
					break;
			}
			break;
	}
};

const scores2 = rounds.split('\n').map((round) => {
	const [opponentLetter, resultLetter] = round.split(' ');
	const opponentShape = getShapeByLetter(opponentLetter as 'A' | 'B' | 'C');
	if (!opponentShape) return 0;
	const result = getResultByResultLetter(resultLetter as 'X' | 'Y' | 'Z');
	const yourShape = getShapeByResult(opponentShape, result);
	if (!yourShape) return 0;
	const yourShapeScore = getShapeScore(yourShape);
	if (!yourShapeScore) return 0;
	const roundScore = getRoundScore(result);
	const totalScore = yourShapeScore + roundScore;
	return totalScore;
});

const totalScore2 = scores2.reduce((acc, value) => acc + value, 0);
console.log('Part 2 - totalScores2', totalScore2);
