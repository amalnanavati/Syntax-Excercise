/* Syntax Excercise
 * Authors: Amal Nanavati, Ashley Wong, Emma Zhong
 * AndrewIDs: arnanava, ,jzhong1
 */

/* runs the game
 */
var main = function (ex) {
    /* 0 = code with dropdown
     * 1 = code with click-the-error
     * 2 = sode with different whitespaces
     */
    var questionType = 0;

    /* Which question number we are on (useful if we only want 10 questions) */
    var questionNum = 1;

    /* Used in question type 0, this is a list of dropdowns and the correct 
     * answer for each dropdown 
     */
    var dropdownList = undefined;

    /* Keeps track of whether the correct answer is being displayed or not
     */
    var isCorrectAnswerBeingDisplayed = false;
    var oldAnswers = []; // Used in Q type 0 to restore old answers after unshowing CA
    
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

    var type2List = [IndentPrac(leftCode1,rightCode1,
    	"calculates if an integer is a multiple of 4",1)];

    var currentIndentPrac = type2List[0];

    /* Shows the appropriate question type
     */
    var showQuestion = function () {
        switch (questionType) {
            case 0:
                /* Create the code well */
                var x = 50;
                var y = 100;
                var margin = 50;
                var width = ex.width()-x-margin;
                var height = ex.height()-y-margin;
                var code = "def f(x<span>'_1'</span>\n    return <span>'_2'</span>";
                var dropdownInfo = {"'_1'" : {":)" : {"feedback" : "Should the colon be inside or outside the parenthesis?",
                                                    "correct" : false,
                                                    "default" : false},
                                            "):" : {"feedback" : "First you close the parenthesis that lists the arguments, and then you put a colon.",
                                                    "correct" : true,
                                                    "default" : false},
                                            ");" : {"feedback" : "Check your colon.",
                                                    "correct" : false,
                                                    "default" : true},
                                            ")" : {"feedback" : "What goes at the end of every function definition?",
                                                    "correct" : false,
                                                    "default" : false}},
                                    "'_2'" : {"5*x;" : {"feedback" : "What, if anything, goes at the end of every line?",
                                                    "correct" : false,
                                                    "default" : true},
                                            "5x" : {"feedback" : "You need an operator between the 5 and the x.",
                                                    "correct" : false,
                                                    "default" : false},
                                            "x+x+x+x+x" : {"feedback" : "Python does not use any symbol to indicate the end of a linr.",
                                                    "correct" : true,
                                                    "default" : false},
                                            "5(x)" : {"feedback" : "You need an operator between the 5 and the x.",
                                                    "correct" : false,
                                                    "default" : false}}};
                dropdownList = createCodeWellWithOptions(ex, x, y, width, height, code, dropdownInfo, true, true);

                /* Create the instructions/description of code */
                var text = "Write a function that takes in an integer and returns that integer multiplied by 5"
                var header = ex.createParagraph(0,0,text,{size: "xlarge", width:ex.width(), textAlign:"center"});

                break;
            case 1:
                break;
            case 2:
            	/* delete and draw */
                ex.graphics.ctx.clearRect(0,0,ex.width(),ex.height());
                currentIndentPrac.draw();
        };
    };

    /* Handles clicks to the submit button
     */
    var submit = function () {
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
                    console.log(currText);
                    if (currText.indexOf(dropdownList[i].correct) > -1) {
                        numOfCorrectDropdowns = numOfCorrectDropdowns + 1;
                    };
                    /* Disable dropdown */
                    dropdownList[i].dropdown.disable();
                };
                var beginning = "";
                if (numOfCorrectDropdowns == dropdownList.length) beginning = "Congratulations!  "
                if (numOfCorrectDropdowns >= dropdownList.length/2) beginning = "Good job!  "
                var feedback = beginning.concat("You got ").concat(String(numOfCorrectDropdowns)).concat(" dropdowns correct out of ").concat(String(dropdownList.length)).concat(".  Press 'Next' to move on.");
                ex.showFeedback(feedback);
                /* Enable Display CA Button */
                ex.chromeElements.displayCAButton.enable();
                break;
            case 1:
                break;
            case 2:
                
        };
        /* Create the next button */
        var x = ex.width()-100;
        var y = ex.height()-50;
        var nextButton = ex.createButton(x, y,"Next", {
                                                        color: "white",
                                                        size: "medium"
                                                      });
        nextButton.on("click", function () {
            isCorrectAnswerBeingDisplayed = false;
            questionNum++;
            questionType = 2;
            /* USE THIS SPACE TO CHANGE QUESTION TYPE OR TO CHECK IF YOU HAVE 
             * REACHED THE MAX NUMBER OF QUESTIONS! 
             */
            showQuestion();
            nextButton.remove();
            /* Disable Display CA Button */
            ex.chromeElements.displayCAButton.disable();
        });
    };

    /* Handles clicks to the submit button
     */
    var displayCA = function () {
        switch (questionType) {
            case 0:
                console.log(isCorrectAnswerBeingDisplayed);
                if (isCorrectAnswerBeingDisplayed) {
                    isCorrectAnswerBeingDisplayed = false;
                    for (var i = 0; i < dropdownList.length; i++) {
                        dropdownList[i].dropdown.text(oldAnswers[i]);
                        console.log(dropdownList[i].dropdown.text());
                    };
                } else {
                    isCorrectAnswerBeingDisplayed = true;
                    for (var i = 0; i < dropdownList.length; i++) {
                        oldAnswers[i] = dropdownList[i].dropdown.text();
                        dropdownList[i].dropdown.text(dropdownList[i].correct);
                        console.log(dropdownList[i].dropdown.text());
                    };
                };
                break;
            case 1:
                break;
            case 2:
                break;
        };
    };

    /* Turns on/off buttons and handlers
     */
    var setUp = function () {
        switch (questionType) {
            case 0:
                ex.chromeElements.submitButton.enable();
                ex.chromeElements.submitButton.off("click");
                ex.chromeElements.submitButton.on("click", submit);
                ex.chromeElements.displayCAButton.disable();
                ex.chromeElements.displayCAButton.off("click");
                ex.chromeElements.displayCAButton.on("click", displayCA);
                ex.chromeElements.undoButton.disable();
                ex.chromeElements.undoButton.off("click");
                ex.chromeElements.undoButton.on("click", function () {});
                ex.chromeElements.redoButton.disable();
                ex.chromeElements.redoButton.off("click");
                ex.chromeElements.redoButton.on("click", function () {});
                ex.chromeElements.resetButton.enable();
                ex.chromeElements.resetButton.off("click");
                ex.chromeElements.resetButton.on("click", function () {});
                ex.chromeElements.newButton.enable();
                ex.chromeElements.newButton.off("click");
                ex.chromeElements.newButton.on("click", function () {});
                break;
            case 1:
                break;
            case 2:
                ex.chromeElements.submitButton.enable();
                ex.chromeElements.submitButton.off("click");
                ex.chromeElements.submitButton.on("click", currentIndentPrac.submit);
        };
    };

    var run = function () {
        setUp();
        showQuestion();
    }

    function CodeCard(left,content){
        var code = {};
        code.margin = 10;
        code.left = left;
        if (code.left) code.x = code.margin;
        else code.x = code.margin + ex.width()/2;
        code.y = 10;
        code.width = ex.width()/2 - code.margin*2;
        code.height = ex.height()*2/3;
        code.content = content;
        code.well = undefined;
        code.clicked = false;
         
        code.draw = function(){
        	console.log(code.width,code.height);
            code.well = ex.createCode(code.x,code.y,code.content,
                {language:"python",
                 selectable:true,
                 border:"none",
                 width:code.width,
                 height:code.height
                }).on("click",function(){
                    code.clicked = true;
                    code.highlight();
                    if (code.left) {
                        currentIndentPrac.clicked = 1;
                        currentIndentPrac.rightCard.clicked = false;
                    }
                    else {
                        currentIndentPrac.clicked = -1;
                        currentIndentPrac.leftCard.clicked = false;
                    }
                    currentIndentPrac.redrawCard();}
                    );
            ex.graphics.ctx.strokeStyle = "grey";
            ex.graphics.ctx.strokeRect(code.x,code.y,code.width,code.height);
            if (code.clicked) code.highlight();
        }
        code.clear = function(){
            ex.graphics.ctx.clearRect(code.x-code.margin,code.y-code.margin,
            	ex.width()/2,code.height+15);
            if (code.well != undefined){
                code.well.remove();
            }
        }
        code.highlight = function(){
            ex.graphics.ctx.strokeStyle = "red";
            ex.graphics.ctx.strokeRect(code.x-4,code.y-2,code.width+6,code.height+4);
        }
        return code;
    }

    function IndentPrac(leftCode,rightCode,question,ca){
        var q = {}
        q.leftCard = CodeCard(true,leftCode);
        q.rightCard = CodeCard(false,rightCode);
        q.question = question;
        q.ca = ca;
        q.clicked = 0;
        q.textPara = undefined;
        q.x = 20;
        q.y = ex.height()*3/4;
        
        q.drawQuestion = function(){
            q.textPara = ex.createParagraph(q.x,q.y,
                "Click on the code that correctly "+q.question);
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
        	if (q.clicked == 0){
        		ex.alert("Please select a choice!",{
                    fontSize: 20,
                    stay: true,
                    color:"yellow"
            });
        	}
        	else {
        		if (q.clicked == ca){
        			ex.alert("Correct!",{
                    fontSize: 20,
                    stay: true,
                    color:"green"
            });
        		}
        		else ex.alert("Incorrect!",{
                    fontSize: 20,
                    stay: true,
                    color:"red"
            });
        	}
        }
        return q;
    }

    run();
    
}

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
var createCodeWellWithOptions = function (ex, x, y, width, height, code, dropdownInfo, showFeedbackIfCorrect, showFeedbackIfWrong) {

    /* Success and failure functions, which will be called when the user selects
     * an option on the dropdown
     */
    var getSuccessFn = function (feedback) {
        return function () {
            feedback = "Correct!  ".concat(feedback);
            var message = ex.alert(feedback, {
                    fontSize: 20,
                    stay: true,
                    color:"green"
            });
        };
    };
    var getFailureFn = function (feedback) {
        return function () {
            feedback = "Incorrect!  ".concat(feedback);
            var message = ex.alert(feedback, {
                    fontSize: 20,
                    stay: true,
                    color:"red"
            });
        };
    };

    /* Create the code well */
    var codeWell = ex.createCode(x, y, code, {size:"large", width:width, height:height});

    /* Create the dropdown */
    var dropdownList = [];
    for (var substring in dropdownInfo) {
        if (dropdownInfo.hasOwnProperty(substring)) {
            /* Create the dropdown options object */
            var elements = {};
            var defaultStr = "";
            var correctAnswer = undefined;
            for (var option in dropdownInfo[substring]) {
                if (dropdownInfo[substring].hasOwnProperty(option)) {
                    var correct = dropdownInfo[substring][option]["correct"];
                    if (dropdownInfo[substring][option]["default"]) {
                        defaultStr = option;
                    };
                    var feedback = undefined;
                    if (correct) {
                        correctAnswer = option;
                        if (showFeedbackIfCorrect) {
                            feedback = dropdownInfo[substring][option]["feedback"];   
                        } ;
                        elements[option] = getSuccessFn(dropdownInfo[substring][option]["feedback"]);
                    } else {
                        if (showFeedbackIfWrong) {
                            feedback = dropdownInfo[substring][option]["feedback"];   
                        } ;
                        elements[option] = getFailureFn(dropdownInfo[substring][option]["feedback"]);
                    };
                };
            };

            /* Create the dropdown */
            var codeDrop = ex.createDropdown(0,0,defaultStr,{elements: elements});

            /* Insert the dropdown into the codeWell */
            ex.insertDropdown(codeWell, substring, codeDrop);

            /* Add the dropdown and correct answer to the list */
            dropdownList.push({"dropdown":codeDrop, "correct":correctAnswer});
        };
    };
    return dropdownList;
};
