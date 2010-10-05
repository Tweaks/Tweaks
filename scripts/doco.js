// process settings XML from repository
var jXML;
var sourceRepositoryURL = "http://tweaks.github.com/Tweaks/Source/WebContent/";
jQuery.ajax({
    type: "GET",
	url: sourceRepositoryURL+"admin/tweak_packages.xml",
	dataType: "xml",
	success: function(xml) {
 		jXML = jQuery(xml);
		// set up packages container
		var packages = {}; jQuery("#output ul").each(function(){ packages[jQuery(this).attr("id")]=new Array(); });
 		// set up template
		var markup = "<li><input type=\"radio\" name=\"tweak_script\" id=\"${id}\"/><label for=\"${id}\">${title}</label></li>";
		jQuery.template( "docoTemplate", markup);
		// read packages in
 		jXML.find("package").each(function(){
 			if (jQuery(this).find("available").text() == "true") {
				var type = jQuery(this).find("type").text().replace(" ", "");
				var tweakData = {	id : jQuery(this).attr("id"),
									title : jQuery(this).find("title").text() };
				packages[type].push(tweakData);
 			}
		});
		// render packages
		jQuery.each(packages, function(key, value) {
			jQuery.tmpl("docoTemplate", value).appendTo("#"+key);
		});
		// sort package lists
		jQuery("#output ul").each(function(){ sortList(jQuery(this)); });
 		// attach doco events
		jQuery("#output input").live('click', function(){
			var thisID = jQuery(this).attr("id");
			var tweakData = jXML.find("package[id='"+thisID+"']");
 			jQuery("#doco").text(tweakData.find("instruction").text());
 			buildCode(tweakData.find("title").text(), thisID, tweakData.find("embed").text());
 			inlineFormatInstructions("#doco");
 			inlineFormatInstructions("#code");
 			jQuery("#doco").append("<br/><img src=\"images/"+thisID+".png\"/>");
 			// check if BB9 selected
 			if (jQuery("#BBVersions input:checked").attr("id") == "BB9")
	 			jQuery("#expand").show();
	 		else
	 			jQuery("#expand").hide();
		});
		// presentation
		jQuery("#output ul").css({"min-height": jQuery("#output ul:first").height()+"px"});
		jQuery("#expand").click(function(){jQuery("#code").toggle(); return false; });
	}
});
// utility formatting functions
function inlineFormatInstructions(element) {
	jQuery(element).html(jQuery(element).html().replace(/&lt;br[\/]?&gt;/g, "<br/>").replace(/'/g, "\""));
}
function buildCode(title, id, embedCode) {
	var message = ".<br/><"+"!-- TweakID="+id+"-->This <a href=\"http://tweaks.github.com/Tweaks/index.html\" target=\"_new\">Tweak</a> is for trial purposes only and is running off an remote server. It will only work if internet access is available.<br/>Refer to the <a href=\"http://tweaks.github.com/Tweaks/description.html\" target=\"_new\">Tweaks Site for instructions</a>.<br/><br/>"+
	"This item will be hidden in Edit Mode: OFF (i.e. the view that students see).";
	// insert repository path into setup script and embedCode
	embedCode = embedCode.replace("'s","'"+sourceRepositoryURL+"s");
	var scriptBlock = "<"+"script src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js\" type=\"text/javascript\"></"+"script><br/>"+
		"<"+"script src=\""+sourceRepositoryURL+"jquery.tweakSetup.js\" type=\"text/javascript\"><"+"/script><br/>"+
		"<"+"script type=\"text/javascript\" class=\"tweak_script\">"+
		"jQuery(function($) {$.xLazyLoader({"+embedCode+"});});<"+
		"/script>";
	jQuery("#code").text(title+message+scriptBlock);
}
// utility sort function adapted from http://www.onemoretake.com/2009/02/25/sorting-elements-with-jquery/
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