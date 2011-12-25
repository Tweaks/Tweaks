/** 
 * jquery_hideshow (1.0) is script that can be added to a content item in blackboard
 * it prepends show hide toggle link and functionality to div tags marked class="hidden"
 * author Tim Plaisted 2010
 */

// Usage 1. wrap content in <div class="hidden">YOUR CONTENT</div>

// Optional add <span id="showHideInstruction">[Your own hide show instruction here]</span>
// Optional add '<div class="hidemyrow"></div>' somewhere to hide a row

var defaultInstruction = "Show/hide text";	// change this for default instructional text
var hideClass = "hidden";

jQuery(function($) {
 // new 8
 var editMode = jQuery("#endActionBar").length > 0; 
 var page = editMode ?  jQuery("#endActionBar ~ table:eq(0)") : jQuery("h1.pageTitle").next("table");
 page.attr("id", "pageList");
  
 instText = ($("#showHideInstruction").length) ? $("#showHideInstruction").text() : defaultInstruction;
 //9: $("<a href='#' class='hideShowLink'>"+instText+"</a>").insertBefore("#pageList li div."+hideClass).css("display", "block");
 $("<a href='#' class='hideShowLink'>"+instText+"</a>").insertBefore("#pageList tr div."+hideClass).css("display", "block");
 $("#pageList a.hideShowLink").click(function(e){ $(this).next().toggleClass("hidden"); e.preventDefault();});
 if(location.href.indexOf('listContent.') > 0){
	 //9: $("#pageList .hidemyrow").parents("li").hide();
	 $("#pageList .hidemyrow").parents("tr").hide();
	 $("#showHideInstruction").hide();
 }
});