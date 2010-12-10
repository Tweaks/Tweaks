/* 
   Copyright 2010 Tim Plaisted, Queensland University of Technology

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
jQuery(function($){
	$(tweak_bb.page_id +" .quiz").each(function(q){
		$(this).attr("id", "quiz"+q).wrapInner("<span class=\"question\"></span>").addClass("quicktest");
		
		// answers
		var answers = $(this).nextAll("table:eq(0)").hide().find("tr");
		var formattedanswers = "";
		for (var a = 0; a < answers.length; a++) {
			var answerid = "quiz" + q +"_"+ a;
			formattedanswers += "<div class=\"answer\">"+
								  "<input type=\"radio\" name=\"quiz"+q+"\" id=\""+answerid+"\" value=\""+a+"\"/>"+
								  "<label for=\""+answerid+"\">"+$(answers).eq(a).find("td").eq(0).html()+"</label></div>";
		};
		$("#quiz"+q).append(formattedanswers+"<div class=\"feedback\">feedback</div>");
		$("#quiz"+q+" input").each(function(i){
			$(this).data("answer", $(answers).eq(i).find("td").eq(1).html());
		}).click(function(){
			$("#quiz"+q+" .feedback").html($(this).data("answer")).show();
		});
	});
});