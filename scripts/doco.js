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
		var markup = "<li><input type=\"radio\" name=\"tweak_script\" id=\"${id}\"/><label for=\"${id}\">${title}</label>"+
					 "{{if has_video}} <img src=\"images/videoicon.png\" width=\"18\" height=\"18\" alt=\"Video Documentation\">{{/if}}</li>";
		jQuery.template( "docoTemplate", markup);
		jQuery("#loading").remove();
		// read packages in
 		jXML.find("package").each(function(){
 			if (jQuery(this).find("available").text() == "true") {
				var type = jQuery(this).find("type").text().replace(" ", "");
				var tweakData = {	id : jQuery(this).attr("id"),
									title : jQuery(this).find("title").text(),
									has_video: (jQuery(this).find("video").text().length > 0) };
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
 			jQuery("#example").show().find("img").attr("src", "images/"+thisID+".png").addClass("maxheight");
 			// video
 			var videoEmbed = tweakData.find("video").text();
 			if (videoEmbed.length > 0) {
 				jQuery("#video iframe").remove();
 				jQuery("#video").show().find("img").show().unbind("click").click(function(){
 					jQuery(this).hide();
 					jQuery(this).after(videoEmbed);
 				});
 			} else
 				jQuery("#video").hide();
		});
		jQuery("#example img").click(function(){ jQuery(this).toggleClass("maxheight"); });
		// presentation
		jQuery("#output ul").css({"min-height": jQuery("#output ul:first").height()+"px"});
		jQuery("#expand a:last").click(function(){
			if (jQuery("#output input:checked").length)
				jQuery("#code").toggle();
			else
				alert("Select a Tweak above");
			return false; 
		});
		// version default BB9_x
		jQuery("#BB9_x").click();
		// item selected?
		if (location.hash.length) { jQuery(location.hash).click(); }
	}
});
// utility formatting functions
function inlineFormatInstructions(element) {
	jQuery(element).html(jQuery(element).html().replace(/&lt;br[\/]?&gt;/g, "<br/>").replace(/'/g, "\""));
}
// revisit this if _x transition code is more than temporary
function buildCode(title, id, embedCode) {
	var message = ". <br/><"+"!-- TweakID="+id+"-->This <a href=\"http://tweaks.github.com/Tweaks/index.html\" target=\"_new\">Tweak</a> is for trial purposes only and is running off an remote server. It will only work if internet access is available.<br/>Refer to the <a href=\"http://tweaks.github.com/Tweaks/description.html#"+id+"\" target=\"_new\">Tweaks Site for instructions</a>.<br/><p>"+
	"This item will be hidden in Edit Mode: OFF (i.e. the view that students see).</p>";
	// insert repository path into setup script and embedCode
	embedCode = embedCode.replace(/'s/g, "'"+sourceRepositoryURL+"s");
	// transition testing 9_x release of code
	if (jQuery("#BB9_x_message:visible").length)
		embedCode = embedCode.replace("/scripts/", "/scripts/_x/");	
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