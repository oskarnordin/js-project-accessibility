//HTML elements
const startQuizBtn = document.getElementById("start-quiz-btn");
const mainContent = document.getElementById("mainContent");
const quizContainer = document.getElementById("quiz-container");
const progressContainer = document.getElementById("progress-container");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");
const questionHeading = document.getElementById("question-heading");
const questionFieldset = document.getElementById("question-fieldset");
const feedbackMessage = document.getElementById("feedback-message");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const resultCard = document.getElementById("resultCard");
const resultMessage = document.getElementById("resultMessage");
const backToMainBtn = document.getElementById("back-to-main-btn");
const introductionSection = document.getElementById("introduction");
const bannerSection = document.getElementById("banner");

//Store data
let currentQuestionIndex = 0;
let quizScore = 0;

//Function to update the progress bar
const updateProgress = () => {
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  progressFill.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
}

//Function to render question
const renderQuestionText = () => {
  const currentQuestion = questions[currentQuestionIndex];
  questionHeading.textContent = currentQuestion.question;
  const questionId = `question-heading-${currentQuestion.id}`;
  questionHeading.id = questionId;
}

//Function to create fieldset and render question options
const renderOptions = () => {
  const currentQuestion = questions[currentQuestionIndex]
  questionFieldset.innerHTML = ""
  currentQuestion.options.forEach((option, index) => {
    const optionId = `question-${currentQuestion.id}-option-${index}`;
    const inputRadio = document.createElement("input");
    inputRadio.type = "radio";
    inputRadio.name = `question-${currentQuestion.id}`;
    inputRadio.id = optionId;
    inputRadio.value = index;
    const label = document.createElement("label");
    label.classList.add("quiz-option");
    label.setAttribute("for", optionId);
    label.textContent = option;
    label.prepend(inputRadio);
    questionFieldset.appendChild(label);
  });
}

//Function to display question
const displayQuestion = () => {
  quizContainer.hidden = false;
  bannerSection.style.display = 'none';
  introductionSection.hidden = true;
  resultCard.hidden = true;
  
  updateProgress();
  renderQuestionText();
  renderOptions();

  feedbackMessage.textContent = "";
  submitBtn.hidden = false;
  nextBtn.hidden = true;
  submitBtn.addEventListener("click", handleAnswerSubmission);
};

//Function to style the options for right and wrong
const applyAnswerStyles = (allOptions, correctAnswerIndex) => {
  allOptions.forEach((input, index) => {
    const label = input.parentElement;
    if (index == correctAnswerIndex) {
      label.classList.add("correct");
    } else if (input.checked) {
      label.classList.add("incorrect");
    }
  });
}

//Function to handle submission
const handleAnswerSubmission = () => {
  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = document.querySelector(
    `input[name="question-${currentQuestion.id}"]:checked`
  );
  const allOptions = document.querySelectorAll(
    `input[name="question-${currentQuestion.id}"]`
  );

  if (selectedOption) {
    applyAnswerStyles(allOptions, currentQuestion.correctAnswerIndex);

    const selectedAnswer = parseInt(selectedOption.value)

    if (selectedAnswer === currentQuestion.correctAnswerIndex) {
      feedbackMessage.textContent = currentQuestion.correctAnswerMessage;
      quizScore++;
    } else {
      feedbackMessage.textContent = currentQuestion.incorrectAnswerMessage;
    }

    submitBtn.hidden = true;

    if (currentQuestionIndex < questions.length - 1) {
      nextBtn.textContent = "Next question"
      nextBtn.hidden = false;
    } else {
      nextBtn.hidden = false;
      nextBtn.textContent = "View result";
    }
  } else {
    feedbackMessage.textContent = "Please select an answer.";
  }
};

//Event listeners
startQuizBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  quizScore = 0;
  displayQuestion();
});

nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    quizContainer.hidden = true;
    bannerSection.hidden = true;
    resultCard.hidden = false;
    if (quizScore === 1) {
      resultMessage.innerHTML = `<p>You had ${quizScore} correct answer out of ${questions.length} questions.</p>`;
    } else {
      resultMessage.innerHTML = `<p>You had ${quizScore} correct answers out of ${questions.length} questions.</p>`;
    }
  }
});

backToMainBtn.addEventListener ("click", () => {
  bannerSection.style.display = 'flex'
  quizContainer.hidden = true;
  resultCard.hidden = true;
  introductionSection.hidden = false;
  window.location.hash = '#header'
  currentQuestionIndex = 0;
  quizScore = 0;
})

window.addEventListener("load", () => {
  const spinner = document.getElementById("spinner-container");
  spinner.style.display = "none";
});
