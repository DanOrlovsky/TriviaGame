/*
    Themed Trivia game
    09/17/2017
    Daniel Orlovsky
    UNCC Bootcamp - Aug 2017
*/
'use strict'


var missed = -255;                  // Const for a missed answer to be treated as an incorrect answer
var maxTime = 30;             // How long the player will have to answer a question.
var gameStarted = false;            // Flag the game has started
var playAgain = false;              
var game;                           // Game object
var timerInterval;                  // Interval function.
var questionClose = "</a></p>";
var imagePath = "./assets/images/";
var bgPath = './assets/images/background-images/';
var progressBarRef;
var backgroundImages = [
    bgPath + '1.jpg',
    bgPath + '2.jpg',
    bgPath + '3.jpg',
    bgPath + '4.jpg',
    bgPath + '5.jpg',
];

function Question(question, answers, aboutAnswer, correctIndex, imgPath) {
    this.question = question;
    this.answers = answers;
    this.aboutAnswer = aboutAnswer;
    this.correctIndex = correctIndex;
    this.imagePath = imgPath;
}

var question1 = new Question("According to the episode title, what is a \"National Concern?\"", 
            [ 
                "A Dead Guy", 
                "The Final Solution",
                "Underage Drinking",
                "Charlie having cancer"
            ], "In Season 1 Episode 3, the gang tries to tackle the issue of teenagers drinking by creating a safe place for them to consume booze.", 
            2,  imagePath + "underageDrinking.jpg");

var question2 = new Question("Which two main characters are a couple outside of the show?", 
            [
                "Mac & Dennis",
                "Mac & Dee",
                "Dee & Charlie",
                "Charlie & Frank",
            ], "Kaitlin Olsen and Rob McElhenney married in 2008 and introduced their first child on the show!", 1, imagePath + "kaitlinAndRob.jpg");
var question3 = new Question("Who is Charlie's main crush?",
            [
                "Dee",
                "Gail",
                "Dennis's Mom",
                "The Waitress",   
            ], "Early on in the season, we learn Charlie has a crush on the Waitress", 3, imagePath + "waitress.jpg");

var questionList = [
    question1,        
    question2,
    question3,
];

function questionOpen(idx) {
    // idx will always begin at Zero (0), so we bump it up once.
    return '<p><a href="#" class="answer-choice" data-val="' + idx + '">' + (idx + 1) + ". ";
}

function runTimer() {
    progressBarRef.advanceProgressBar();
    if(--gameObj.timer <= 0) {
        gameObj.questionsMissed++;
        clearInterval(timerInterval);
        gameObj.checkAnswer(missed);
    }
    $(gameObj.timerSelector).text(gameObj.timer);
}

var  gameObj = {
    timer: maxTime,
    questionsCorrect: 0,
    questionsIncorrect: 0,
    questionsMissed: 0,
    questions: questionList,
    screenSelector: ".game-screen",
    questionSelector: "#question-display",  
    timerSelector: "#timer-display",
    answersSelector: "#answers-display",
    resultsSelector: "#results-display",
    guessedCorrectSelector: "#guessed-correct",
    guessedIncorrectSelector: "#guessed-incorrect",
    guessedMissedSelector: "#guessed-missed",
    currentQuestionIdx: 0,
    
    showResults: function() {
        $(this.resultsSelector).css({"display": "block", "z-index": "9999" });
        $(this.guessedCorrectSelector).html("<h2>Correct: " + this.questionsCorrect + "</h2>");
        $(this.guessedIncorrectSelector).html("<h2 class='text-red'>Incorrect: " + this.questionsIncorrect + "</h2>");
        $(this.guessedMissedSelector).html("<h2>Missed: " + this.questionsMissed + "</h2>");
        blinkPressStartInterval = setInterval(function() { blinkText('.pressStart')}, 1000);
        gameStarted = false;
    },

    runQuestion: function() {
        if(this.currentQuestionIdx >= this.questions.length) {
            this.showResults();
            return;
        }        
        this.timer = maxTime;
        $(this.answersSelector).empty();
        
        // Progress bar wrapper setup.
        progressBarRef = new CenterProgressBar("#progress-bar-wrapper", "orange", 100 / maxTime);           
        $(this.timerSelector).text(maxTime)
        timerInterval = setInterval(runTimer, 1000);
        $(this.questionSelector).text(this.questions[this.currentQuestionIdx].question);
        
        var idx=0;
        
        this.questions[this.currentQuestionIdx].answers.forEach(function(currentValue) {
        
            $(gameObj.answersSelector).append(questionOpen(idx) + currentValue + questionClose);
            idx++;

        });        

    },
    checkWin: function() {
        alert("Game Over!");
        gameStarted = false;
    },


    checkAnswer: function(answerIdx) {
        clearInterval(timerInterval);
        $(this.answersSelector).empty();    
        if(answerIdx != missed) {
            if(answerIdx == this.questions[this.currentQuestionIdx].correctIndex) {
                console.log(answerIdx + " = " + this.questions[this.currentQuestionIdx].answerIdx);
                this.questionsCorrect++;
                $(this.answersSelector).append("<h1>Correct!</h1>")
                
            } else {
                this.questionsIncorrect++;
                $(this.answersSelector).append("<h1 class='text-red'>Incorrect</h1>")
            }
        }
        $(this.answersSelector).append("<p>" + this.questions[this.currentQuestionIdx].aboutAnswer + "</p>");
        $(this.answersSelector).append('<img src="' + this.questions[this.currentQuestionIdx].imagePath + '" class="winning-image" />' );
        this.currentQuestionIdx++;
        window.setTimeout(function() { 
            gameObj.runQuestion(); 
        }, 6000);
    },


    reset: function() {
        $(this.resultsSelector).css("display", "none");
        this.questionsCorrect = 0;
        this.questionsIncorrect = 0;
        this.questionsMissed = 0;
        this.currentQuestionIdx = 0;
        this.timer = maxTime;
        $(this.timerSelector).text(0);
        this.runQuestion();
    },
}



function initializeGame() {

    if(gameStarted === false) {
        gameStarted = true;
        clearInterval(blinkPressStartInterval);
        $('#start-to-play').animate({opacity: 0}, 300, function() {
            $(this).css("display", "none");
            $(this).css("z-index", "-9999");
        });        
        gameObj.reset();        
    }
}

var backgroundInterval;
var blinkPressStartInterval;
var imageIdx = 0;
function backgroundImageRotate() {
    if(++imageIdx >= backgroundImages.length) {
        imageIdx = 0;
    }
    $(".background").animate({ opacity: 0 }, 1000, function() {
        $('.background').css('background-image', "url(" + backgroundImages[imageIdx] + ")").animate({ opacity: 1 }, 1000);
    })
}


function blinkText(selector) {
    $(selector).animate({ opacity: 0}, 300, function() {
        $(selector).animate({ opacity: 1}, 300);
    })
}
$(document).ready(function () {

    
    backgroundInterval = setInterval(backgroundImageRotate, 10000);
    blinkPressStartInterval = setInterval(function() { blinkText('.pressStart')}, 1000);
    $("#start-to-play").on("click", function() {
        initializeGame();
    });  
    
    $("#answers-display").on("click", ".answer-choice", function() {
        console.log($(".answer-choice").data("val"));
        gameObj.checkAnswer(parseInt($(this).data('val')));
    });
    $("#results-display").on("click", function() {
        initializeGame();
    })
    $(document).keypress(function (event) {
        
        // Enter key pressed
        if (event.keyCode === 13) {
            initializeGame();
        }
    });

});