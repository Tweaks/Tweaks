// version 2. author Tim Plaisted 2010
jQuery(function($) {
	// utility extension: case insensitive contains
	jQuery.expr[':'].cicontains = function(a,i,m){
		return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
	};		
	if ($("body.ineditmode").length == 0) {
		if($("iframe").length) // look for iframe
			$("#content").replaceWith($("iframe:eq(0)").get());
		else
		{ // look for item called web package
			var webPackageLink = $("#pageList h3.item:cicontains(\"Site Link\")").parents("li").find("a:first");
			unWrapLink(webPackageLink);
			if(webPackageLink.length)
			{
				$("#content").hide();
				$("#content").html("<iframe src=\""+webPackageLink.attr("href")+"\" width=\"100%\" height=\"950\" frameBorder=\"0\"></iframe>");
				$("#content iframe").load(restyleFrame).ready(restyleFrame);
			}
		} 
	}
});

function restyleFrame() {
	var frame = jQuery("#content iframe").contents();
	window.scrollTo(window.scrollX,0); // trial scroll
	if (frame.find("#navigationPane, #breadcrumbs").length) {
		frame.find("#navigationPane, #breadcrumbs").hide();
		frame.find("#contentPane, div.contentPane").css("margin","0px 4px 0px 0px");
		frame.find("a").click(function(){
			// filtering better here as only occurs on click?
			if (jQuery(this).attr("href") == "#" ||
				jQuery(this).hasClass("hideShowLink") ||
				jQuery(this).parent("#intmenu").length > 0) { 
				/* submenu, hideshow: do nothing */
				return true;
			} else
				jQuery("#content iframe").css("margin-left", "-2000px");
		});
		jQuery("#content").show();
		jQuery("#content iframe").css("margin-left", "auto");
	}
}

function unWrapLink(link) { 
	var this_href=jQuery(link).attr("href"); 
	if (this_href && this_href.indexOf("contentWrapper") > 0)
		jQuery(link).attr("href", unescape(this_href.substr(this_href.search("href=")+5, this_href.length)).replace("amp;", "")); 
}