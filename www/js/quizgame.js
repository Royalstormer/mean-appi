 //////////////////////////////////////Main code//////////////////////////////////////
$(window).ready(function () {
    "use strict";
    //Defines the global variables that will be used in multiple functions.
    var answer = "",                //Stores the correct answer.
        onStart = 0,                //Variable for checking if game just started.
        streak = 0,                 //Streak value.
        n = 1,                      //Used for streak counting.
        instData = [],              //Stores the master array from JSON.
        myTimer = "",               //Variable used to reset timer.
        back = 0,                   //Checks if back has been pressed.
        questionsObject = [],       //Stores all the questions as an object from JSON file
        round = 0,                  //Current round number.
        rightAnswers = 0,           //Number of correct answers.
        highStreak = 0,             //Highest streak value.
        oldQ = [],                  //Array holding the old question objects to be removed from question array.
        totalScore = 0,             //Current score.
        gameReady = true,
        quizURL = "http://makerspace.overtornea.se/meanappi/wp-json/meanappi-api/v1/get-all-ord",
        JSONtoSave = [],            //Serialized array of JSON fetch to be saved into file.
        localSave = false,
		gameSound = true;           //Stores game sounds using switch/case.

    
    $('div[data-role="footer"]').html('<p>MeanAPPI ' + verNumber + '</p>').fadeIn('fast');
    //Checks if start screen has run once.
    
    if (onStart === 0) {
        startScreen();
    }
    

    // Extend storage so that complex data can be stored
    
    Storage.prototype.setArray = function (key, obj) {
        
        return this.setItem(key, JSON.stringify(obj));
    };
    
    Storage.prototype.getArray = function (key) {
        
        return JSON.parse(this.getItem(key));
    };
    
    
    //////////////////////////////////////Functions//////////////////////////////////////
    

    
    //Adds start and back buttons to the GUI.
    
    function startScreen() {
        $("#startButton").html("<a href='#gamePage' data-role='button' class='app_start ui-btn' data-transition='pop'>Start</a>").fadeIn();
        $("#localSave").html("<a href ='#jsonFetch' data-role='button' class='ui-btn'data-transition='slide'>Settings</a>").fadeIn();
        $("#back").html("<a href='#home' data-role='header' data-back-btn='true'' class='app_back ui-btn-left ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-delete' data-transition='slide'data-direction='reverse'>Back</a>").fadeIn();
        
        
        
        
    }
    
    // Fetch the required JSON file and when it's properly loaded, run the specified function.
    // as the function call is called with a function argument this function won't be activated until
    // the callback argument is filled, in this case once data is called with instData = data in initGame().
    
    function fetchJSONFile(path, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) {
                    gameReady = true;
                    callback(data);
                }
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();

    }
    
    function fetchAndSave() {
        fetchJSONFile(quizURL, function (data) {
            var fetchedData = [];
            fetchedData = data;
            var JSONtoSave = $(fetchedData).serializeArray();
            
        });
    }
    
    //Checks if any index in instData matches removed index stored in oldQ.
    
    function removeOldQ() {
        var diff = [],
            w = 0,
            q = 0;
        diff = $(instData).not(oldQ).get();
        for (w = 0; w < (oldQ.length); w += 1) {
            for (q = 0; q < (instData.length); q += 1) {
                if (instData[q] == oldQ[w]) {
                    instData.splice(q, 1);
                }
            }
        }
    }

    
    
    //Picks random indexes in data array, copies them to the data2 array and delete indexes from the master list. 
    
    function randomizeList(instData) {
        var rand = 0,
            oldRand = [],
            data2 = [],
            f = 0;
        for (f = 0; f < 4; f += 1) {
                
            //removeOldQ();                     //Uncomment once JSON list has grown. 05/11/15
            if (instData != null && f === 0) {
                var max = instData.length;
                max -= 1;
                rand = Math.floor(Math.random() * max + 1) - 1;
                var tempObj = instData[rand];
        
                data2.push(tempObj);
            }
            if (f != 0) {
                if (f == 1) {
                    var diff = $(instData).not(oldRand).get();
                }
                rand = Math.floor(Math.random() * (diff.length - 1) + 1) - 1;
                var tempObj = diff[rand];
                data2.push(tempObj);
                diff.splice(rand, 1);
            }
            if (instData != null && f == 0) {
                oldQ.push(tempObj);
                instData.splice(rand, 1);
            }
            if (f > 0) {
                oldRand[f - 1] = tempObj;
            }
        }
        if (data2.length == 4) {
            gameReady = false;
            return (data2);
        }


    }
    
    
    // build the current question text, if it the [0] question it will specify it as the answer.
    
    function buildQuestion(currQuestionObject, runOnce, newQuestionText) {
        if (runOnce == 1) {
            newQuestionText += "<a href class = 'answer ui-btn' id = '.choice'>" + currQuestionObject.meankieli_ord + "</a>";
            return (newQuestionText);
        } else {
            newQuestionText += "<a href class = 'answer ui-btn' id = '.choice'>" + currQuestionObject.meankieli_ord + "</a>";
            return (newQuestionText);
        }
       
    }
    
    //Starts a timer that waits for 12s(12ms*1000). If timer runs out it calls checkAnswer function with an empty answer.
    
    function timerBar() {
        var p = 0;

        myTimer = setInterval(function () {
            $('#timerBar').css('width', p + '%');
            p += 0.1;
                
            if (p >= 100) {
                clearInterval(myTimer);
                var noChoice = "";
                checkAnswer(noChoice, answer);
                round += 1;
                setTimeout(function () {
                    $("#popupbasic").fadeOut('fast');
                    $(".answer").prop('disabled', false);
                    initGame();
                }, 2100);
            }
        }, 12);
    }
    
    
    //////////////////////////////////////Main Application Code//////////////////////////////////////
    
    // Begins by fetching the questions JSON file and instantiates the array, then randomizes the list.
      
    function initGame() {
        $("#quizName").html("Round " + (round + 1)).fadeIn('fast');
        var newTimer;
        $("#currentPointsCounter").html(totalScore);
        
        if (localSave == false) {
            fetchJSONFile(quizURL, function (data) {
                newTimer = setInterval(function () {
                    if (instData == null) {
                        instData = [];
                        instData = data;
                    }
                    if (instData.length < 4 && instData != null) {
                        instData = [];
                        instData = data;
                    }
                    if (gameReady == true && instData.length > 3) {
                        questionsObject = randomizeList(instData);
                    }
                    if (questionsObject != undefined) {
                        if (questionsObject.length == 4 && gameReady == false) {
                            clearInterval(newTimer);
                            beginGame(questionsObject);
                        }
                    }
                }, 2000);
            });
        } else {
            //questionsObject = jsonFile;
        }
    }
            
    //Once the JSON lists have been fetched and randomized the game can begin.
    //Randomizes which question goes in which button object.
    function beginGame(questionsObject) {
        var runOnce = 0,
            newQuestionText = "",
            tempQuestion = [],
            i = 0;
        
        //Saves the correct answer.
        answer = questionsObject[0].meankieli_ord;
        
        //Loads small image or large image depending on scaleSize. Activate once small images have been added.
        //if (scaleSize == "small") {
        //    newQuestionText += "<br>" + "<div class='ord_bild' id='ord_bild' onclick='return false;'><img src='" + questionsObject[0].featured_image.small + "'></div>" + "<br>";
        //}
        //else {
            newQuestionText += "<br>" + "<div class='ord_bild' id='ord_bild' onclick='return false;'><img src='" + questionsObject[0].featured_image + "'></div>" + "<br>";
        //}
        newQuestionText += questionsObject[0].title;
            
        for (var i = 0; i < 4; i += 1) {
            var rand = Math.floor(Math.random() * ((questionsObject.length - 1)) + 1) - 1; //chooses a random number
                
            if (rand == 0 && runOnce == 0) {
                runOnce = 1;
            }
            tempQuestion = questionsObject.splice(rand, 1);
            newQuestionText = buildQuestion(tempQuestion[0], runOnce, newQuestionText);
                    
            if (runOnce == 1) { 
                runOnce = 2;
            }
        }
        
        $("#questionsText").html(newQuestionText).fadeIn("slow");
        setTimeout(function () {
            timerBar();
            $("#timerBar").fadeIn();
            $("#timerBarBG").fadeIn();
            }, 100); 
        onStart += 1;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    //Clears the object called by argument.
    
    function clearDisplay(objectName) {
        $(objectName).fadeOut("slow");
        setTimeout(function() {
            $(objectName).empty().delay(1000);
        }, 1000);
    
    }
    
    
    //Checks if the chosen answer matches the answer and adds the points if correct.
    
    function gameSound_(sound) {
        if(gameSound === true){
            switch(sound){
                case "correct":
                    $('#correctAudio')[0].play();
                    break;
                case "error":
                    $('#errorAudio')[0].play();
                    break;
                default:
                    break;
            } 
        }
    }
    $(document).on("click", ".app_mute", function(m) {
        if (gameSound){
            gameSound = false
        
        }
        else{
            gameSound = true
        }
    });
    function checkAnswer(choice,answer) {
        
        if (choice == answer) {
            gameSound_("correct");
            streak += 1;
            rightAnswers += 1;
            totalScore += 10 + (streak-1);
            $("#currentPointsCounter").html(totalScore);
            //$('#sound_1')[0].play();          Enable once the intalat_ord variable gets filled in.
            clearDisplay("#questionsText");
    
            if (streak > highStreak) {
                highStreak = streak;
            }
            if (streak > n) {
                var streakPopup = "";
                streakPopup += "<br>" + "<p>Streak " + (n+1) + "X!</p>";
                $("#popupbasic").html(streakPopup).fadeIn('fast');
                n += 1;
            }
        }
        else {
            streak = 0;
            n = 1;
            gameSound_("error");
        }   
        
        setTimeout(function() {
            clearDisplay("#questionsText");
            clearDisplay("#timerBarBG");
            clearDisplay("#timerBar");
        }, 1000);
        
    }         
    
    
    //Creates the window and buttons once round 10 is cleared.
    
    function dialogWindow() {
        clearInterval(myTimer);
        setTimeout(function() {
            $(".playAgain").prop('disabled', false);
            $("#dialogWindow").fadeIn("fast");
            var resultsWindow = "<br><br><br>" + "<p>" + "Correct Answers: " + rightAnswers + " / 10" + "</p>" + "<p>" + "Highest Streak:    " + highStreak + "</p>" + "<div><a href='#home' data-role='button' data-back-btn='true'' class='app_back ui-btn-left ui-btn ui-btn-icon-left ui-icon-delete' data-transition='none'>Quit</a></div>" + "<div><a data-role='button' class='playAgain ui-btn-right ui-btn  ui-btn-icon-left ui-icon-check' data-transition='none'>Again</a></div>";
            $("#dialogWindow").html(resultsWindow).fadeIn("fast");
        }, 2000);
    }
    
    
    //////////////////////////////////////End of Functions////////////////////////////////////////////////
    
    //Defines what happens when you click the start button.
    
    $(document).on("click", ".app_start", function(e) {
        $(".app_start").prop('disabled', true);
        totalScore = 0;
        
        if(back == 1 ) {
            setTimeout(function() {
                var answer = initGame();
            }, 500);
            back = 0;
        }
        else {
            var answer = initGame();
            $(".answer").prop('disabled', false);
        }
           $("#muteButton").html("<a href='#gamePage' data-role='button' class='app_mute ui-btn' data-transition='pop'>Mute</a>").fadeIn();
    }); 
    
    
    //Defines what happens when you click play again.
    
    $(document).on("click",".playAgain", function(e) {
        $(".playAgain").prop('disabled', true);
        round = 0;
        clearDisplay("#dialogWindow");
        setTimeout(function() {
            initGame();
        },2000);            
    });
    
    
    //Defines what happens when you click one of the choice buttons.
    
    $(document).on("click", ".answer", function(e) {
        $(".answer").prop('disabled', true);
        clearInterval(myTimer);
        var choice = (this.text);
        checkAnswer(choice, answer);
        round +=1;
        if(round < 10) {
            $("#popupbasic").fadeOut('fast');
            setTimeout(function() {
                $(".answer").prop('disabled', false);
                gameReady = true;
                initGame();
            },1500);
        }
        else {
            $("#popupbasic").fadeOut('fast');
            dialogWindow();
        }
    });
    
    //Resets variables and clears the display when using the back button.
    
    $(document).on("click", ".app_back", function(e) {
        clearDisplay();                     
        clearDisplay("#dialogWindow");      //Calls function to clear the display.
        clearInterval(myTimer);             //Resets timer.
        onStart = 0;                        
        streak = 0;                         //Variable holding streak number.
        questionsObject = {};               
        currQuestionObject = {}; 
        currentQuestion = 0;
        currentRandQuestion = 0; 
        numberOfQuestions = 0;
        totalScore = 0;
        clearDisplay();
        back = 1;
        round = 0;
        oldQ = {};
        $(".app_start").prop('disabled', false);
    });
    
    
    //Formatting the 4 choice buttons
    
    $('#questionsText').css( {
        'position' : 'absolute',
        'left' : '6%',
        'height' : '30%',
        'top':'0.01cm',
        'margin-left' : -$('#questionsText').outerWidth()/2,
        'margin-top' : -$('#questionsText').outerHeight()/2,
        'text-align' : 'center' 
    } );
    

    
    //Old questions to be reinserted after 20 questions.
    if (round > 3) {
        console.log("Returning old questions!");
        oldQ = [];
    }   
    
    //////////////////////////////////////End of Code//////////////////////////////////////
    
}); 
