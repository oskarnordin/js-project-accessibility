const startQuizBtn = document.getElementById('start-quiz-btn')
const mainContent = document.getElementById('mainContent')
const quizSection = document.getElementById('quiz-section')
const optionFieldset = document.getElementById('option-fieldset')
const questionTextElement = document.getElementById('question-text')
const optionsContainer = document.getElementById('options-container')
const submitBtn = document.getElementById('submit-btn')
const nextBtn = document.getElementById('next-btn')
const feedbackDiv = document.getElementById('feedback-area')

let currentQuestionIndex = 0 //to store the index of the current question
let quizScore = 0 //to store the number of correct answers for the result page
const questionsData = questions

const initialMainContent = mainContent.innerHTML //enables us to reset the main content to its initial state when the user has finished the quiz

const displayQuestion = () => { //function to display the current question
    const currentQuestion = questions[currentQuestionIndex] //get the current question from the questions array in the quizdata.js
    questionTextElement.textContent = currentQuestion.question
    optionsContainer.innerHTML=''

    currentQuestion.options.forEach((option, index) => { //loop through the options of the current question from quizdata.js
        const optionId = `question-${currentQuestion.id}-option-${index}`//create an id for the options
        const inputRadio = document.createElement('input')//create an input element
        inputRadio.type = 'radio'//set the input type to radio
        inputRadio.name = `question-${currentQuestion.id}`//link the input to the question to ensure the user can only select one option
        inputRadio.id = optionId //create an unique id for each option
        inputRadio.value = index //check if user selected the correct answer

        const label = document.createElement('label')//create a label element
        label.setAttribute('for', optionId)//links label to each option
        label.textContent = option//set the label text to the current option

        optionsContainer.appendChild(inputRadio)
        optionsContainer.appendChild(label)
    })

    feedbackDiv.textContent = ''
    submitBtn.style.display = 'block'
    nextBtn.style.display = 'none'
}

const handleAnswerSubmission = () => { //function to handle the submission of the answer
    const currentQuestion = questions[currentQuestionIndex]//current question from the questions array in js/quizdata.js
    const selectedOption = document.querySelector(`input[name="question-${currentQuestion.id}"]:checked`)//currently checked option

    if (selectedOption) {//check if an option has been selected
        const selectedAnswer = (selectedOption.value)//store the value of the selected option

        if (selectedAnswer === currentQuestion.correctAnswerIndex) {//Checks if selected option is correct in the quizdata.js
            feedbackDiv.textContent = currentQuestion.correctAnswerMessage//shows user the answer message for correct answer
            quizScore++//increases the quiz score with 1 point
        } else {
            feedbackDiv.textContent = currentQuestion.incorrectAnswerMessage//shows user the answer message for incorrect answer
        }
        
        submitBtn.style.display = 'none'
        nextBtn.style.display = 'block'
        updateNextBtn()
        } else {
            feedbackDiv.textContent = 'Please select an answer before submitting.'
        }
}

const updateNextBtn = () => {
    nextBtn.removeEventListener('click', handleNextQuestion)
    if (currentQuestionIndex < questionsData.length -1) {
        nextBtn.textContent = 'Next question'
        nextBtn.addEventListener('click', handleNextQuestion)
    } else {
        nextBtn.textContent = 'view results'
        nextBtn.addEventListener('click', showResults)
    }
}
        
const handleNextQuestion = () => {
    currentQuestionIndex ++
    displayQuestion ()
}

const showResults = () => {
    let resultMessage = ''
    if ( quizScore === 1) {
         resultMessage = `<p>You had ${quizScore} correct answer out of ${questionsData.length} questions.</p>`
    } else {
        resultMessage = `<p>You had ${quizScore} correct answers out of ${questionsData.length} questions.</p>`
    }

    mainContent.innerHTML = `<h2>Result</h2><img src="img/results.png" alt="" role="presentation" class="result-img" id="result-img"/>${resultMessage}`//adds h2, image and result message to main

    const backToMainBtn = document.createElement('button')//create back to main button
    backToMainBtn.textContent = 'Back to main'// text in button
    backToMainBtn.classList.add('back-to-main-btn')//css class
    backToMainBtn.id = 'back-to-main-btn'//id
    backToMainBtn.addEventListener('click', () => {
        mainContent.innerHTML = initialMainContent //goes back to the initial content in the main.innerHTML as we stored in initialMainContent
        const startQuizBtn = document.getElementById('start-quiz-btn')//get the start quiz button again
        if (startQuizBtn) {//if button is found - attach event listener again
            startQuizBtn.addEventListener('click', () => {
                currentQuestionIndex = 0//sets the index to the first question again
                quizScore = 0//sets the quiz score to zero
                displayQuestion()//display first question
            })
         }
        })
    mainContent.appendChild(backToMainBtn)
    
}

const startQuiz = () => {
    currentQuestionIndex = 0
    quizScore = 0
    displayQuestion()
    document.getElementById('introduction').style.display = 'none'
    quizSection.style.display = 'block'
}


startQuizBtn.addEventListener('click', startQuiz)

submitBtn.addEventListener('click', handleAnswerSubmission)