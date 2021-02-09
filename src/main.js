import $ from 'jquery';
import './css/styles.css';
import Trivia from './js/trivia.js';

function getToken(trivia) {
  let request = new XMLHttpRequest();
  const url = 'https://opentdb.com/api_token.php?command=request';

  request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(this.responseText);
      trivia.token = response.token;
      // trivia.saveToken(response);
    }
  };
  request.open("GET", url, true);
  request.send();
}

function decrement(numQuestions, category, difficulty, trivia) {
  let newNumQuestons = (parseInt(numQuestions) - 1).toString();
  getQuestions(newNumQuestons, category, difficulty, trivia);
}

function getQuestions(numQuestions, category, difficulty, trivia) {
  let request = new XMLHttpRequest();
  const url = `https://opentdb.com/api.php?amount=${numQuestions}${category != "any" ? `&category=${category}` : "" }${difficulty != "any" ? `&difficulty=${difficulty}` : "" }&type=multiple`;

  request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(this.responseText);
      if (response["response_code"] == 0) {
        trivia.questionsReceived = numQuestions;
        trivia.questions = response;
        $(".questionbox").show();
        drawQuestions(trivia);
        if (trivia.questionsRequested != trivia.questionsReceived) {alert(`Only able to receive ${trivia.questionsReceived} questions.`);}
        console.log(trivia.questions.results[0].question);
      }
      else if (response["response_code"] == 1) {
        decrement(numQuestions, category, difficulty, trivia);
      }
    }
  };
  request.open("GET", url, true);
  request.send();
}

function drawQuestions(trivia) {
  $("#question1-question").html(`${trivia.questions.results[0].question}`);
  $("#question1-option1").html(`${trivia.questions.results[0].correct_answer}`);
  $("#question1-option2").html(`${trivia.questions.results[0].incorrect_answers[0]}`);
  $("#question1-option3").html(`${trivia.questions.results[0].incorrect_answers[1]}`);
  $("#question1-option4").html(`${trivia.questions.results[0].incorrect_answers[2]}`);
}



$(document).ready(function() {
  $(".questionbox").hide();
  let trivia = new Trivia();
  getToken(trivia);
  
  $('#testButton').on('click', function(e){
    e.preventDefault();
    console.log(trivia.token);
  });

  $('form').submit(function(e){
    e.preventDefault();
    const numQuestions = $('#numAmt').val();
    const category = $('#category').val();
    const difficulty = $('#difficulty').val();
    trivia.questionsRequested = numQuestions;
    getQuestions(numQuestions, category, difficulty, trivia);
    console.log(trivia.questions);
    $(".setup").hide();
    
  });
  
});

// {
//   "response_code": 0,
//   "results": [
//       {
//           "category": "Entertainment: Film",
//           "type": "multiple",
//           "difficulty": "easy",
//           "question": "Who plays Alice in the Resident Evil movies?",
//           "correct_answer": "Milla Jovovich",
//           "incorrect_answers": [
//               "Madison Derpe",
//               "Milla Johnson",
//               "Kim Demp"
//           ]
//       },
//       {
//           "category": "Science: Computers",
//           "type": "multiple",
//           "difficulty": "easy",
//           "question": "Which programming language shares its name with an island in Indonesia?",
//           "correct_answer": "Java",
//           "incorrect_answers": [
//               "Python",
//               "C",
//               "Jakarta"
//           ]
//       },
//       {
//           "category": "Science & Nature",
//           "type": "multiple",
//           "difficulty": "easy",
//           "question": "What is the official name of the star located closest to the North Celestial Pole?",
//           "correct_answer": "Polaris",
//           "incorrect_answers": [
//               "Eridanus",
//               "Gamma Cephei",
//               "Iota Cephei"
//           ]
//       }
//   ]
// }