const startQuizBtn = document.getElementById("start-quiz-btn");
const mainContent = document.getElementById("mainContent");

let currentQuestionIndex = 0; //to store the index of the current question
let quizScore = 0; //to store the number of correct answers for the result page

const initialMainContent = mainContent.innerHTML; //enables us to reset the main content to its initial state when the user has finished the quiz

const displayQuestion = () => {
  //function to display the current question
  const currentQuestion = questions[currentQuestionIndex]; //get the current question from the questions array in the quizdata.js
  mainContent.innerHTML = ""; //empty main content

  const progressContainer = document.createElement("div");
  progressContainer.className = "progress-container";

  const progressText = document.createElement("div");
  progressText.className = "progress-text";
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${
    questions.length
  }`;

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";

  const progressFill = document.createElement("div");
  progressFill.className = "progress-fill";
  progressFill.style.width = `${
    ((currentQuestionIndex + 1) / questions.length) * 100
  }%`;

  progressBar.appendChild(progressFill);
  progressContainer.appendChild(progressText);
  progressContainer.appendChild(progressBar);
  mainContent.appendChild(progressContainer);

  const questionHeading = document.createElement("h2"); //create a heading
  questionHeading.textContent = currentQuestion.question; //set the heading to the current question from quizdata.js
  const questionId = `question-heading-${currentQuestion.id}`; //create a question id to link the question to the options
  questionHeading.id = questionId; //creating an id for the question heading
  mainContent.appendChild(questionHeading); //making the question heading a child of the main content

  const questionFieldset = document.createElement("fieldset"); //create a fieldset to hold the question options
  questionFieldset.classList.add("question-options"); //add a class to the fieldset
  questionFieldset.setAttribute("aria-labelledby", questionId); //link the fieldset to the question heading

  currentQuestion.options.forEach((option, index) => {
    //loop through the options of the current question from quizdata.js
    const optionId = `question-${currentQuestion.id}-option-${index}`; //create an id for the options
    const inputRadio = document.createElement("input"); //create an input element
    inputRadio.type = "radio"; //set the input type to radio
    inputRadio.name = `question-${currentQuestion.id}`; //link the input to the question to ensure the user can only select one option
    inputRadio.id = optionId; //create an unique id for each option
    inputRadio.value = index; //check if user selected the correct answer

    const label = document.createElement("label"); //create a label element
    label.classList.add("quiz-option");
    label.setAttribute("for", optionId); //links label to each option
    label.textContent = option; //set the label text to the current option
    label.prepend(inputRadio);
    questionFieldset.appendChild(label);

    label.prepend(inputRadio); // lägg input inuti labeln
    questionFieldset.appendChild(label); // lägg labeln i fieldset (och INTE input separat)
  });

  const feedbackDiv = document.createElement("div"); //create a div to display feedback messages
  feedbackDiv.classList.add("feedback-message"); //css class for the feedback message
  feedbackDiv.setAttribute("aria-live", "polite"); //set the live region to polite - not urgent
  feedbackDiv.setAttribute("role", "alert"); //set the role to alert to notify the user of the feedback message
  questionFieldset.appendChild(feedbackDiv);

  const submitBtn = document.createElement("button"); //create a button to submit the answer
  submitBtn.textContent = "Submit"; //text in button
  submitBtn.classList.add("submit-btn"); //css class for the button
  submitBtn.addEventListener("click", handleAnswerSubmission); //onclick the handeAnswerSubmission function below is called
  questionFieldset.appendChild(submitBtn);

  mainContent.appendChild(questionFieldset);
};

const handleAnswerSubmission = () => {
  //function to handle the submission of the answer
  const currentQuestion = questions[currentQuestionIndex]; //current question from the questions array in js/quizdata.js
  const selectedOption = document.querySelector(
    `input[name="question-${currentQuestion.id}"]:checked`
  ); //currently checked option
  const feedbackDiv = document.querySelector(".feedback-message"); //feedback message div
  const submitBtn = document.querySelector(".submit-btn"); //submit button
  const questionFieldset = submitBtn.parentNode; //finds the HTML element that contains the "Submit" button and stores it so we can add the "Next question" button there.
  const allOptions = document.querySelectorAll(
    `input[name="question-${currentQuestion.id}"]`
  ); //all options for the current question
  allOptions.forEach((input, index) => {
    const label = input.parentElement;
    if (index == currentQuestion.correctAnswerIndex) {
      label.classList.add("correct");
    } else if (input.checked) {
      label.classList.add("incorrect");
    }
  });

  if (selectedOption) {
    //check if an option has been selected
    const selectedAnswer = selectedOption.value; //store the value of the selected option

    if (selectedAnswer === currentQuestion.correctAnswerIndex) {
      //Checks if selected option is correct in the quizdata.js
      feedbackDiv.textContent = currentQuestion.correctAnswerMessage; //shows user the answer message for correct answer
      quizScore++; //increases the quiz score with 1 point
    } else {
      feedbackDiv.textContent = currentQuestion.incorrectAnswerMessage; //shows user the answer message for incorrect answer
    }

    submitBtn.removeEventListener("click", handleAnswerSubmission); //remove the event listener to prevent the user from submitting the answer mulitple times
    submitBtn.remove(); //remove the submit button as it should be replaced with a next button

    const nextBtn = document.createElement("button"); //create a next button
    nextBtn.classList.add("next-btn"); //add css class

    if (currentQuestionIndex < questions.length - 1) {
      //checks that current question is not last question
      nextBtn.textContent = "Next question"; //if its not the last button we set the text to next question
      nextBtn.addEventListener("click", () => {
        currentQuestionIndex++; //increases question index with +1 to move to next question
        displayQuestion(); //calls displayQuestion function to display next question
      });
    } else {
      nextBtn.textContent = "View results"; //sets text to view result if the user is on the last question
      nextBtn.addEventListener("click", () => {
        let resultMessage = ""; //variable for result message
        if (quizScore === 1) {
          //if user has 1 point, show the message below
          resultMessage = `<p>You had ${quizScore} correct answer out of ${questions.length} questions.</p>`;
        } else {
          //if the user has 0 or <1 show the message below
          resultMessage = `<p>You had ${quizScore} correct answers out of ${questions.length} questions.</p>`;
        }
        mainContent.innerHTML = `<div class="resultCard"><div class="container"><h2>Result</h2><img src="img/results.png" alt="" role="presentation" class="resultImg" id="resultImg"/>${resultMessage}</div></div>`; //adds h2, image and result message to main

        const backToMainBtn = document.createElement("button"); //create back to main button
        backToMainBtn.textContent = "Back to main"; // text in button
        backToMainBtn.classList.add("back-to-main-btn"); //css class
        backToMainBtn.id = "back-to-main-btn"; //id
        backToMainBtn.addEventListener("click", () => {
          mainContent.innerHTML = initialMainContent; //goes back to the initial content in the main.innerHTML as we stored in initialMainContent
          const startQuizBtn = document.getElementById("start-quiz-btn"); //get the start quiz button again
          if (startQuizBtn) {
            //if button is found - attach event listener again
            startQuizBtn.addEventListener("click", () => {
              currentQuestionIndex = 0; //sets the index to the first question again
              quizScore = 0; //sets the quiz score to zero
              displayQuestion(); //display first question
            });
          }
        });
        mainContent.appendChild(backToMainBtn);
      });
    }
    questionFieldset.appendChild(nextBtn);
  }
};

startQuizBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  quizScore = 0;
  displayQuestion();
});
