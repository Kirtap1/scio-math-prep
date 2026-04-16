let questions = [];
let currentQuestion = {};
let selectedIndex = null;

// DOM Elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

const checkBtn = document.getElementById('check-btn');
const nextBtn = document.getElementById('next-btn');
const solutionSection = document.getElementById('solution-section');
const solutionText = document.getElementById('solution-text');

// Fetch questions from JSON when the page loads
async function initGame() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        
        loadNextQuestion();
    } catch (error) {
        console.error("Error loading questions:", error);
        questionText.innerText = "Error loading questions. Please check your local server.";
    }
}

function renderMath() {
    // Ensure KaTeX auto-render function is available
    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
}

function loadNextQuestion() {
    // Check if we've run out of questions
    if (questions.length === 0) {
        questionText.innerText = "No questions found.";
        return;
    }

    // Pick a completely random question from the array
    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[randomIndex];
    selectedIndex = null;

    // Update text elements
    questionText.innerText = currentQuestion.question;
    solutionText.innerHTML = currentQuestion.tip;
    
    // Hide everything for the fresh question
    solutionSection.classList.add('hidden');
    checkBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');

    // Generate options dynamically
    optionsContainer.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = option;
        btn.onclick = () => selectOption(btn, index);
        optionsContainer.appendChild(btn);
    });

    // Render math formulas in the freshly loaded question and options
    renderMath();
}

function selectOption(selectedBtn, index) {
    selectedIndex = index;
    
    // Update visually
    const allBtns = optionsContainer.querySelectorAll('.option-btn');
    allBtns.forEach(btn => btn.classList.remove('selected'));
    selectedBtn.classList.add('selected');

    // Reveal the "Check Answer" button
    checkBtn.classList.remove('hidden');
    checkBtn.disabled = false;
}

function checkAnswer() {
    const allBtns = optionsContainer.querySelectorAll('.option-btn');
    
    // Disable options so they can't be clicked again
    allBtns.forEach(btn => btn.disabled = true);
    
    const selectedBtn = allBtns[selectedIndex];

    if (selectedIndex === currentQuestion.correctIndex) {
        selectedBtn.classList.add('correct');
    } else {
        selectedBtn.classList.add('wrong');
        // Show actual correct answer
        allBtns[currentQuestion.correctIndex].classList.add('correct');
    }
    
    // Show the solution and the "Next" button
    solutionSection.classList.remove('hidden');
    checkBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    
    // Render math formulas in the revealed solution text
    renderMath();
}

checkBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', loadNextQuestion);

initGame();