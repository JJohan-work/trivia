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
  }
  request.open("GET", url, true);
  request.send();
}

function getQuestions(numQuestions, category, difficulty, trivia) {
  let request = new XMLHttpRequest();
  const url = `https://opentdb.com/api.php?amount=${numQuestions}${category != "any" ? `&category=${category}` : "" }${difficulty != "any" ? `&difficulty=${difficulty}` : "" }&type=multiple`;
  console.log(url);
  request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(this.responseText);
      trivia.questions = response;
      $(".questionbox").show();
      console.log(trivia.questions);
    }
  }
  request.open("GET", url, true);
  request.send();
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
    getQuestions(numQuestions, category, difficulty, trivia);
    // console.log(trivia.questions);
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