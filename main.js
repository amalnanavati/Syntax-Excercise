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
    };

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
            code.well = ex.createCode(x,y,code.content,
                {language:"python",
                 selectable:true,
                  width:code.width
                  height:code.height}).on("click",function(){
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
            if (code.clicked) code.highlight();
        }
        code.clear = function(){
        	ex.graphics.ctx.clearRect(code.x,code.y,code.width,code.height);
            if (code.well != undefined){
                code.well.remove();
            }
        }
        code.highlight = function(){
            ex.graphics.ctx.strokeStyle = "red";
            ex.graphics.ctx.strokeRect(code.x,code.y,code.width,code.height);
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
        q.x = 
        q.drawQuestion = function(){
        	ex.createParagraph(q.x,q.y,
        		"Click on the code that correctly"+q.question);
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
        return q;
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
