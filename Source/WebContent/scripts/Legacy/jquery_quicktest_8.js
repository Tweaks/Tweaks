jQuery(function($){
  // new 8
  var editMode = jQuery("#endActionBar").length > 0; 
  var page = editMode ?  jQuery("#endActionBar ~ table:eq(0)") : jQuery("h1.pageTitle").next("table");
  page.attr("id", "pageList");
  
	$("#pageList .quiz").each(function(q){
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