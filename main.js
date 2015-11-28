/** 
 * @file Syntax-Exercise
 * @author Amal Nanavati, Ashley Wong, Emma Zhong
 */

var main = function(ex){
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
        	 	 height:code.height});
		}
		code.clear = function(){
			if (code.well != undefined){
				code.well.remove();
			}
		}
		code.onClick = function(){
			ex.graphics.ctx.strokeStyle = "red";
			ex.graphics.ctx.strokeRect(code.x,code.y,code.width,code.height);
		}
	}

	function IndentPrac(leftCode,rightCode,question,ra){
		var q = {}
		q.leftCard = CodeCard(true,leftCode);
		q.rightCard = CodeCard(false,rightCode);
		q.question = question;
		q.ra = ra;
	}
};