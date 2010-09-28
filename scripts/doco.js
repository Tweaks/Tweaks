var jXML;
var sourceRepositoryURL = "http://tweaks.github.com/Tweaks/Source/WebContent/";
jQuery.ajax({
    type: "GET",
	url: sourceRepositoryURL+"admin/tweak_packages.xml",
	dataType: "xml",
	success: function(xml) {
 		jXML = jQuery(xml);
		var html = "";
 		jXML.find("package").each(function(){
 			var id = jQuery(this).attr("id");
 			var title = jQuery(this).find("title").text();
 			var type = jQuery(this).find("type").text();
 			var available = jQuery(this).find("available").text();
 			// quick way to sort the lists?
 			if (available == "true")
 				jQuery("#"+type.replace(" ", "")).append("<li><input type=\"radio\"  name=\"tweak_script\" id=\""+id+"\" class=\""+type+"\"/>"+"<label for='"+id+"'>"+title+"</label></li>");
		});
		// sort lists
		jQuery("#output ul").each(function(){ sortList(this); });
 		// attach doco events
		jQuery("#output input").live('click', function(){
			var thisID = jQuery(this).attr("id");
			var tweakData = jXML.find("package[id='"+thisID+"']");
 			jQuery("#doco").text(tweakData.find("instruction").text());
 			buildCode(tweakData.find("embed").text());
 			inlineFormatInstructions("#doco");
 			inlineFormatInstructions("#code");
 			jQuery("#doco").append("<br/><img src=\""+sourceRepositoryURL+thisID+".png\"/>");
 			jQuery("#expand").show();
		});
		// move to CSS
		jQuery("#output li").css({"margin-left": "0", "padding-left":"0"});
		jQuery("#output ul").each(function(){ jQuery(this).find("li:first").css({"font-weight": "bold"});});
		jQuery("#output ul").css({"margin":"0 5px 5px 0", "padding":"5px", "border": "1px solid grey", "list-style":"none", "font-family": "Calibri, Trebuchet MS, Helvetica", "float": "left", "min-width": "240px", "padding-right": "6px"});
		jQuery("#output ul").css({"min-height": jQuery("#output ul:first").height()+"px"});
		jQuery("#expand").click(function(){jQuery("#code").toggle()});
	}
});
function inlineFormatInstructions(element) {
	jQuery(element).html(jQuery(element).html().replace(/&lt;br[\/]?&gt;/g, "<br/>").replace(/'/g, "\""));
}
function buildCode(embedCode) {
	// insert path
	embedCode = embedCode.replace("'s","'"+sourceRepositoryURL+"s");
	// jquery + setup
	var scriptBlock = "<"+"script src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js\" type=\"text/javascript\"></"+"script><br/>"+
		"<"+"script src=\""+sourceRepositoryURL+"jquery.tweakSetup.js\" type=\"text/javascript\"><"+"/script><br/>"+
		"<"+"script type=\"text/javascript\">"+embedCode+"<"+"/script>";
	// add in path..
	jQuery("#code").text(scriptBlock);
}
// utility function adapted from http://www.onemoretake.com/2009/02/25/sorting-elements-with-jquery/
function sortList(ul) {
	var listitems = ul.children('li:gt(0)');
	if (listitems) {
		listitems = listitems.get();
		listitems.sort(function(a, b) {
		   var compA = $(a).text().toUpperCase();
		   var compB = $(b).text().toUpperCase();
		   return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
		})
		jQuery.each(listitems, function(idx, itm) { ul.append(itm); });
	}
}