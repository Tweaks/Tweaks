var tweakVersions = {
	BB8   : ["hider", "replaceicon", "showhidetext", "imagemapper", "printframe", "quicktest", "icons", "unitmap", "checklist", "Submenu"],
	BB9   : ["hider", "addcolourstripe", "replaceicon", "showhidetext", "imagemapper", "printframe", "quicktest", "deeplink", "iframecontent", "addstyle", "colourpage", "rightPod", "quickpoll", "icons", "unitmap", "selfenrol", "collapsemenu", "visualunitmap", "backtotoplink", "checklist", "noContentWrapper", "Submenu", "subsite", "banner", "faq"],
	BB9_x : ["hider", "replaceicon", "showhidetext", "imagemapper", "printframe", "iframecontent", "addstyle", "colourpage", "icons", "backtotoplink", "banner"]};

// build selector: template is too much work!
jQuery.each(tweakVersions, function(key, value) {
	jQuery("#BBVersions").append("<input type=\"radio\" name=\"bbvers\" id=\""+key+"\"><label for='"+key+"'>"+key+"</label>"); 
});

// attach event
jQuery("#BBVersions input").live("click", function(){
	var version = jQuery(this).attr("id");
	displayVersionTweaks(version);
	if (version == "BB8")
		jQuery("#expand, #code").hide();
	else
		jQuery("#expand").show();
	jQuery("#BB9_x_message").toggle(version == "BB9_x");
});

// default select BB9
jQuery("#BB9").click();

// display correct tweaks for version
function displayVersionTweaks(bbVersion) {
	var tweaksArray = tweakVersions[bbVersion];
	jQuery("li").each(function(){
		var id = jQuery(this).find("input").attr("id");
		if (id) {jQuery(this).toggle(jQuery.inArray(id, tweaksArray) > -1);}
	});
}