/* Syntax Excercise
 * Authors: Amal Nanavati, Ashley Wong, Emma Zhong
 * AndrewIDs: arnanava, jzhong1, ashleywo
 */

/* runs the game
 */
var main = function (ex) {

    //ex.data.meta.mode = "practice";
    ex.data.instance.state = {};

    /* 0 = code with dropdown
     * 1 = code with click-the-error
     * 2 = sode with different whitespaces
     */
    var questionType = 0;
    
    /* Which question number we are on (useful if we only want 10 questions) */
    var questionNum = 1;
    var totalNumOfQs = 9;
    
     /* used in question type 1 */
    var buttonList = undefined;
    var buttonInfo = undefined;
    var buttonCode = undefined;
    var buttonCodeWell = undefined;
    var buttonHeader = undefined;
    var buttonDict = undefined;
    var pressedButtons = [];
    var indexPressedButtons = [];

    /* Used in question type 0, this is a list of dropdowns and the correct 
     * answer for each dropdown, the code well, and the header
     */
    var dropdownList = undefined;
    var question0CodeWell = undefined;
    var question0Code = undefined;
    var header = undefined;
    var dropdownInfo = undefined;

    var score = 0;
    var totalPossibleScore = 0;

    /* Keeps track of whether the correct answer is being displayed or not
     */
    var isCorrectAnswerBeingDisplayed = false;
    var wasSubmitButtonClicked = false;
    var oldAnswers = []; // Used in Q type 0 to restore old answers after unshowing CA
    var oldColors = []; // Used in Q type 0 to restore old colors after unshowing CA

    //The alert that will show feedback
    var feedbackAlert = undefined;
    var isFeedbackShowing = false;
    var feedbackText = undefined;
    
    /* Used in Q type 2*/
    var leftCode1 =  "def isMultipleOfFourLeft(n):\n"
                    +"    result = False\n"
                    +"    if n%4 == 0:\n"
                    +"        result = True\n"
                    +"    return result";

    var rightCode1 = "def isMultipleOfFourRight(n):\n"
                    +"    result = False\n"
                    +"    if n%4 == 0:\n"
                    +"        result = True\n"
                    +"        return result";

    var leftCode2 =  "def printPrimesLeft(n):\n"
                    +"    for i in range(2,n):\n"
                    +"        j = 2\n"
                    +"        while(j <= (i/j)):\n"
                    +"            if (i % j == 0): break\n"
                    +"            j = j + 1\n"
                    +"        if (j > i/j) : print i";

    var rightCode2 = "def printPrimesRight(n):\n"
                    +"    for i in range(2,n):\n"
                    +"        j = 2\n"
                    +"    while(j <= (i/j)):\n"
                    +"        if (i % j == 0): break\n"
                    +"        j = j + 1\n"
                    +"    if (j > i/j) : print i";
    /*var code1 = "def f(x):\n    if (x == 2):\n        x+=2\n        return x";
    var code2 = "def f(x):\n    if (x == 2):\n        x+=2\n    return x";*/

    var type2List = [IndentPrac(leftCode1,rightCode1,
        "calculates if an integer is a multiple of 4",1),
                     IndentPrac(leftCode2,rightCode2,
        "print all the prime numbers up to n",1)];

    var question2qtype = 0;
    var vars = createCode(2,0);
    var currentIndentPrac = IndentPrac(vars.leftCode,vars.rightCode,
        vars.question,vars.ca,vars.hint);
    //saveData();
    var currentIndex = 0;
        /* Shows the appropriate question type
     */
    var showQuestion = function () {
        // If quiz mode, write which question you are on
        if (ex.data.meta.mode == "quiz-immediate") {
            var title = "Question ".concat(String(questionNum)).concat(" of ").concat(String(totalNumOfQs));
            if (ex.chromeElements.titleHeader === undefined) ex.setTitle(title);
            else ex.chromeElements.titleHeader.text(title)
        };
        console.log("show question");
        switch (questionType) {
            case 0:
                /* Create the code well */
                var codeInfo = createCode(questionType);
                question0Code = codeInfo.code;
                dropdownInfo = codeInfo.dropdownInfo;
                var descr = codeInfo.descr;

                /* Create the instructions/description of code */
                header = ex.createParagraph(0,0,descr,{size: "xlarge", width:ex.width(), textAlign:"center"});
                var margin = 50;
                var x = 50;
                var y = header.height()+margin;
                var width = ex.width()-x-margin;
                var height = ex.height()-y-margin;

                var showFeedback = (ex.data.meta.mode != "quiz-immediate");
                var dict = createCodeWellWithOptions(ex, x, y, width, height, question0Code, dropdownInfo, showFeedback, showFeedback, true, saveData);
                dropdownList = dict["dropdown"];
                question0CodeWell = dict["code"];
                console.log(question0CodeWell);

                break;
            case 1:
                var codeInfo = createCode(questionType);
                buttonCode = codeInfo.code;
                buttonInfo = codeInfo.buttonInfo;
                var descr = codeInfo.descr;
                buttonDict = codeInfo.buttonDict;
                
                buttonHeader = ex.createParagraph(0, 0, descr, {size : "xlarge", width : ex.width(), textAlign : "center"});
                var margin = 50;
                var x = 50;
                var y = buttonHeader.height() + margin;
                var width = ex.width() - x - margin;
                var height = ex.height() - y - margin * 2;
                
                var showFeedback = (ex.data.meta.mode != "quiz-immediate");
                var dict = clickableCodeWell(x, y, width, height, buttonCode, buttonInfo, buttonDict, pressedButtons, showFeedback, showFeedback, true);
                buttonList = dict["button"];
                console.log(buttonList);
                buttonCodeWell = dict["code"];
                
                for (var i = 0; i < buttonList.length; i++) {
                    if (buttonList[i]["correct"] == true) {
                        buttonList[i]["button"].index = i;
                        buttonList[i]["button"].on("click", function() {
                            var index = indexPressedButtons.indexOf(this.index);
                            if (index > -1) {
                                pressedButtons.splice(index,1);
                                indexPressedButtons.splice(index,1);
                                this.style({color : "white"});
                            }
                            else {
                                pressedButtons.push(true);
                                indexPressedButtons.push(this.index);
                                this.style({color : "blue"});
                            }
                            saveData();
                        });
                    }
                    else {
                        buttonList[i]["button"].index = i;
                        buttonList[i]["button"].on("click", function() {
                            var index = indexPressedButtons.indexOf(this.index);
                            if (index > -1) {
                                pressedButtons.splice(index, 1);
                                indexPressedButtons.splice(index,1);
                                this.style({color : "white"});
                            }
                            else {
                                pressedButtons.push(false);
                                indexPressedButtons.push(this.index);
                                this.style({color : "blue"});
                            }
                            saveData();
                        });
                    }
                }
                
                break;
            case 2:
                /* delete and draw */
                ex.graphics.ctx.clearRect(0,0,ex.width(),ex.height());
                var showFeedback = (ex.data.meta.mode != "quiz-immediate");
                currentIndentPrac.draw();
                if (currentIndentPrac.submitted){
                    currentIndentPrac.leftCard.well.off("click");
                    currentIndentPrac.rightCard.well.off("click");
                }
                break;
        };
        saveData();
    };

    var saveData = function (q0Option, q0DropdownI) {
        var data = {};
        
        data.questionType = questionType;
        data.questionNum = questionNum;
        data.totalNumOfQs = totalNumOfQs;
        data.score = score;
        data.totalPossibleScore = totalPossibleScore;
        data.isCorrectAnswerBeingDisplayed = isCorrectAnswerBeingDisplayed;
        data.wasSubmitButtonClicked = wasSubmitButtonClicked;

        data.isUndoButtonDisabled = ex.chromeElements.undoButton.isDisabled();
        data.isRedoButtonDisabled = ex.chromeElements.redoButton.isDisabled();
        data.isResetButtonDisabled = ex.chromeElements.resetButton.isDisabled();
        data.isNewButtonDisabled = ex.chromeElements.newButton.isDisabled();
        data.isDisplayCAButtonDisabled = ex.chromeElements.displayCAButton.isDisabled();
        data.isSubmitButtonDisabled = ex.chromeElements.submitButton.isDisabled();

        data.isFeedbackShowing = isFeedbackShowing;
        data.feedbackText = feedbackText;

        switch (questionType) {
            case 0:
                console.log(q0Option);
                console.log(q0DropdownI);
                data.question0Code = question0Code;
                data.dropdownInfo = jQuery.extend(true, {}, dropdownInfo);
                data.descr = header.text();
                data.oldAnswers = oldAnswers;
                data.oldColors = oldColors;
                data.dropdownDefaults = [];

                //Save dropdown selected text index, extract it from the html
                for (var i = 0; i < dropdownList.length; i++) {
                    var label;
                    if (i == q0DropdownI) {
                        label = q0Option;
                    } else {
                        label = dropdownToDefaultLabel(dropdownList[i].dropdown);
                    }
                    data.dropdownDefaults.push(label);
                };
                console.log(data);
                break;
            case 1:
                data.buttonCode = buttonCode;
                data.buttonInfo = jQuery.extend(true, {}, buttonInfo);
                data.buttonDict = jQuery.extend(true, {}, buttonDict);
                data.descr = buttonHeader.text();
                data.pressedButtons = pressedButtons;
                data.indexPressedButtons = indexPressedButtons;
                break;
            case 2:
                data.question2submitted = currentIndentPrac.submitted;
                data.question2qtype = question2qtype;
                data.question2LeftCode = currentIndentPrac.leftCode;
                data.question2RightCode = currentIndentPrac.rightCode;
                data.question2Question = currentIndentPrac.question;
                data.question2Ca = currentIndentPrac.ca;
                data.question2Clicked = currentIndentPrac.clicked;
                //console.log(data.question2LeftCode);

                
        };

        ex.saveState(data);
        console.log(ex.data.instance.state);
    };

    var loadData = function () {
        console.log(ex.data.instance.state);
        if (ex.data.instance.state != null && ex.data.instance.state != undefined && typeof(ex.data.instance.state) == "object" && Object.keys(ex.data.instance.state).length > 0) {
            questionType = ex.data.instance.state.questionType;
            questionNum = ex.data.instance.state.questionNum;
            totalNumOfQs = ex.data.instance.state.totalNumOfQs;
            score = ex.data.instance.state.score;
            totalPossibleScore = ex.data.instance.state.totalPossibleScore;
            isCorrectAnswerBeingDisplayed = ex.data.instance.state.isCorrectAnswerBeingDisplayed;
            wasSubmitButtonClicked = ex.data.instance.state.wasSubmitButtonClicked;

            //Re-disable or enable buttons
            var disableOrEnable = function(element, isDisabled)  {
                if (isDisabled) {
                    element.disable();
                } else {
                    element.enable();
                };
            };
            disableOrEnable(ex.chromeElements.undoButton, ex.data.instance.state.isUndoButtonDisabled);
            disableOrEnable(ex.chromeElements.redoButton, ex.data.instance.state.isRedoButtonDisabled);
            disableOrEnable(ex.chromeElements.resetButton, ex.data.instance.state.isResetButtonDisabled);
            disableOrEnable(ex.chromeElements.newButton, ex.data.instance.state.isNewButtonDisabled);
            disableOrEnable(ex.chromeElements.displayCAButton, ex.data.instance.state.isDisplayCAButtonDisabled);
            disableOrEnable(ex.chromeElements.submitButton, ex.data.instance.state.isSubmitButtonDisabled);

            isFeedbackShowing = ex.data.instance.state.isFeedbackShowing;
            feedbackText = ex.data.instance.state.feedbackText;

            if (isFeedbackShowing) showFeedback(feedbackText);

            // If quiz mode, write which question you are on
            if (ex.data.meta.mode == "quiz-immediate") {
                var title = "Question ".concat(String(questionNum)).concat(" of ").concat(String(totalNumOfQs));
                if (ex.chromeElements.titleHeader === undefined) ex.setTitle(title);
                else ex.chromeElements.titleHeader.text(title)
            };

            //Display next button if necessary
            if (wasSubmitButtonClicked) createNextButton();

            switch (questionType) {
                case 0:
                    if (ex.data.instance.state.isCorrectAnswerBeingDisplayed !== undefined) {
                        question0Code = ex.data.instance.state.question0Code;
                        dropdownInfo = ex.data.instance.state.dropdownInfo;
                        var descr = ex.data.instance.state.descr;
                        oldAnswers = ex.data.instance.state.oldAnswers;
                        oldColors = ex.data.instance.state.oldColors;

                        /* Create the instructions/description of code */
                        header = ex.createParagraph(0,0,descr,{size: "xlarge", width:ex.width(), textAlign:"center"});
                        var margin = 50;
                        var x = 50;
                        var y = header.height()+margin;
                        var width = ex.width()-x-margin;
                        var height = ex.height()-y-margin;

                        var showFeedbackBool = (ex.data.meta.mode != "quiz-immediate");
                        var dict = createCodeWellWithOptions(ex, x, y, width, height, question0Code, dropdownInfo, showFeedbackBool, showFeedbackBool, true, saveData);
                        dropdownList = dict["dropdown"];
                        question0CodeWell = dict["code"];

                        dropdownDefaults = ex.data.instance.state.dropdownDefaults;
                        //Save dropdown selected text, extract it from the html
                        var string1 = 'data-toggle="dropdown">';
                        var string2 = ' <span class="caret">';
                        for (var i = 0; i < dropdownDefaults.length; i++) {
                            dropdownList[i].dropdown.text(dropdownDefaults[i]);
                            if (wasSubmitButtonClicked) {
                                if (isCorrectAnswerBeingDisplayed) {
                                    dropdownList[i].dropdown.style({color : "green"});
                                } else {
                                    dropdownList[i].dropdown.style({color : oldColors[i]});
                                };
                                dropdownList[i].dropdown.disable();
                            };
                        };
                    };
                    break;
                case 1:
                    buttonCode = ex.data.instance.state.buttonCode;
                    buttonInfo = ex.data.instance.state.buttonInfo;
                    buttonDict = ex.data.instance.state.buttonDict;
                    var descr = ex.data.instance.state.descr;
                    pressedButtons = ex.data.instance.state.pressedButtons;
                    indexPressedButtons = ex.data.instance.state.indexPressedButtons;
                    buttonHeader = ex.createParagraph(0,0,descr,{size : "xlarge", width : ex.width(), textAlign : "center"});
                    var margin = 50;
                    var x = 50;
                    var y = buttonHeader.height() + margin;
                    var width = ex.width() - x - margin;
                    var height = ex.height() - y - margin;

                    var showFeedbackBool = (ex.data.meta.mode != "quiz-immediate");
                    var dict = clickableCodeWell(x, y, width, height, buttonCode, buttonInfo, buttonDict, showFeedbackBool, showFeedbackBool, true)
                    buttonList = dict["button"];
                    buttonCodeWell = dict["code"];

                    for (var i = 0; i < buttonList.length; i++) {
                        if (buttonList[i]["correct"] == true) {
                            buttonList[i]["button"].index = i;
                            buttonList[i]["button"].on("click", function() {
                                var index = indexPressedButtons.indexOf(this.index);
                                if (index > -1) {
                                    pressedButtons.splice(index,1);
                                    indexPressedButtons.splice(index,1);
                                    this.style({color : "white"});
                                }
                                else {
                                    pressedButtons.push(true);
                                    indexPressedButtons.push(this.index);
                                    this.style({color : "blue"});
                                }
                                saveData();
                            });
                        }
                        else {
                            buttonList[i]["button"].index = i;
                            buttonList[i]["button"].on("click", function() {
                                var index = indexPressedButtons.indexOf(this.index);
                                if (index > -1) {
                                    pressedButtons.splice(index, 1);
                                    indexPressedButtons.splice(index,1);
                                    this.style({color : "white"});
                                }
                                else {
                                    pressedButtons.push(false);
                                    indexPressedButtons.push(this.index);
                                    this.style({color : "blue"});
                                }
                                saveData();
                            });
                        }
                    }
                    break;
                case 2:

                    var left = ex.data.instance.state.question2LeftCode;
                    var right = ex.data.instance.state.question2RightCode;
                    var q = ex.data.instance.state.question2Question;
                    var ca = ex.data.instance.state.question2Ca;

                    question2qtype = ex.data.instance.state.question2qtype;
                    currentIndentPrac = IndentPrac(left,right,q,ca);
                    currentIndentPrac.clicked = ex.data.instance.state.question2Clicked;
                    if (currentIndentPrac.clicked == 1){
                        currentIndentPrac.leftCard.clicked = true;
                    }
                    else if (currentIndentPrac.clicked == -1){
                        currentIndentPrac.rightCard.clicked = true;
                    }
                    currentIndentPrac.submitted = ex.data.instance.state.question2submitted;

            };
            return true;
        };
        return false;
    };

    /* Handles clicks to the submit button
     */
    var submit = function () {
        wasSubmitButtonClicked = true;
        var buttonText = "Next";
        if (questionNum == totalNumOfQs) buttonText = "End";
        
        switch (questionType) {
            case 0:
                /* Generate Feedback */
                var numOfCorrectDropdowns = 0;
                if (dropdownList === undefined) {
                    throw "AMAL-DEFINED EXCEPTION: dropdownList is undefined";
                };
                for (var i = 0; i < dropdownList.length; i++) {
                    var currText = dropdownList[i].dropdown.text();
                    currText = currText.slice(0, currText.indexOf('<span class="caret">'));
                    currText = decodeHTMLEntities(currText);
                    console.log(currText);
                    console.log(dropdownList[i].correct);
                    if (currText.indexOf(dropdownList[i].correct) > -1) {
                        numOfCorrectDropdowns = numOfCorrectDropdowns + 1;
                        dropdownList[i].dropdown.style({color: "green"});
                        oldColors[i] = "green";
                    } else {
                        dropdownList[i].dropdown.style({color: "red"});
                        oldColors[i] = "red";
                    };
                    /* Disable dropdown */
                    dropdownList[i].dropdown.disable();
                };
                score = score + numOfCorrectDropdowns;
                totalPossibleScore = totalPossibleScore + dropdownList.length;
                var beginning = "";
                if (numOfCorrectDropdowns == dropdownList.length) beginning = "Congratulations!  "
                //if (numOfCorrectDropdowns >= dropdownList.length/2) beginning = "Good job!  "
                var feedback = beginning.concat("You got ").concat(String(numOfCorrectDropdowns)).concat(" dropdowns correct out of ").concat(String(dropdownList.length)).concat(".  Press '").concat(buttonText).concat("' to move on.");
                showFeedback(feedback);
                /* Enable Display CA Button */
                if (ex.data.meta.mode == "practice") ex.chromeElements.displayCAButton.enable();
                break;
            case 1:
                console.log(pressedButtons);
                var numOfCorrectButtons = 0;
                var numOfWrongButtons = 0;
                var total = 0;
                if (buttonList == undefined) {
                    throw "buttonList is undefined!";
                }
                for (var j = 0; j < buttonList.length; j++) {
                    if (buttonList[j]["correct"] == true) {
                        total++;
                        buttonList[j]["button"].style({color : "green"});
                    }
                    else {
                        buttonList[j]["button"].style({color : "red"});
                    }
                    buttonList[j]["button"].disable();
                }
                for (var i = 0; i < pressedButtons.length; i++) {
                    console.log(pressedButtons);
                    if (pressedButtons[i] == true) {
                        numOfCorrectButtons++;
                    }
                    else {
                        numOfWrongButtons++;
                    }
                }
                pressedButtons = [];
                score = score + numOfCorrectButtons - numOfWrongButtons;
                totalPossibleScore = totalPossibleScore + total;
                var beginning = "";
                if (numOfCorrectButtons == total) beginning = "Congratulations! ";
                var feedback = beginning.concat("You got ").concat(String(numOfCorrectButtons)).concat(" buttons correct out of ").concat(String(total)).concat(". Press 'Next' to move on.");
                if (numOfWrongButtons > 0) feedback = feedback.concat(" You also pressed ").concat(String(numOfWrongButtons)).concat(" button(s) incorrectly.")
                showFeedback(feedback);
                if (ex.data.meta.mode == "practice") ex.chromeElements.displayCAButton.enable();
                break;
            case 2:

                currentIndentPrac.submit();
                currentIndentPrac.submitted = true;
                currentIndentPrac.leftCard.well.off("click");
                currentIndentPrac.rightCard.well.off("click");
                saveData();
                //if (ex.data.meta.mode == "practice") ex.chromeElements.displayCAButton.enable();
                
        };
        createNextButton(buttonText);
        saveData();
    };

    var createNextButton = function(buttonText) {
        /* Create the next button */
        if (buttonText === undefined) {
            var buttonText = "Next";
            if (questionNum == totalNumOfQs) buttonText = "End";
        };
        var x = ex.width()-100;
        var y = ex.height()-42;
        var nextButton = ex.createButton(x, y,buttonText, {
                                                        color: "white",
                                                        size: "medium"
                                                      });
        nextButton.on("click", function () {
            wasSubmitButtonClicked = false;
            isCorrectAnswerBeingDisplayed = false;

            if (feedbackAlert !== undefined) {
                feedbackAlert.remove();
                isFeedbackShowing = false;
            };

            deleteAll();
            //if (questionType == 2) {
            //  if (currentIndex+1 < type2List.length)currentIndex++;
            //  currentIndentPrac = type2List[currentIndex];
            //}

            questionType = (questionType+1)%3;
            if (questionType == 2){
                question2qtype = (question2qtype+1) % 2
                var vars = createCode(2,question2qtype);
                currentIndentPrac = IndentPrac(vars.leftCode,vars.rightCode,
                    vars.question,vars.ca,vars.hint);

            }
            if (ex.data.meta.mode == "quiz-immediate") {
                questionNum++;
                if (questionNum > totalNumOfQs) {
                    endOfExcercise();
                    nextButton.remove();
                    ex.chromeElements.submitButton.disable();
                    return;
                }
            };
            /* USE THIS SPACE TO CHANGE QUESTION TYPE OR TO CHECK IF YOU HAVE 
             * REACHED THE MAX NUMBER OF QUESTIONS! 
             */
            showQuestion();
            nextButton.remove();
            /* Disable Display CA Button */
            ex.chromeElements.displayCAButton.disable();
        });
    }

    var showFeedback = function (feedback) {
        feedbackText = feedback;
        isFeedbackShowing = true;
        feedbackAlert = ex.alert(feedback, {
            fontSize: 20,
            stay: true
        });
    }

    /* End of excercise
     */
    var endOfExcercise = function () {
        var percent = score/totalPossibleScore;
        var feedback = "You got ".concat(String(score)).concat(" out of ").concat(String(totalPossibleScore)).concat(" points.\n ").concat(String(percent*100)).concat("%");
        showFeedback(feedback);
        ex.setGrade(percent, feedback);
    }

    /* Delete element112s
     */
    var deleteAll = function () {
        switch (questionType) {
            case 0:
                if (header !== undefined) {
                    console.log("removed header");
                    header.remove();
                    header = undefined;
                }
                if (question0CodeWell !== undefined) {
                    console.log("removed question0CodeWell");
                    question0CodeWell.remove();
                    question0CodeWell = undefined;
                }
                for (var i = 0; i < dropdownList.length; i++) {
                    console.log("removed dropdown ".concat(String(i)));
                    /* Remove dropdown */
                    dropdownList[i].dropdown.remove();
                };
                dropdownList = undefined;
                break;
            case 1:
                console.log("in button deleteall");
                if (buttonHeader !== undefined) {
                    console.log("remove buttonHeader");
                    buttonHeader.remove();
                    buttonHeader = undefined;
                }
                if (buttonCodeWell !== undefined) {
                    console.log("removed buttonCodeWell");
                    buttonCodeWell.remove();
                    buttonCodeWell = undefined;
                }
                for (var i = 0; i < buttonList.length; i++) {
                    console.log("removed button ".concat(String(i)));
                    buttonList[i].button.remove();
                }
                buttonList = undefined;
                break;
            case 2:
                currentIndentPrac.clear();
                break;
        };
    };

    /* Handles clicks to the displayCA button
     */
    var displayCA = function () {
        switch (questionType) {
            case 0:
                console.log(isCorrectAnswerBeingDisplayed);
                if (isCorrectAnswerBeingDisplayed) {
                    for (var i = 0; i < dropdownList.length; i++) {
                        dropdownList[i].dropdown.text(oldAnswers[i]);
                        dropdownList[i].dropdown.style({color : oldColors[i]});
                        console.log(dropdownList[i].dropdown.text());
                    };
                } else {
                    for (var i = 0; i < dropdownList.length; i++) {
                        oldAnswers[i] = dropdownToDefaultLabel(dropdownList[i].dropdown);
                        dropdownList[i].dropdown.text(dropdownList[i].correct);
                        dropdownList[i].dropdown.style({color : "green"});
                        console.log(dropdownList[i].dropdown.text());
                    };
                };
                break;
            case 1:
                // if (isCorrectAnswerBeingDisplayed) {
                //     for (var i = 0; i < buttonList.length; i++) {
                //         buttonList[i].
                //     }
                // }
                break;
            case 2:
                break;
        };
        isCorrectAnswerBeingDisplayed = !isCorrectAnswerBeingDisplayed;
        saveData();
    };

    /* Handles clicks to the reset button
     */
    var reset = function () {
        console.log("reset");
        deleteAll();
        showQuestion();
        console.log("showedQuestion");
        // switch (questionType) {
        //     case 0:
        //         break;
        //     case 1:
        //         break;
        //     case 2:
        //         break;
        // };
    };

    /* Turns binds button handlers
     */
     var bindButtons = function () {
        ex.chromeElements.submitButton.off("click");
        ex.chromeElements.submitButton.on("click", submit);
        ex.chromeElements.displayCAButton.off("click");
        ex.chromeElements.displayCAButton.on("click", displayCA);
        ex.chromeElements.resetButton.off("click");
        ex.chromeElements.resetButton.on("click", reset);
        ex.chromeElements.redoButton.off("click");
        ex.chromeElements.undoButton.off("click");
     };

     /* Enables/disables buttons
     */
    var enableButtons = function () {
        if (ex.data.meta.mode == "practice") {
            ex.chromeElements.submitButton.enable();
            ex.chromeElements.displayCAButton.disable();
            ex.chromeElements.undoButton.disable();
            ex.chromeElements.redoButton.disable();
            ex.chromeElements.resetButton.enable();
            ex.chromeElements.newButton.enable();
        };
        if (ex.data.meta.mode == "quiz-immediate") {
            ex.chromeElements.submitButton.enable();
            ex.chromeElements.displayCAButton.disable();
            ex.chromeElements.undoButton.disable();
            ex.chromeElements.redoButton.disable();
            ex.chromeElements.resetButton.disable();
            ex.chromeElements.newButton.disable();
        };
    };

    var run = function () {
        bindButtons();
        if (!(loadData())) {
            enableButtons();
            showQuestion();
        };
        if (questionType == 2) showQuestion();
    }

    function CodeCard(left,content,ca,hint){
        var code2 = {};
        code2.ca = ca;
        code2.hint = hint;
        code2.margin = 10;
        code2.left = left;
        if (code2.left) code2.x = code2.margin;
        else code2.x = code2.margin + ex.width()/2;
        code2.y = 10;
        code2.width = ex.width()/2 - code2.margin*2;
        code2.height = ex.height()*2/3;
        code2.content = content;
        code2.well = undefined;
        code2.clicked = false;
         
        code2.draw = function(){
            //console.log(code2.width,code2.height);
            code2.well = ex.createCode(code2.x,code2.y,code2.content,
                {language:"python",
                 selectable:true,
                 border:"none",
                 width:code2.width,
                 height:code2.height
                }).on("click",function(){
                    code2.clicked = true;
                    code2.highlight();
                    console.log(code2.ca);
                    if (!code2.ca){
                        if (ex.data.meta.mode == "practice"){
                            ex.alert(hint, {
                                fontSize: 20,
                                stay: true,
                                color:"yellow"
                            });
                        }
                    }
                    if (code2.left) {
                        currentIndentPrac.clicked = 1;
                        currentIndentPrac.rightCard.clicked = false;
                    }
                    else {
                        currentIndentPrac.clicked = -1;
                        currentIndentPrac.leftCard.clicked = false;
                    }
                    saveData();
                    currentIndentPrac.redrawCard();}
                    );
            ex.graphics.ctx.strokeStyle = "grey";
            ex.graphics.ctx.strokeRect(code2.x,code2.y,code2.width,code2.height);
            if (code2.clicked) code2.highlight();
        }
        code2.clear = function(){
            ex.graphics.ctx.clearRect(code2.x-code2.margin,code2.y-code2.margin,
                ex.width()/2,code2.height+15);
            if (code2.well != undefined){
                code2.well.remove();
            }
        }
        code2.highlight = function(){
            ex.graphics.ctx.strokeStyle = "red";
            ex.graphics.ctx.strokeRect(code2.x-4,code2.y-2,code2.width+6,code2.height+4);
        }
        return code2;
    }

    function IndentPrac(leftCode,rightCode,question,ca,hint){
        var q = {}
        var leftC = (ca == 1);
        var rightC = (ca == -1);
        q.leftCard = CodeCard(true,leftCode,leftC,hint);
        q.rightCard = CodeCard(false,rightCode,rightC,hint);
        q.question = question;
        q.ca = ca;
        q.clicked = 0;
        q.textPara = undefined;
        q.x = 20;
        q.y = ex.height()*3/4;
        q.leftCode = leftCode;
        q.rightCode = rightCode;
        q.hint = hint;
        q.submitted = false;
        //q.explanation = explanation;
        
        q.drawQuestion = function(){
            q.textPara = ex.createParagraph(q.x,q.y,
                "Click on the code that correctly "+q.question,
                {size: "xlarge", width:ex.width(), textAlign:"center"});
        }
        q.draw = function(){
            q.leftCard.draw();
            q.rightCard.draw();
            q.drawQuestion();
        }
        q.redrawCard = function(){
            if (q.clicked == 1){
                q.rightCard.clear();
                q.rightCard.draw();
            }
            else if (q.clicked == -1){
                q.leftCard.clear();
                q.leftCard.draw();
            }
        }
        q.clear = function(){
            q.leftCard.clear();
            q.rightCard.clear();
            if (q.textPara != undefined){
                q.textPara.remove();
            }

        }
        q.submit = function(){
            if (ex.data.meta.mode == "quiz-immediate"){
                if (q.clicked == ca) showFeedback("Correct!");      
                else showFeedback("Incorrect!");
            }
            else{
                if (q.clicked == ca) showFeedback("Correct!");
                else showFeedback("Incorrect!");
            }
            if (!q.submitted){
                totalPossibleScore += 4;
                if (q.clicked == ca) score += 4;
                q.submitted = true;
            }
        }
        return q;
    }

    var clickableCodeWell = function(x, y, width, height, code, buttonInfo, buttonDict, showFeedbackIfCorrect, showFeedbackIfWrong, randomDefault) {
        
        console.log("clickableCodeWell");
        console.log(ex.data.instance.state);
        console.log(ex.data.instance.state.indexPressedButtons);
        console.log(ex.data.instance.state.pressedButtons);
        /* Create the code well */
        buttonCodeWell = ex.createCode(x, y, code, {size:"large", width:width, height:height});
    
        var buttonList = [];
        var buttonIndex = 0;
        for (var substring in buttonInfo) {
            var defaultStr = buttonDict[substring];
            var correct = buttonInfo[substring]["correct"];
            var feedback = undefined;
            if (correct) {
                if (showFeedbackIfCorrect) {
                    feedback = buttonInfo[substring]["feedback"];
                    // feedback = "Correct!  ".concat(feedback);
                    // var message = ex.alert(feedback, {
                    //     fontSize: 20,
                    //     stay: true,
                    //     color:"green"
                    // });
                }
            }
            else {
                if (showFeedbackIfWrong) {
                    feedback = buttonInfo[substring]["feedback"];
                    // feedback = "Incorrect!  ".concat(feedback);
                    // var message = ex.alert(feedback, {
                    //     fontSize: 20,
                    //     stay: true,
                    //     color:"red"
                    // });
                }
            }
            
            if (wasSubmitButtonClicked) {
                if (correct) {
                    var codeButton = ex.createButton(0,0,defaultStr, {color : "green"});
                    codeButton.disable();
                }
                else {
                    var codeButton = ex.createButton(0,0,defaultStr, {color : "red"});
                    codeButton.disable();
                }
            }
            else {
                if (ex.data.instance.state.indexPressedButtons === undefined) {
                    var codeButton = ex.createButton(0,0,defaultStr);
                }
                else {
                    if (ex.data.instance.state.indexPressedButtons.indexOf(buttonIndex) > -1) {
                        var codeButton = ex.createButton(0,0,defaultStr,{color : "blue"});
                    }
                    else {
                        var codeButton = ex.createButton(0,0,defaultStr);
                    }
                }
            }
            
            ex.insertDropdown(buttonCodeWell, substring, codeButton);
            buttonList.push({"button" : codeButton, "correct" : buttonInfo[substring]["correct"]});
            buttonIndex++;
        }
        console.log(pressedButtons);
        return {"code" : buttonCodeWell, "button" : buttonList};
    };

    run();
    
}

/* Success and failure functions, which will be called when the user selects
 * an option on the dropdown
 */
var getSuccessFn = function (ex, feedback, saveData, showFeedback, option, dropdownI) {
    return function () {
        console.log(option);
        console.log(dropdownI);
        if (showFeedback) {
            feedback = "Correct!  ".concat(feedback);
            var message = ex.alert(feedback, {
                    fontSize: 20,
                    stay: true,
                    color:"green"
            });
        }
        saveData(option, dropdownI);
    };
};
var getFailureFn = function (ex, feedback, saveData, showFeedback, option, dropdownI) {
    return function () {
        console.log(option);
        console.log(dropdownI);
        if (showFeedback) {
            feedback = "Incorrect!  ".concat(feedback);
            var message = ex.alert(feedback, {
                    fontSize: 20,
                    stay: true,
                    color:"red"
            });
        }
        saveData(option, dropdownI);
    };
};

/* text is the string of code, dropdownInfo is a dictionary where the keys
 * are the substrings within text to replace, and the values are dictionaries
 * in which the keys corresponds to the dropdown options,
 * and the values are dictionaries with the "feedback" key mapping to a string 
 * of feedback for when the user chooses that option, the "correct" key
 * mapping to a bool representing whether that option is correct or not, and 
 * the "default" key mapping to a bool indicating whether that element is the
 * default or not.  Returns a list of dictionaries, where the key "dropdown" 
 * maps to the dropdown, and the key "correct" maps to the correct answer for
 * that dropdown.
 */
var createCodeWellWithOptions = function (ex, x, y, width, height, code, dropdownInfo, showFeedbackIfCorrect, showFeedbackIfWrong, randomDefault, saveData) {

    /* Create the code well */
    var codeWell = ex.createCode(x, y, code, {size:"large", width:width, height:height});

    /* Create the dropdown */
    var dropdownList = [];
    var dropdownI = 0;
    for (var substring in dropdownInfo) {
        console.log(substring);
        if (dropdownInfo.hasOwnProperty(substring) && (code.indexOf(substring) > -1)) {
            /* Create the dropdown options object */
            var elements = {};
            var defaultStr = "";
            var randomDefaultI = getRandomInt(0, Object.keys(dropdownInfo[substring]).length-1);
            var currI = 0;
            var correctAnswer = undefined;
            for (var option in dropdownInfo[substring]) {
                if (dropdownInfo[substring].hasOwnProperty(option)) {
                    var correct = dropdownInfo[substring][option]["correct"];
                    if (dropdownInfo[substring][option]["default"] && (!randomDefault)) {
                        defaultStr = option;
                    };
                    if (randomDefault && randomDefaultI == currI) {
                        defaultStr = option;
                    };
                    currI++;
                    var feedback = undefined;
                    if (correct) {
                        correctAnswer = option;
                        feedback = dropdownInfo[substring][option]["feedback"];   
                        elements[option] = getSuccessFn(ex, dropdownInfo[substring][option]["feedback"], saveData, showFeedbackIfCorrect, option, dropdownI);
                    } else {
                        feedback = dropdownInfo[substring][option]["feedback"]; 
                        elements[option] = getFailureFn(ex, dropdownInfo[substring][option]["feedback"], saveData, showFeedbackIfWrong, option, dropdownI);  
                    };
                };
            };
            dropdownI++;

            /* Create the dropdown */
            var codeDrop = ex.createDropdown(0,0,defaultStr,{elements: elements});
            //var codeDrop = ex.createButton(0,0,defaultStr);

            /* Insert the dropdown into the codeWell */
            ex.insertDropdown(codeWell, substring, codeDrop);

            /* Add the dropdown and correct answer to the list */
            dropdownList.push({"dropdown":codeDrop, "correct":correctAnswer});
        };
    };
    return {"code" : codeWell, "dropdown" : dropdownList};
};

var createCode = function(questionType,q2type) {
    
    switch (questionType) {
        case 0:
            var arithmeticOperators = {"+" : "_1 added to _2", "*" : "_1 multiplied by _2", "-" : "_1 minus _2", "/" : "_1 divided by _2"};
            var logicOperators = {"and" : "and", "or" : "or"};

            var ifBody = {"(_1 % _2) == 0"  : "_1 is divisible by _2", "_1 <= _2" : "_1 is less-than-or-equal-to _2", "_1 == _2" : "_1 is equal to _2"};
            var variableNames = ["x", "y", "z", "n", "i"];
            var functionNames = ["f", "g", "h"];


            var typeOfQuestion = getRandomInt(1, 3);

            switch (typeOfQuestion) {
                case 1:
                    var num = String(getRandomInt(1, 10));
                    var operator = getRandomKey(arithmeticOperators);
                    var variable = variableNames[getRandomInt(0, variableNames.length-1)];
                    var functionName = functionNames[getRandomInt(0, functionNames.length-1)];
                    var correct1 = "def ".concat(functionName).concat("(").concat(variable);
                    var correct2 = "):";
                    var print = getRandomInt(0, 1);
                    var correct3 = "";
                    if (print == 0) {
                        correct3 = "return ";
                    } else {
                        correct3 = "print(";
                    }
                    var correct4 = num.concat(operator).concat(variable);
                    if (operator == "*") {
                        var rand = getRandomInt(0, 1);
                        if (rand == 0) {
                            correct4 = variable.concat(("+".concat(variable)).repeat(num-1));
                        }
                    }
                    console.log(correct4);
                    if (print == 1) {
                        correct4 = correct4.concat(")");
                    }
                    var seed = getRandomInt(0, 3);
                    var code = "<span>'_1'</span><span>'_2'</span>\n    <span>'_3'</span><span>'_4'</span>"
                    //Limit number of dropdowns (i.e. don't have 10)
                    var numOfDropdowns = 3;
                    var i = 0;
                    console.log(numOfDropdowns);
                    console.log(code);
                    while (i < 4-numOfDropdowns) {
                        var seed = String(getRandomInt(1, 4))
                        var substring = "<span>'_".concat(seed).concat("'</span>");
                        if (code.indexOf(substring) > -1) {
                            code = code.replace(substring, eval("correct".concat(seed)));
                            i++;
                        };
                    };
                    console.log(code);

                    var choice11 = "function ".concat(functionName).concat("(").concat(variable);
                    var choice12 = "def function ".concat(functionName).concat("(").concat(variable);
                    var choice13 = "".concat(functionName).concat("(").concat(variable);
                    var wrong3 = "";
                    if (print == 1) {
                        wrong3 = "return ";
                    } else {
                        wrong3 = "print(";
                    }
                    var wrongFeedback3 = "Do you want to return or print?";
                    var correctFeedback3 = "Return gives the value back to the function that called it, whereas print writes it to console.";
                    var choice41 = num.concat(operator).concat(variable).concat(";");
                    var choice42 = num.concat(variable);
                    var choice43 = num.concat(operator).concat("{").concat(variable).concat("}");
                    var dropdownInfo = {"'_1'" : {}, "'_2'" : {}, "'_3'" : {}, "'_4'" : {}};
                    dropdownInfo["'_1'"][choice11] = {"feedback" : "What keywords defines or declares a fucntion?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_1'"][correct1] = {"feedback" : "Functions are declared with def, followed by the function name and a pair of parenthises with the argument(s).",
                                                                "correct" : true,
                                                                "default" : true};
                    dropdownInfo["'_1'"][choice12] = {"feedback" : "Are you sure you need boh def and function?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_1'"][choice13] = {"feedback" : "What do you put before every function definition?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_2'"][":)"] = {"feedback" : "Should the colon be inside or outside the parenthesis?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_2'"][");"] = {"feedback" : "Check your colon.",
                                                                "correct" : false,
                                                                "default" : true};
                    dropdownInfo["'_2'"][correct2] = {"feedback" : "First you close the parenthesis that lists the arguments, and then you put a colon.",
                                                                "correct" : true,
                                                                "default" : false};
                    dropdownInfo["'_2'"][")"] = {"feedback" : "What goes at the end of every function definition?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_3'"]["return["] = {"feedback" : "What comes after return?",
                                                                "correct" : false,
                                                                "default" : true};
                    dropdownInfo["'_3'"][wrong3] = {"feedback" : wrongFeedback3,
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_3'"][correct3] = {"feedback" : correctFeedback3,
                                                                "correct" : true,
                                                                "default" : false};
                    dropdownInfo["'_3'"]["print "] = {"feedback" : "In Python 3, is print a function or a statement?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_4'"][choice41] = {"feedback" : "What, if anything, goes at the end of every line?",
                                                                "correct" : false,
                                                                "default" : true};
                    dropdownInfo["'_4'"][choice42] = {"feedback" : "You need an operator between the 5 and the x.",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_4'"][correct4] = {"feedback" : "Python does not use any symbol to indicate the end of a line.",
                                                                "correct" : true,
                                                                "default" : false};
                    dropdownInfo["'_4'"][choice43] = {"feedback" : "Curly brackets are not the same as parenthesis.",
                                                                "correct" : false,
                                                                "default" : false};
                    var operatorString = arithmeticOperators[operator].replace("_1", num).replace("_2", variable);
                    var returnStr = "returns";
                    if (print == 1) {
                        returnStr = "prints";
                    }

                    var descr = "Write a function that takes in an integer, ".concat(variable).concat(", and ").concat(returnStr).concat(" ").concat(operatorString).concat(".");
                    return {"code" : code, "dropdownInfo" : dropdownInfo, "descr" : descr};
                    break;
                case 2:
                    var num1 = String(getRandomInt(1, 10));
                    var num2 = String(getRandomInt(1, 10));
                    var operator1 = getRandomKey(arithmeticOperators);
                    var operator2 = getRandomKey(arithmeticOperators);
                    var variable1 = variableNames[getRandomInt(0, variableNames.length-1)];
                    var variable2 = variableNames[getRandomInt(0, variableNames.length-1)];
                    while (variable2 == variable1) variable2 = variableNames[getRandomInt(0, variableNames.length-1)];
                    var functionName = functionNames[getRandomInt(0, functionNames.length-1)];
                    var ifBody1 = getRandomKey(ifBody);
                    var ifBody2 = getRandomKey(ifBody);
                    var logicalOperator = getRandomKey(logicOperators);
                    var print1 = getRandomInt(0, 1);
                    var print2 = getRandomInt(0, 1);

                    var correct1 = "if (";
                    var correct2 = ifBody1.replace("_1", variable1).replace("_2", num1);
                    var correct3 = logicalOperator;
                    var correct4 = ifBody2.replace("_1", variable2).replace("_2", num2);
                    var correct5 = "):";
                    var correct6 = "return ";
                    if (print1 == 1) correct6 = "print(";
                    var correct7 = "else:";
                    var correct8 = "return ";
                    if (print2 == 1) correct8 = "print(";

                    var return1 = variable1.concat(operator1).concat(variable2);
                    if (print1 == 1) return1 = return1.concat(")");
                    var return2 = variable1.concat(operator2).concat(variable2);
                    if (print2 == 1) return2 = return2.concat(")");

                    /* Sample target code:
                     *var targetCode = "def f(x, y):\n    if ((x%2) == 0 and y <= 5):\n        return x+y\n    else:\n        return x-y";
                     */
                    var code = "def ".concat(functionName).concat("(").concat(variable1).concat(", ").concat(variable2).concat("):\n    ");
                    code = code.concat("<span>'_1'</span><span>'_2'</span> <span>'_3'</span> <span>'_4'</span><span>'_5'</span>\n        <span>'_6'</span>").concat(return1).concat("\n    <span>'_7'</span>\n        <span>'_8'</span>").concat(return2);
                    
                    //Limit number of dropdowns (i.e. don't have 10)
                    var numOfDropdowns = getRandomInt(4, 5);
                    var i = 0;
                    while (i < 8-numOfDropdowns) {
                        var seed = String(getRandomInt(1, 8))
                        var substring = "<span>'_".concat(seed).concat("'</span>");
                        if (code.indexOf(substring) > -1) {
                            code = code.replace(substring, eval("correct".concat(seed)));
                            i++;
                        };
                    };

                    var choice21 = ifBody1.replace("_1", variable1).replace("_2", num1).replace("=", "==");
                    var choice22;
                    var choice22Feedback;
                    if (ifBody1.indexOf("==") > -1) {
                        choice22 = ifBody1.replace("_1", variable1).replace("_2", num1).replace("==", "=");
                        choice22Feedback = "Are you checking for equality, or assigning a variable?";
                    } else {
                        choice22 = ifBody1.replace("_1", variable1).replace("_2", num1).replace("<=", "=<");
                        choice22Feedback = "Are you sure you got the right comparison operator?";
                    }
                    var wrong3 = getRandomKey(logicOperators);
                    while (wrong3 == correct3) wrong3 = getRandomKey(logicOperators);
                    var choice31 = "&&";
                    var choice32 = "&";
                    if (correct3 == "or") {
                        choice31 = "||";
                        choice32 = "|";
                    }
                    var choice41 = ifBody2.replace("_1", variable2).replace("_2", num2).replace("=", "==");
                    var choice42;
                    var choice42Feedback;
                    if (ifBody2.indexOf("==") > -1) {
                        choice42 = ifBody2.replace("_1", variable2).replace("_2", num2).replace("==", "=");
                        choice42Feedback = "Are you checking for equality, or assigning a variable?";
                    } else {
                        choice42 = ifBody2.replace("_1", variable2).replace("_2", num2).replace("<=", "=<");
                        choice42Feedback = "Are you sure you got the right comparison operator?";
                    }

                    var wrong6 = "";
                    if (print1 == 1) {
                        wrong6 = "return ";
                    } else {
                        wrong6 = "print(";
                    }
                    var wrongFeedback6 = "Do you want to return or print?";
                    var correctFeedback6 = "Return gives the value back to the function that called it, whereas print writes it to console.";

                    var wrong8 = "";
                    if (print2 == 1) {
                        wrong8 = "return ";
                    } else {
                        wrong8 = "print(";
                    }
                    var wrongFeedback8 = "Do you want to return or print?";
                    var correctFeedback8 = "Return gives the value back to the function that called it, whereas print writes it to console.";

                    //Create Dropdown info
                    var dropdownInfo = {"'_1'" : {}, "'_2'" : {}, "'_3'" : {}, "'_4'" : {}, "'_5'" : {}, "'_6'" : {}, "'_7'" : {}, "'_8'" : {}};
                    dropdownInfo["'_1'"]["if ["] = {"feedback" : "What symbol should follow an if statement?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_1'"][correct1] = {"feedback" : "Functions are declared with def, followed by the function name and a pair of parenthises with the argument(s).",
                                                                "correct" : true,
                                                                "default" : true};
                    dropdownInfo["'_1'"]["in case ("] = {"feedback" : "What statement is used for conditionals?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_1'"]["if ()"] = {"feedback" : "What should go inside the parenthesis?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_2'"][choice21] = {"feedback" : "How many equal signs should you have?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_2'"][choice22] = {"feedback" : choice22Feedback,
                                                                "correct" : false,
                                                                "default" : true};
                    dropdownInfo["'_2'"][correct2] = {"feedback" : "",
                                                                "correct" : true,
                                                                "default" : false};
                    dropdownInfo["'_3'"][correct3] = {"feedback" : "In Python logical operators are just the words and, or.",
                                                                "correct" : true,
                                                                "default" : false};
                    dropdownInfo["'_3'"][wrong3] = {"feedback" : "Are you sure you are using the right logical oeprator?",
                                                                "correct" : false,
                                                                "default" : true};
                    dropdownInfo["'_3'"][choice31] = {"feedback" : "Python logical operators are different from C or Java logical operators.",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_3'"][choice32] = {"feedback" : "Are you sure you are not confusing bitwise operators and logical oeprators?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_4'"][choice41] = {"feedback" : "How many equal signs should you have?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_4'"][correct4] = {"feedback" : "",
                                                                "correct" : true,
                                                                "default" : true};
                    dropdownInfo["'_4'"][choice42] = {"feedback" : choice42Feedback,
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_5'"][":)"] = {"feedback" : "Should the colon be inside or outside the parenthesis?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_5'"][correct5] = {"feedback" : "First you close the parenthesis, and then you put a colon.",
                                                                "correct" : true,
                                                                "default" : false};
                    dropdownInfo["'_5'"][");"] = {"feedback" : "Check your colon.",
                                                                "correct" : false,
                                                                "default" : true};
                    dropdownInfo["'_5'"][")"] = {"feedback" : "What goes at the end of every statement?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_6'"][wrong6] = {"feedback" : wrongFeedback6,
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_6'"]["return["] = {"feedback" : "What comes after return?",
                                                                "correct" : false,
                                                                "default" : true};
                    dropdownInfo["'_6'"]["print "] = {"feedback" : "In Python 3, is print a function or a statement?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_6'"][correct6] = {"feedback" : correctFeedback6,
                                                                "correct" : true,
                                                                "default" : false};
                    dropdownInfo["'_7'"]["else "] = {"feedback" : "What comes after the else?",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_7'"][correct7] = {"feedback" : "First write else, followed by a colon.",
                                                                "correct" : true,
                                                                "default" : false};
                    dropdownInfo["'_7'"]["otherwise "] = {"feedback" : "Are you sure otherwise is the correct statement?",
                                                                "correct" : false,
                                                                "default" : true};
                    dropdownInfo["'_7'"]["else;"] = {"feedback" : "Check your colon.",
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_8'"][correct8] = {"feedback" : correctFeedback8,
                                                                "correct" : true,
                                                                "default" : false};
                    dropdownInfo["'_8'"][wrong8] = {"feedback" : wrongFeedback8,
                                                                "correct" : false,
                                                                "default" : false};
                    dropdownInfo["'_8'"]["return["] = {"feedback" : "What comes after return?",
                                                                "correct" : false,
                                                                "default" : true};
                    dropdownInfo["'_8'"]["print "] = {"feedback" : "In Python 3, is print a function or a statement?",
                                                                "correct" : false,
                                                                "default" : false};
                    
                    //Create function description
                    var returnStr1 = "returns ";
                    if (print1 == 1) returnStr1 = "prints ";
                    var returnStr2 = "returns ";
                    if (print2 == 1) returnStr2 = "prints ";

                    var operatorString1 = arithmeticOperators[operator1].replace("_1", variable1).replace("_2", variable2);
                    var operatorString2 = arithmeticOperators[operator2].replace("_1", variable1).replace("_2", variable2);

                    var descr = "Write a function that takes in two integers, ".concat(variable1).concat(" and ").concat(variable2).concat(", and if ").concat(ifBody[ifBody1].replace("_1", variable1).replace("_2", num1)).concat(" ").concat(logicOperators[logicalOperator]).concat(" ").concat(ifBody[ifBody2].replace("_1", variable2).replace("_2", num2)).concat(", ").concat(returnStr1).concat(operatorString1).concat(", otherwise ").concat(returnStr2).concat(operatorString2);

                    return {"code" : code, "dropdownInfo" : dropdownInfo, "descr" : descr};
                    break;
                case 3:
                    var seed = getRandomInt(0, 1);
                    switch(seed) {
                        case 0: //Factorial
                            var print = getRandomInt(0, 1);
                            var variable1 = variableNames[getRandomInt(0, variableNames.length-1)];
                            var variable2 = variableNames[getRandomInt(0, variableNames.length-1)];
                            while (variable2 == variable1) variable2 = variableNames[getRandomInt(0, variableNames.length-1)];
                            var variable3 = variableNames[getRandomInt(0, variableNames.length-1)];
                            while (variable3 == variable1 || variable3 == variable2) variable2 = variableNames[getRandomInt(0, variableNames.length-1)];

                            var endVar = variable2;
                            if (print == 1) endVar = endVar.concat(")");

                            var correct1 = " = 1";
                            var correct2 = "for";
                            var correct3 = "(1, ".concat(variable1).concat("+1)");
                            var correct4 = "*=";
                            var correct5 = "return ";
                            if (print == 1) correct5 = "print(";

                            /* Sample target code:
                             *var targetCode = "def factorial(x):\n    product = 1\n    for i in xrange(1, x+1):\n        product *= i\n    return product";
                             */
                            var code = "def factorial(".concat(variable1).concat("):\n    ").concat(variable2).concat("<span>'_1'</span>\n    <span>'_2'</span> ").concat(variable3).concat(" in xrange<span>'_3'</span>:\n        ").concat(variable2).concat(" <span>'_4'</span> ").concat(variable3).concat("\n    <span>'_5'</span>").concat(endVar);

                            //Limit number of dropdowns (i.e. don't have 5)
                            var numOfDropdowns = 4;
                            var i = 0;
                            while (i < 5-numOfDropdowns) {
                                var seed = String(getRandomInt(1, 5))
                                var substring = "<span>'_".concat(seed).concat("'</span>");
                                if (code.indexOf(substring) > -1) {
                                    code = code.replace(substring, eval("correct".concat(seed)));
                                    i++;
                                };
                            };

                            var choice31 = "(1, ".concat(variable1).concat(")");
                            var choice32 = "(0, ".concat(variable1).concat("+1)");
                            var choice33 = "(1, ".concat(variable1).concat("+1, 2)");

                            var wrong5 = "";
                            if (print == 1) {
                                wrong5 = "return ";
                            } else {
                                wrong5 = "print(";
                            }
                            var wrongFeedback5 = "Do you want to return or print?";
                            var correctFeedback5 = "Return gives the value back to the function that called it, whereas print writes it to console.";

                            //Create Dropdown info
                            var dropdownInfo = {"'_1'" : {}, "'_2'" : {}, "'_3'" : {}, "'_4'" : {}, "'_5'" : {}};
                            dropdownInfo["'_1'"][" == 1"] = {"feedback" : "Are you assigning a value, or checking for equality?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_1'"][correct1] = {"feedback" : "",
                                                                        "correct" : true,
                                                                        "default" : true};
                            dropdownInfo["'_1'"][" = 0"] = {"feedback" : "Which numeric constant should you start with?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_1'"][" 1"] = {"feedback" : "What symbol do you use to assign a variable?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_2'"]["while "] = {"feedback" : "Do you want to loop an unknown number of times, or a fixed number of times?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_2'"]["if "] = {"feedback" : "Do you want to merely go through the body once, or multiple times?",
                                                                        "correct" : false,
                                                                        "default" : true};
                            dropdownInfo["'_2'"][correct2] = {"feedback" : "A for...in statement iterates for as many elements as there are in the xrange.",
                                                                        "correct" : true,
                                                                        "default" : false};
                            dropdownInfo["'_3'"][correct3] = {"feedback" : "You want i to iterate from 1 to x+1, exclusive of the last argument.",
                                                                        "correct" : true,
                                                                        "default" : false};
                            dropdownInfo["'_3'"][choice31] = {"feedback" : "Xrange does not include the last argument.",
                                                                        "correct" : false,
                                                                        "default" : true};
                            dropdownInfo["'_3'"][choice32] = {"feedback" : "If you start from 0, what will happen to your product?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_3'"][choice33] = {"feedback" : "Do you want to skip over every other number, or hit every integer between the two bounds?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_4'"]["*"] = {"feedback" : "Are you actually storing the value of this multiplication anywhere?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_4'"][correct4] = {"feedback" : "*= first multiplies the two numbers, and assigns the result to the variable on the left.",
                                                                        "correct" : true,
                                                                        "default" : true};
                            dropdownInfo["'_4'"]["="] = {"feedback" : "Are you sure you just want to assign the variable?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_4'"]["=*"] = {"feedback" : "What order should the = and * go in?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_5'"][correct5] = {"feedback" : correctFeedback5,
                                                                        "correct" : true,
                                                                        "default" : false};
                            dropdownInfo["'_5'"][wrong5] = {"feedback" : wrongFeedback5,
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_5'"]["return["] = {"feedback" : "What comes after return?",
                                                                        "correct" : false,
                                                                        "default" : true};
                            dropdownInfo["'_5'"]["print "] = {"feedback" : "In Python 3, is print a function or a statement?",
                                                                        "correct" : false,
                                                                        "default" : false};

                            //Create function description
                            var returnStr = "returns ";
                            if (print == 1) returnStr = "prints ";

                            var descr = "Write a function that takes in an integer and ".concat(returnStr).concat(" its factorial, i.e. the product of the integers from 1 to your argument.");

                            return {"code" : code, "dropdownInfo" : dropdownInfo, "descr" : descr};

                            break;
                        case 1: //Log

                            var print = getRandomInt(0, 1);
                            var variable1 = variableNames[getRandomInt(0, variableNames.length-1)];
                            var variable2 = variableNames[getRandomInt(0, variableNames.length-1)];
                            while (variable2 == variable1) variable2 = variableNames[getRandomInt(0, variableNames.length-1)];

                            var endVar = variable2;
                            if (print == 1) endVar = endVar.concat(")");

                            var correct1 = " = 0";
                            var correct2 = "while (";
                            var correct3 = "/= 2";
                            var correct4 = "+= 1";
                            var correct5 = "return ";
                            if (print == 1) correct5 = "print(";

                            /* Sample target code:
                             *var targetCode = "def log(x):\n    i = 0\n    while x > 1:\n        x /= 2\n        i+=1\n    return i";
                             */
                            var code = "def log(".concat(variable1).concat("):\n    ").concat(variable2).concat("<span>'_1'</span>\n    <span>'_2'</span> ").concat(variable1).concat(" > 1):\n        ").concat(variable1).concat(" <span>'_3'</span>\n        ").concat(variable2).concat(" <span>'_4'</span>\n    <span>'_5'</span>").concat(endVar);

                            //Limit number of dropdowns (i.e. don't have 5)
                            var numOfDropdowns = getRandomInt(4, 5);
                            var i = 0;
                            while (i < 6-numOfDropdowns) {
                                var seed = String(getRandomInt(1, 6))
                                var substring = "<span>'_".concat(seed).concat("'</span>");
                                if (code.indexOf(substring) > -1) {
                                    code = code.replace(substring, eval("correct".concat(seed)));
                                    i++;
                                };
                            };

                            var choice31 = "(1, ".concat(variable1).concat(")");
                            var choice32 = "(0, ".concat(variable1).concat("+1)");
                            var choice33 = "(1, ".concat(variable1).concat("+1, 2)");

                            var wrong5 = "";
                            if (print == 1) {
                                wrong5 = "return ";
                            } else {
                                wrong5 = "print(";
                            }
                            var wrongFeedback5 = "Do you want to return or print?";
                            var correctFeedback5 = "Return gives the value back to the function that called it, whereas print writes it to console.";

                            //Create Dropdown info
                            var dropdownInfo = {"'_1'" : {}, "'_2'" : {}, "'_3'" : {}, "'_4'" : {}, "'_5'" : {}};
                            dropdownInfo["'_1'"][" == 0"] = {"feedback" : "Are you assigning a value, or checking for equality?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_1'"][correct1] = {"feedback" : "",
                                                                        "correct" : true,
                                                                        "default" : true};
                            dropdownInfo["'_1'"][" = 1"] = {"feedback" : "Which numeric constant should you start with?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_1'"][" 0"] = {"feedback" : "What symbol do you use to assign a variable?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_2'"]["for "] = {"feedback" : "Do you want to loop a fixed number of times, or an unknown number of times??",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_2'"]["if "] = {"feedback" : "Do you want to merely go through the body once, or multiple times?",
                                                                        "correct" : false,
                                                                        "default" : true};
                            dropdownInfo["'_2'"][correct2] = {"feedback" : "A while loop continually iterates until the conditional following it is false.",
                                                                        "correct" : true,
                                                                        "default" : false};
                            dropdownInfo["'_3'"][correct3] = {"feedback" : "You want i to iterate from 1 to x+1, exclusive of the last argument.",
                                                                        "correct" : true,
                                                                        "default" : false};
                            dropdownInfo["'_3'"]["/ 2"] = {"feedback" : "Are you storing the result of the division anywhere?",
                                                                        "correct" : false,
                                                                        "default" : true};
                            dropdownInfo["'_3'"]["=/ 2"] = {"feedback" : "What is the order of the = and /?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_3'"][choice33] = {"feedback" : "/= first divides the numebrs, and assigns the value to the variable on its left.",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_4'"]["+"] = {"feedback" : "Are you actually storing the value of this addition anywhere?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_4'"][correct4] = {"feedback" : "+= first adds the two numbers, and assigns the result to the variable on the left.",
                                                                        "correct" : true,
                                                                        "default" : true};
                            dropdownInfo["'_4'"]["="] = {"feedback" : "Are you sure you just want to assign the variable?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_4'"]["=+"] = {"feedback" : "What order should the = and *+ go in?",
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_5'"][correct5] = {"feedback" : correctFeedback5,
                                                                        "correct" : true,
                                                                        "default" : false};
                            dropdownInfo["'_5'"][wrong5] = {"feedback" : wrongFeedback5,
                                                                        "correct" : false,
                                                                        "default" : false};
                            dropdownInfo["'_5'"]["return["] = {"feedback" : "What comes after return?",
                                                                        "correct" : false,
                                                                        "default" : true};
                            dropdownInfo["'_5'"]["print "] = {"feedback" : "In Python 3, is print a function or a statement?",
                                                                        "correct" : false,
                                                                        "default" : false};

                            //Create function description
                            var returnStr = "returns ";
                            if (print == 1) returnStr = "prints ";

                            var descr = "Write a function that takes in an integer and ".concat(returnStr).concat(" its log base 2, i.e. the number of times you can divide the integer by 2 before you reach 1.");

                            return {"code" : code, "dropdownInfo" : dropdownInfo, "descr" : descr};

                            break;
                    }
                    break;

            }
            break;
        case 1:
            var infoNum = 0; /*getRandomInt(0,1);*/
            
            /* def f(x)
                  if x % 2 = 0
                        return true;
                   else
                        return false */
            var ifCode = "<span>'_1'</span> <span>'_2'</span>(x)<span>'_3'</span>\n" +
                         "    if x <span>'_4'</span> 2 <span>'_5'</span> 0<span>'_6'</span>\n" +
                         "        return true<span>'_7'</span>\n" +
                         "    else<span>'_8'</span>\n" +
                         "        return false<span>'_9'</span>";
            var _1words = ["def", "function", "fun", "fn"];
            var _1correct = "def";
            var _1word = _1words[Math.floor(Math.random() * _1words.length)];
            var _3words = [" ", ":", "{", ";"];
            var _3correct = ":";
            var _3word = _3words[Math.floor(Math.random() * _3words.length)];
            var _5words = ["==", "="];
            var _5correct = "==";
            var _5word = _5words[Math.floor(Math.random() * _5words.length)];
            var _6words = [" ", ":", "{", ";"];
            var _6correct = ":";
            var _6word = _6words[Math.floor(Math.random() * _6words.length)];
            var _7words = [" ", ":", "{", ";"];
            var _7correct = " ";
            var _7word = _7words[Math.floor(Math.random() * _7words.length)];
            var _8words = [" ", ":", "{", ";"];
            var _8correct = ":";
            var _8word = _8words[Math.floor(Math.random() * _8words.length)];
            var _9words = [" ", ":", "{", ";"];
            var _9correct = " ";
            var _9word = _9words[Math.floor(Math.random() * _9words.length)];
            
            /* function g(x)
                    product == 1
                    for i of xrange x {
                        product * i = product
                return product */
            var loopCode =  "<span>_1</span> <span>_2</span>(x)<span>_3</span>\n" +
                            "    product <span>_4</span> 1\n" +
                            "    for i <span>_5</span> xrange<span>_6</span><span>_7</span>\n" +
                            "        <span>_9</span>\n" +
                            "<span>_9</span>";
            
            var ifDict = {"_1" : _1word, "_2" : "isEven", "_3" : _3word, "_4" : "%", 
                            "_5" : _5word, "_6" : _6word, "_7" : _7word, "_8" : _8word,
                            "_9" : _9word};
            var ifButtonInfo = {"_1" : {}, "_2" : {}, "_3" : {}, "_4" : {}, "_5" : {},
                                "_6" : {}, "_7" : {}, "_8" : {}, "_9" : {}};
            ifButtonInfo["_1"][_1correct] = {"feedback" : "The right way to begin a function is with 'def'.",
                                                "correct" : false};
            ifButtonInfo["_1"]["function"] = {"feedback" : "In Javascript, this is how you define a function, not Python.",
                                                "correct" : true};
            ifButtonInfo["_1"]["fun"] = {"feedback" : "In Standard ML, this is how you define a function, not Python.",
                                                "correct" : true};
            ifButtonInfo["_1"]["fn"] = {"feedback" : "This is used for defining anonymous or lambda functions.",
                                                "correct" : true};
            ifButtonInfo["_2"]["isEven"] = {"feedback" : "You can name your function anything you want.",
                                                "correct" : false};
            ifButtonInfo["_3"][" "] = {"feedback" : "You have to let Python know when you're starting your function.",
                                                "correct" : true};                              
            ifButtonInfo["_3"][_3correct] = {"feedback" : "The colon lets Python know that you're writing your function now.",
                                                "correct" : false};     
            ifButtonInfo["_3"]["{"] = {"feedback" : "In any C-based language this would be right, but not in Python.",
                                                "correct" : true};
            ifButtonInfo["_3"][";"] = {"feedback" : "Close!.",
                                                "correct" : true};  
            ifButtonInfo["_4"]["%"] = {"feedback" : "Any arithmetic operator would work here.",
                                                "correct" : false};
            ifButtonInfo["_5"][_5correct] = {"feedback" : "This is testing for equality, not variable assignment.",
                                                "correct" : false};                                                                                                                                 
            ifButtonInfo["_5"]["="] = {"feedback" : "We are not assigning a variable, but testing for equality.",
                                                "correct" : true};
            ifButtonInfo["_6"][_6correct] = {"feedback" : "We are now going into the body of the if statement by this colon.",
                                                "correct" : false};
            ifButtonInfo["_6"][" "] = {"feedback" : "We need syntax that will allow Python to recognize that we are entering the if statement.",
                                                "correct" : true};
            ifButtonInfo["_6"]["{"] = {"feedback" : "We need syntax that will allow Python to recognize that we are entering the if statement.",
                                                "correct" : true};
            ifButtonInfo["_6"][";"] = {"feedback" : "Close!.",
                                                "correct" : true};
            ifButtonInfo["_7"][_7correct] = {"feedback" : "After any statement without a body doesn't need anything after it, just a new line.",
                                                "correct" : false}; 
            ifButtonInfo["_7"][":"] = {"feedback" : "Nothing is needed after a return statement.",
                                                "correct" : true};                                                                                                                                                                                                                      
            ifButtonInfo["_7"]["{"] = {"feedback" : "Nothing is needed after a return statement.",
                                                "correct" : true};  
            ifButtonInfo["_7"][";"] = {"feedback" : "Nothing is needed after a return statement.",
                                                "correct" : true};  
            ifButtonInfo["_8"][_8correct] = {"feedback" : "We are now going into the body of the else statement by this colon.",
                                                "correct" : false};
            ifButtonInfo["_8"][" "] = {"feedback" : "We need syntax that will allow Python to recognize that we are entering the else statement.",
                                                "correct" : true};      
            ifButtonInfo["_8"]["{"] = {"feedback" : "We need syntax that will allow Python to recognize that we are entering the else statement.",
                                                "correct" : true};
            ifButtonInfo["_8"][";"] = {"feedback" : "We need syntax that will allow Python to recognize that we are entering the else statement.",
                                                "correct" : true};
            ifButtonInfo["_9"][_9correct] = {"feedback" : "We don't need anything after a return statement.",
                                                "correct" : false};
            ifButtonInfo["_9"][":"] = {"feedback" : "A return statement is fine on its own.",
                                                "correct" : true};      
            ifButtonInfo["_9"]["{"] = {"feedback" : "No other syntax needed here.",
                                                "correct" : true};
            ifButtonInfo["_9"][";"] = {"feedback" : "No other syntax needed here.",
                                                "correct" : true};                                                                                                                                                                                                              

            var descr = "Click on the syntax errors in the following code excerpt. Blue buttons mean you've selected a button." +
                        " Click again to deselect. Blank buttons represent white space/no syntax needed.";
            var code = "";
            var buttonDict = {"_1" : {}, "_2" : {}, "_3" : {}, "_4" : {}, "_5" : {},
                                "_6" : {}, "_7" : {}, "_8" : {}, "_9" : {}};
            var buttonInfo = {"_1" : {}, "_2" : {}, "_3" : {}, "_4" : {}, "_5" : {},
                                "_6" : {}, "_7" : {}, "_8" : {}, "_9" : {}};
            if (infoNum == 0) {
                code = ifCode;
                buttonDict = ifDict;
                for (var substring in ifDict) {
                    buttonInfo[substring] = ifButtonInfo[substring][ifDict[substring]];
                }
            }
            else {
                code = loopCode;
                buttonDict = loopDict;
                for (var substring in loopDict) {
                    buttonInfo[substring] = loopButtonInfo[substring][loopDict[substring]];
                }
            }
            return {"code" : code, "buttonInfo" : buttonInfo, "buttonDict" : buttonDict, "descr" : descr};
            break;
        case 2:
            var variableNames = ["x", "y", "z", "n", "i"];
            var functionNames = ["f", "g", "h"];
            //var q2type = getRandomInt(0,1);
            var temp = getRandomInt(0,1);
            var correct_index = 1;
            var left;
            var right;
            var prompt;

            if (temp) correct_index = -1;
            var fun1 = functionNames[getRandomInt(0, functionNames.length-1)];
            var fun2 = functionNames[getRandomInt(0, functionNames.length-1)];
            while (fun2 == fun1) fun2 = functionNames[getRandomInt(0, functionNames.length-1)];
            switch(q2type){
                case 0:
                    var const1 = String(getRandomInt(5,10));
                    var const2 = String(getRandomInt(1,5)); 
                    var var1 = variableNames[getRandomInt(0, variableNames.length-1)];
                    var var2 = variableNames[getRandomInt(0, variableNames.length-1)];
                    while (var2 == var1) var2 = variableNames[getRandomInt(0, variableNames.length-1)];
                    var correctQ2 = "def "+fun1+"("+var1+"):\n"
                                   +"    if "+var1+" < "+const1+"\n"
                                   +"        "+var2+" = "+const2+"\n"
                                   +"        return "+var2+" + "+var1+"\n" 
                                   +"    return "+var1;
                    var wrongQ2 =   "def "+fun2+"("+var1+"):\n"
                                   +"    if "+var1+" < "+const1+"\n"
                                   +"        "+var2+" = "+const2+"\n"
                                   +"    return "+var2+" + "+var1+"\n" 
                                   +"    return "+var1;

                    var rdmnum = getRandomInt(0,const1);
                    var hint = "What will "+fun2+"("+String(rdmnum)+") return?";
                    if (correct_index == 1){
                        left = correctQ2;
                        right = wrongQ2;
                    }
                    else{
                        right = correctQ2;
                        left = wrongQ2;
                    }
                    prompt = "adds "+const2+
                          " to an integer if it is less than "+const1;
                    console.log(left);
                    return {"leftCode":left,
                            "rightCode":right,
                            "question":prompt,
                            "ca":correct_index,
                            "hint":hint};
                case 1:
                    var constantnum = getRandomInt(2,7); 
                    var constant = String(constantnum);
                    var vari = variableNames[getRandomInt(0, variableNames.length-1)];
                    var correctQ2 = "def "+fun1+"("+vari+"):\n"
                                   +"    result = False\n"
                                   +"    if "+vari+" % "+constant+" == 0:\n"
                                   +"        result = True\n"
                                   +"    return result" ;

                    var wrongQ2 =   "def "+fun2+"("+vari+"):\n"
                                   +"    result = False\n"
                                   +"    if "+vari+" % "+constant+" == 0:\n"
                                   +"        result = True\n"
                                   +"        return result"  ;
                    if (correct_index == 1){
                        left = correctQ2;
                        right = wrongQ2;
                    }
                    else{
                        right = correctQ2;
                        left = wrongQ2;
                    }
                    var rdmnum = getRandomInt(1,constantnum-1);
                    var mult = getRandomInt(2,6);
                    var finalnum = rdmnum + (mult * constantnum);
                    var hint = "What will "+fun2+"("+String(finalnum)+") return?";
                    prompt = "calculates if an integer is a multiple of "+constant;
                    console.log(left);
                    return {"leftCode":left,
                            "rightCode":right,
                            "question":prompt,
                            "ca":correct_index,
                            "hint":hint};
            }
            break;
    };
}

//from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getRandomKey = function (obj) {
    var num = getRandomInt(0, Object.keys(obj).length-1);
    var i = 0;
    for (var key in obj) {
        if (i == num) return key;
        i++;
    }
}

var dropdownToListOfOptions = function (dropdown) {
    var text = dropdown.text();
    var begin = "<li><a>";
    var end = "</a></li>";
    var list = [];
    while (text.indexOf(begin) > -1) {
        text = text.slice(text.indexOf(begin)+begin.length);
        var option = text.slice(0, text.indexOf(end));
        list.push(option);
    };
    return list;
};

var dropdownToDefaultLabel = function (dropdown) {
    //Label is the text after the first > and before the next <
    var begin = '>';
    var end = '<';
    var currText = dropdown.text();
    console.log(currText);
    currText = currText.slice(currText.indexOf(begin)+begin.length, currText.indexOf(end, currText.indexOf(begin)));
    console.log(currText);
    return currText;
};

var decodeHTMLEntities = function (text) {
    var entities = {"&lt;" : "<",
                    "&gt;" : ">"};
    for (var key in entities) {
        text = text.replace(key, entities[key]);
    };
    return text;
};

