/* Syntax Excercise
 * Authors: Amal Nanavati, Ashley Wong, Emma Zhone
 * AndrewIDs: arnanava, 
 */

/* runs the game
 */
var main = function (ex) {
    /* 0 = code with dropdown
     * 1 = code with click-the-error
     * 2 = sode with different whitespaces
     */
    var questionType = 0;

    var showQuestion = function () {
        switch (questionType) {
            case 0:
                /* Create the code well */
                var x = 50;
                var y = 50;
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
                                            ")" : {"feedback" : "What goes att he end of every function definition?",
                                                    "correct" : false,
                                                    "default" : false}},
                                    "'_2'" : {"5*x;" : {"feedback" : "What, if anything, goes at the end of every line?",
                                                    "correct" : false,
                                                    "default" : true},
                                            "5x" : {"feedback" : "You need an operator between the 5 and the x.",
                                                    "correct" : false,
                                                    "default" : false},
                                            "x+x+x+x+x" : {"feedback" : "",
                                                    "correct" : true,
                                                    "default" : false},
                                            "5(x)" : {"feedback" : "You need an operator between the 5 and the x.",
                                                    "correct" : false,
                                                    "default" : false}}};
                var codeWell = createCodeWellWithOptions(ex, x, y, code, dropdownInfo, true, true);

                /* Create the instructions/description of code */
                
                break;
            case 1:
                break;
            case 2:
                break;
        }
    }
    
    showQuestion();
    
}

/* text is the string of code, dropdownInfo is a dictionary where the keys
 * are the substrings within text to replace, and the values are dictionaries
 * in which the keys corresponds to the dropdown options,
 * and the values are dictionaries with the "feedback" key mapping to a string 
 * of feedback for when the user chooses that option, the "correct" key
 * mapping to a bool representing whether that option is correct or not, and 
 * the "default" key mapping to a bool indicating whether that element is the
 * default or not.
 */
var createCodeWellWithOptions = function (ex, x, y, code, dropdownInfo, showFeedbackIfCorrect, showFeedbackIfWrong) {

    /* Success and failure functions, which will be called when the user selects
     * an option on the dropdown
     */
    var getSuccessFn = function (feedback) {
        return function () {
            feedback = "Correct!  ".concat(feedback);
            var message = ex.alert(feedback, {
                    fontSize: 18,
                    stay: true,
                    opacity: 0.8
            });
        };
    };
    var getFailureFn = function (feedback) {
        return function () {
            feedback = "Incorrect!  ".concat(feedback);
            var message = ex.alert(feedback, {
                    fontSize: 18,
                    stay: true,
                    opacity: 0.8
            });
        };
    };

    /* Create the code well */
    var codeWell = ex.createCode(x, y, code, {size:"large"});

    /* Create the dropdown */
    for (var substring in dropdownInfo) {
        if (dropdownInfo.hasOwnProperty(substring)) {
            /* Create the dropdown options object */
            var elements = {};
            var defaultStr = "";
            for (var option in dropdownInfo[substring]) {
                if (dropdownInfo[substring].hasOwnProperty(option)) {
                    var correct = dropdownInfo[substring][option]["correct"];
                    if (dropdownInfo[substring][option]["default"]) {
                        defaultStr = option;
                    }
                    var feedback = undefined;
                    if (correct) {
                        if (showFeedbackIfCorrect) {
                            feedback = dropdownInfo[substring][option]["feedback"];   
                        } 
                        elements[option] = getSuccessFn(dropdownInfo[substring][option]["feedback"]);
                    } else {
                        if (showFeedbackIfWrong) {
                            feedback = dropdownInfo[substring][option]["feedback"];   
                        } 
                        elements[option] = getFailureFn(dropdownInfo[substring][option]["feedback"]);
                    }
                }
            }

            /* Create the dropdown */
            var codeDrop = ex.createDropdown(0,0,defaultStr,{elements: elements});

            /* Insert the dropdown into the codeWell */
            ex.insertDropdown(codeWell, substring, codeDrop);
        }
    }
    return codeWell;
};
