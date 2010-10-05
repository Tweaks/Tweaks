var tweakVersions = {
	BB9_x : ["hider", "addcolourstripe", "replaceicon", "showhidetext", "imagemapper", "printframe", "quicktest", "deeplink", "iframecontent", "addstyle", "colourpage", "rightPod", "quickpoll", "icons", "unitmap", "selfenrol", "collapsemenu", "visualunitmap", "backtotoplink", "checklist", "noContentWrapper", "Submenu"],
	BB9   : ["hider", "addcolourstripe", "replaceicon", "showhidetext", "imagemapper", "printframe", "quicktest", "deeplink", "iframecontent", "addstyle", "colourpage", "rightPod", "quickpoll", "icons", "unitmap", "selfenrol", "collapsemenu", "visualunitmap", "backtotoplink", "checklist", "noContentWrapper", "Submenu"],
	BB8   : ["hider", "replaceicon", "showhidetext", "imagemapper", "printframe", "quicktest", "iframecontent", "icons", "unitmap", "visualunitmap", "backtotoplink", "checklist", "Submenu"]};

// build selector: template is too much work!
jQuery.each(tweakVersions, function(key, value) {
	jQuery("#BBVersions").append("<input type=\"radio\" name=\"bbvers\" id=\""+key+"\"><label for='"+key+"'>"+key+"</label>"); 
});

// attach event
jQuery("#BBVersions input").live("click", function(){
	var version = jQuery(this).attr("id");
	displayVersionTweaks(version);

	if (version != "BB9")
		jQuery("#expand, #code").hide(); // add show disable

	if (version == "BB9_x")
		jQuery("#BB9_x_message").show();
	else
		jQuery("#BB9_x_message").hide();
});

// default select BB9
jQuery("#BB9").click();

// display correct tweaks for version
function displayVersionTweaks(bbVersion) {
	var tweaksArray = tweakVersions[bbVersion];
	jQuery("li").each(function(){
		var id = jQuery(this).find("input").attr("id");
		if (id) {
			if(jQuery.inArray(id, tweaksArray) > -1) { jQuery(this).show(); } else { jQuery(this).hide(); }
		}
	});
}