// Spelling Bee Game JavaScript

// Game configuration
const gameConfig = {
  minWordLength: 4,
  centerLetter: 'S',
  letters: ['T', 'A', 'R', 'S', 'P', 'I', 'N'],
  pangram: 'PAINS',
  dictionary: [
    'SPIN', 'SPAN', 'SPAT', 'SPIT', 'STAR', 'STIR', 'STRIP', 'STRAP', 'TRAIN', 'TRAP', 'TRIP',
    'TAPS', 'TIPS', 'SNIP', 'SNAP', 'SPAR', 'SPRAIN', 'SPRINT', 'SAINT', 'SATIN', 'STAIN',
    'PAIR', 'PAIN', 'PAINT', 'PANTS', 'PAINS', 'PARTS', 'PINTS', 'PRINT', 'PRINTS', 'RAINS',
    'RAISE', 'RASP', 'RATS', 'RIPS', 'RAPS', 'TAPS', 'TARPS', 'TRAPS', 'TRIPS'
  ]
};

// Game state
const gameState = {
  currentWord: '',
  foundWords: [],
  score: 0,
  rank: 'Beginner',
  maxScore: calculateMaxScore(),
  message: ''
};

// DOM elements
let elements = {};

// Initialize the game
function initGame() {
  // Get DOM elements
  elements = {
    cells: document.querySelectorAll('.cell'),
    currentWord: document.getElementById('current-word'),
    deleteBtn: document.getElementById('delete-btn'),
    enterBtn: document.getElementById('enter-btn'),
    shuffleBtn: document.getElementById('shuffle-btn'),
    hintBtn: document.getElementById('hint-btn'),
    message: document.getElementById('message'),
    wordsList: document.getElementById('words-list'),
    wordCount: document.getElementById('word-count'),
    currentScore: document.getElementById('current-score'),
    currentRank: document.getElementById('current-rank'),
    progress: document.getElementById('progress'),
    menuToggle: document.getElementById('menu-toggle')
  };

  // Add event listeners to letter cells
  elements.cells.forEach(cell => {
    cell.addEventListener('click', () => {
      const letter = cell.getAttribute('data-letter');
      addLetterToWord(letter);
      cell.classList.add('selected');
      setTimeout(() => cell.classList.remove('selected'), 300);
    });
  });

  // Add event listeners to buttons
  elements.deleteBtn.addEventListener('click', deleteLastLetter);
  elements.enterBtn.addEventListener('click', submitWord);
  elements.shuffleBtn.addEventListener('click', shuffleLetters);
  elements.hintBtn.addEventListener('click', showHint);
  elements.menuToggle.addEventListener('click', toggleMenu);

  // Add keyboard support
  document.addEventListener('keydown', handleKeyPress);

  // Update UI
  updateUI();
}

// Add letter to current word
function addLetterToWord(letter) {
  gameState.currentWord += letter;
  updateUI();
}

// Delete last letter from current word
function deleteLastLetter() {
  if (gameState.currentWord.length > 0) {
    gameState.currentWord = gameState.currentWord.slice(0, -1);
    updateUI();
  }
}

// Submit word
function submitWord() {
  const word = gameState.currentWord.toUpperCase();
  
  // Check if word meets requirements
  if (word.length < gameConfig.minWordLength) {
    showMessage(`Words must be at least ${gameConfig.minWordLength} letters long`, 'error');
    return;
  }
  
  if (!word.includes(gameConfig.centerLetter)) {
    showMessage(`Words must include the center letter: ${gameConfig.centerLetter}`, 'error');
    return;
  }
  
  if (gameState.foundWords.includes(word)) {
    showMessage('You already found this word', 'warning');
    return;
  }
  
  if (gameConfig.dictionary.includes(word)) {
    // Valid word
    gameState.foundWords.push(word);
    const wordPoints = calculateWordPoints(word);
    gameState.score += wordPoints;
    
    // Check if pangram
    const isPangram = checkIfPangram(word);
    
    showMessage(`+${wordPoints} points${isPangram ? ' - PANGRAM!' : ''}`, 'success');
    gameState.currentWord = '';
    updateRank();
    updateUI();
    addWordToList(word, isPangram);
  } else {
    showMessage('Not in word list', 'error');
  }
}

// Calculate points for a word
function calculateWordPoints(word) {
  let points = 0;
  
  if (word.length === 4) {
    points = 1;
  } else if (word.length === 5) {
    points = 2;
  } else if (word.length === 6) {
    points = 3;
  } else if (word.length === 7) {
    points = 4;
  } else if (word.length >= 8) {
    points = 5;
  }
  
  // Bonus for pangram
  if (checkIfPangram(word)) {
    points += 7;
  }
  
  return points;
}

// Check if word is a pangram (uses all letters)
function checkIfPangram(word) {
  return gameConfig.letters.every(letter => word.includes(letter));
}

// Calculate maximum possible score
function calculateMaxScore() {
  return gameConfig.dictionary.reduce((total, word) => total + calculateWordPoints(word), 0);
}

// Update player rank based on score
function updateRank() {
  if (gameState.score >= 101) {
    gameState.rank = 'Genius';
  } else if (gameState.score >= 76) {
    gameState.rank = 'Excellent';
  } else if (gameState.score >= 51) {
    gameState.rank = 'Good';
  } else if (gameState.score >= 31) {
    gameState.rank = 'Moving Up';
  } else if (gameState.score >= 16) {
    gameState.rank = 'Good Start';
  } else {
    gameState.rank = 'Beginner';
  }
}

// Add word to found words list
function addWordToList(word, isPangram) {
  const wordItem = document.createElement('div');
  wordItem.textContent = word;
  wordItem.className = 'word-item';
  
  if (isPangram) {
    wordItem.classList.add('pangram');
  }
  
  elements.wordsList.appendChild(wordItem);
}

// Show message
function showMessage(text, type) {
  elements.message.textContent = text;
  elements.message.className = 'message';
  
  if (type) {
    elements.message.classList.add(type);
  }
  
  // Clear message after 3 seconds
  setTimeout(() => {
    elements.message.textContent = '';
    elements.message.className = 'message';
  }, 3000);
}

// Shuffle letters
function shuffleLetters() {
  const outerCells = Array.from(document.querySelectorAll('.cell.outer'));
  
  // Fisher-Yates shuffle algorithm
  for (let i = outerCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    
    // Swap letters
    const tempLetter = outerCells[i].getAttribute('data-letter');
    const tempHTML = outerCells[i].innerHTML;
    
    outerCells[i].setAttribute('data-letter', outerCells[j].getAttribute('data-letter'));
    outerCells[i].innerHTML = outerCells[j].innerHTML;
    
    outerCells[j].setAttribute('data-letter', tempLetter);
    outerCells[j].innerHTML = tempHTML;
  }
  
  showMessage('Letters shuffled', 'success');
}

// Show hint
function showHint() {
  // Find a word that hasn't been discovered yet
  const remainingWords = gameConfig.dictionary.filter(word => !gameState.foundWords.includes(word));
  
  if (remainingWords.length > 0) {
    // Pick a random word
    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    
    // Show first two letters as hint
    showMessage(`Hint: ${randomWord.substring(0, 2)}...`, 'warning');
  } else {
    showMessage('You found all the words!', 'success');
  }
}

// Handle keyboard input
function handleKeyPress(e) {
  const key = e.key.toUpperCase();
  
  // Check if key is a valid letter
  if (gameConfig.letters.includes(key)) {
    addLetterToWord(key);
    
    // Find and animate the corresponding cell
    const cell = Array.from(elements.cells).find(cell => cell.getAttribute('data-letter') === key);
    if (cell) {
      cell.classList.add('selected');
      setTimeout(() => cell.classList.remove('selected'), 300);
    }
  }
  
  // Delete key
  if (e.key === 'Backspace' || e.key === 'Delete') {
    deleteLastLetter();
  }
  
  // Enter key
  if (e.key === 'Enter') {
    submitWord();
  }
}

// Toggle mobile menu
function toggleMenu() {
  const nav = document.querySelector('nav ul');
  nav.classList.toggle('show');
}

// Update UI elements
function updateUI() {
  // Update current word
  elements.currentWord.textContent = gameState.currentWord;
  
  // Update score
  elements.currentScore.textContent = gameState.score;
  
  // Update rank
  elements.currentRank.textContent = gameState.rank;
  
  // Update progress bar
  const progressPercentage = (gameState.score / gameState.maxScore) * 100;
  elements.progress.style.width = `${Math.min(progressPercentage, 100)}%`;
  
  // Update word count
  elements.wordCount.textContent = `(${gameState.foundWords.length})`;
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);