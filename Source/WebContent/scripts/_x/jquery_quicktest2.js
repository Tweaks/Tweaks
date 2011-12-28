/* 
   Copyright 2011 Tim Plaisted, Queensland University of Technology

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
// tweak default variables
if (window.tweak_bb == null || window.tweak_bb.page_id == null)
    window.tweak_bb = { page_id: "#pageList", row_element: "li" };

tweak_bb.setupQuiz = function($){
    $(tweak_bb.page_id +" .quiz:not('.setup')").addClass("setup").each(function(q){
        var item_id = $(this).parents(tweak_bb.row_element).find(".item").attr("id");
        var quiz_id = "quiz" + item_id + "_" + q;
        $(this).attr("id", quiz_id).wrapInner("<span class=\"question\"></span>").addClass("quicktest");
        // answers
        var answers = $(this).nextAll("table,*:has(table)").eq(0).hide().find("tr");
        var formattedanswers = "";
        for (var a = 0; a < answers.length; a++) {
            var answerid = quiz_id + "_" + a;
            formattedanswers += "<div class=\"answer\">"+
                                  "<input type=\"radio\" name=\""+quiz_id+"\" id=\""+answerid+"\" value=\""+a+"\"/>"+
                                  "<label for=\""+answerid+"\">"+$(answers).eq(a).find("td").eq(0).html()+"</label></div>";
        };
        $("#"+quiz_id).append(formattedanswers+"<div class=\"feedback\">feedback</div>");
        $("#"+quiz_id+" input").each(function(i){
            $(this).data("answer", $(answers).eq(i).find("td").eq(1).html());
        }).click(function(){
            $("#"+quiz_id+" .feedback").html($(this).data("answer")).show();
        });
    });
};

jQuery(function($){     
    tweak_bb.setupQuiz($);
});