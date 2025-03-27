const startQuizBtn = document.getElementById('start-quiz-btn')
const mainContent = document.getElementById('mainContent')

let currentQuestionIndex = 0
let quizScore = 0

const initialMainContent = mainContent.innerHTML

const displayQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex]
    mainContent.innerHTML = ''

    const questionHeading = document.createElement('h2')
    questionHeading.textContent = currentQuestion.question
    const questionId = `question-heading-${currentQuestion.id}`
    questionHeading.id = questionId
    mainContent.appendChild(questionHeading)

    const questionFieldset = document.createElement('fieldset')

    currentQuestion.options.forEach((option, index) => {
        const optionId = `question-${currentQuestion.id}-option-${index}`
        const inputRadio = document.createElement('input')
        inputRadio.type = 'radio'
        inputRadio.name = `question-${currentQuestion.id}`
        inputRadio.id = optionId
        inputRadio.value = index

        const label = document.createElement('label')
        label.setAttribute('for', optionId)
        label.textContent = option

        questionFieldset.appendChild(inputRadio)
        questionFieldset.appendChild(label)
        questionFieldset.appendChild(document.createElement('br'))
    })

    const feedbackDiv = document.createElement('div')
    feedbackDiv.classList.add('feedback-message')
    feedbackDiv.setAttribute('aria-live', 'polite')
    feedbackDiv.setAttribute('role', 'alert')
    questionFieldset.appendChild(feedbackDiv)


    const submitBtn = document.createElement('button')
    submitBtn.textContent = 'Submit'
    submitBtn.classList.add('submit-btn')
    submitBtn.addEventListener('click', handleAnswerSubmission)
    questionFieldset.appendChild(submitBtn)

    mainContent.appendChild(questionFieldset)
    
}

const handleAnswerSubmission = () => {
    const currentQuestion = questions[currentQuestionIndex]
    const selectedOption = document.querySelector(`input[name="question-${currentQuestion.id}"]:checked`)
    const feedbackDiv = document.querySelector('.feedback-message')
    const submitBtn = document.querySelector('.submit-btn')
    const questionFieldset = submitBtn.parentNode

    if (selectedOption) {
        const selectedAnswer = parseInt(selectedOption.value)

        if (selectedAnswer === currentQuestion.correctAnswerIndex) {
            feedbackDiv.textContent = currentQuestion.correctAnswerMessage
            quizScore++
        } else {
            feedbackDiv.textContent = currentQuestion.incorrectAnswerMessage
        }

        submitBtn.removeEventListener('click', handleAnswerSubmission)
        submitBtn.remove()

        const nextBtn = document.createElement('button')
        nextBtn.classList.add('next-btn')

        if (currentQuestionIndex < questions.length - 1) {
            nextBtn.textContent = 'Next question'
            nextBtn.addEventListener('click', () => {
                currentQuestionIndex++
                displayQuestion()
            })
        } else {
            nextBtn.textContent = 'view results'
            nextBtn.addEventListener('click', () => {
                let resultMessage = ''
                if (quizScore === 1) {
                    resultMessage = `<p>You had ${quizScore} correct answer out of ${questions.length} questions.</p>`
                } else {
                resultMessage = `<p>You had ${quizScore} correct answers out of ${questions.length} questions.</p>`
                }
                mainContent.innerHTML = `<h2>Result</h2><img src="img/results.png" alt="" role="presentation" class="result-img" id="result-img"/>${resultMessage}`

                const backToMainBtn = document.createElement('button')
                backToMainBtn.textContent = 'Back to main'
                backToMainBtn.classList.add('back-to-main-btn')
                backToMainBtn.id = 'back-to-main-btn'
                backToMainBtn.addEventListener('click', () => {
                    mainContent.innerHTML = initialMainContent
                    const startQuizBtn = document.getElementById('start-quiz-btn')
                    if (startQuizBtn) {
                        startQuizBtn.addEventListener('click', () => {
                            currentQuestionIndex = 0
                            quizScore = 0
                            displayQuestion()
                        })
                    }
                })
                mainContent.appendChild(backToMainBtn)
            })
        }
        questionFieldset.appendChild(nextBtn)
} 
}



startQuizBtn.addEventListener('click', () => {
    currentQuestionIndex = 0
    quizScore = 0
    displayQuestion()
  })