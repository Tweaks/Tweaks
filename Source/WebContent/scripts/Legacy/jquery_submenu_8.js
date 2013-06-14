/*
ajax version of submenu 0.2. author Tim Plaisted 2010
generates a text overlay menu for the page's items
looks for "Menu Image" item,  #menuImage, #menuImageSplash > generates Image menu
		  #menuHTML,#menuHTMLSplash > generates HTML menu
		  or generates a text menu
		  
todo	.splash page + change menu class
		selected
8		home link in FF
		retrigger icons code
*/
jQuery(function($) {
 // new 8
 var editMode = jQuery("#endActionBar").length > 0; 
 var page = editMode ?  jQuery("#endActionBar ~ table:eq(0)") : jQuery("h1.pageTitle").next("table");
 page.attr("id", "pageList");
  
 if (!editMode) {

  // parse page content into array
  var intMenuItems = new Array();
  
  // if user not using HTML ID marker: look for "Menu Image" item >> if found: assign it's image an ID marker
  if ($("#menuHTML, #menuImage, #menuHTMLSplash").length == 0) // also #menuImageSplash, but leaving out in case the sub page item doesn't have marker
  	$("#pageList span.label:contains(\"Menu Image\"):eq(0) ~ span").find("img:first").attr("id","menuImage");
  // 9: $("#pageList h3.item:contains(\"Menu Image\"):eq(0)").next("div.details").find("img:first").attr("id","menuImage");
  
  // make sure script items, hidden classes and menu constructors not included
  $("#pageList .hidemyrow, #pageList script.tweak_script, #menuHTML, #menuImage, #menuHTMLSplash, #menuImageSplash").parents("tr").hide();
  // 9: $("#pageList > li .hidemyrow, #pageList > li script.tweak_script, #menuHTML, #menuImage, #menuHTMLSplash, #menuImageSplash").parents("li").hide();
  $("#pageTitleDiv").hide(); // required? currently defaults to hiding the page title
  
  // find tweak item on page and mark previous item as end of menu
  $("#pageList script.tweak_script").parents("tr:contains('Submenu')").prev("tr:visible").find("span.label").addClass("endMenu");
  // 9: $("#pageList > li script.tweak_script").parents("li:contains('Submenu')").prev("li:visible").find("h3.item").addClass("endMenu");

  // parse in content items until end of menu: consider filter or nextUntil ^ I think even speed?
  $("#pageList tr:visible span.label").each(function() { 
  // 9: $("#pageList > li:visible").find("h3.item").each(function() { 
  	// base functionality : folders
	var title = $.trim($(this).text());
	var id = "menu"+$(this).parents("tr").find("td:first").attr("id");
	// 9: var id = "menu"+$(this).attr("id");
	var desc = $.trim($(this).parents("span").nextAll("span.fnt0").text().replace("'",""));
	// 9: var desc = $.trim($(this).next("div.details").text().replace("'",""));
	var href= "#";
    $(this).addClass("inMenu");

	// content and link functionality: if not contain link: then this row was an item so add class
	var itemLink = $(this).parents("a");
	// 9: var itemLink = $(this).find("span > a");
	// 9: if (itemLink.length == 0) 
	// 9:   $(this).parents("li").addClass("menuitem "+id);
	if (itemLink.length == 0) {
		$(this).parents("tr").addClass("menuitem "+id);
		desc = $.trim($(this).nextAll("span.fnt0").text().replace("'",""));
	}
	else if (itemLink.attr("href").indexOf("launchLink.jsp")>0) //else 
		href = itemLink.attr("href");

	// push to array
	intMenuItems.push({"id":id,"title":title,"desc":desc,"href":href});

	// break from loop at tweak script
	if ($(this).hasClass("endMenu")) {
		if ($("#menuHTMLSplash, #menuImageSplash").length) // this was a request for splash page menus - possibly all to have 'home page' content
			$(this).parents("tr").nextAll("tr:visible").addClass("menuitem");
			// 9: $(this).parents("li").nextAll("li:visible").addClass("menuitem");
		return false;
	}
  });
  $("span.inMenu").parents("tr").hide();
  // 9: $("h3.inMenu").parents("li").hide();

  // generate menu links HTML from array
  var menuLinksHTML = setupMenuLinks(intMenuItems);
   
  // add menu to page
  addMenuToPage(menuLinksHTML);
  
  // setup menu event actions
  setupMenuEvents();
  
  // see if there is an item to display on load
  $("#displayFirst").parents("tr").find("span.label").each(function(){ displaySection("menu"+jQuery(this).attr("id")); updateTitle(jQuery.trim(jQuery(this).text())); });
  // 9: $("#displayFirst").parents("li").find("h3.item").each(function(){ displaySection("menu"+jQuery(this).attr("id")); updateTitle(jQuery.trim(jQuery(this).text())); });
  
 } 
});

/*** menu structure setup ***/
// build components of menu text version
function setupMenuLinks(intMenuItems) {
	var menuHTML = "<div id=\"intmenu\">";
	for(var i = 0; i < intMenuItems.length; i++) {
		var altText = (intMenuItems[i].desc.length > 0) ? intMenuItems[i].desc : intMenuItems[i].title;
		menuHTML+= "<a href='"+ intMenuItems[i].href + "' id='"+ intMenuItems[i].id +"' title='"+ altText +"'>"+ intMenuItems[i].title+"</a> ";
	}
	// trim trailing chars and return
	return menuHTML.replace(/ $/, "</div>");
}

function addMenuToPage(menuLinksHTML) {
  // is this html, image or plain text menu?

  // html options: add custom html to page and insert link menu
  if (jQuery("#menuHTMLSplash").length == 1) {
	jQuery("#pageList").before(jQuery("#menuHTMLSplash").clone().remove());
	jQuery("#pageList").before(jQuery("#menuHTML").clone().remove());
	jQuery("#menuLinksSplashDiv").html(menuLinksHTML);
  } else if (jQuery("#menuHTML").length == 1) {
	jQuery("#pageList").before(jQuery("#menuHTML").clone().remove());
	jQuery("#menuLinksDiv").html(menuLinksHTML);
  }
  else // image or plain text options: setup html, then add to page
  {
  	// add title and set up html
	var menuHTML = "<div id=\"menuTitle\"></div><br/>"+menuLinksHTML;

	// image (wrapper) options
	var menuImage = (jQuery("#menuImageSplash").length) ? jQuery("#menuImageSplash") : jQuery("#menuImage");
	if (menuImage.length)
		menuHTML = addMenuImageWrapper(menuImage, menuHTML);

	// add to page
	jQuery("#pageList").before(menuHTML);

	// dynamic positioning of text over image: only does things if graphicMenu (graphicWrapper) exists
	dynamicPositionImageMenu();
  }
}
// build graphics container
function addMenuImageWrapper(image, menuHTML) {
	return "<div id=\"graphicMenu\" style=\"background: url("+image.attr("src")+"); width:"+image.attr("width")+"px; height:"+image.attr("height")+"px;\" class=\""+image.attr("class")+"\">"+menuHTML+"</div>";
}
function dynamicPositionImageMenu() {
	var defaultTitleHeight = 28;
	var defaultBasePadding = 8;//Factor = 0.06; // ok this is just to give a bit of relative space off the bottom of the graphic
	//90 5 190 11 439 414 = 0?
	jQuery("#graphicMenu #menuTitle").css("top", (jQuery("#graphicMenu").height() - defaultTitleHeight)/2+"px");
	jQuery("#graphicMenu #intmenu").css("top", (jQuery("#graphicMenu").height() - jQuery("#intmenu").height() - defaultBasePadding)+"px"); //(Math.floor(jQuery("#graphicMenu").height()*defaultBasePaddingFactor)))+"px"); // set max or .. static
}

//-- menu events functionality --
function setupMenuEvents() {
  jQuery("#intmenu a").click(function(event) {
    if(jQuery(this).attr("href").indexOf("#") != (jQuery(this).attr("href").length-1)) { return true; } // use regex: IE fix href includes server
	displaySection(jQuery(this).attr("id"));
	updateTitle(jQuery(this).text());
	if (jQuery("#menuHTMLSplash, #menuImageSplash").length)
		selectSubPage();
    event.preventDefault();
  });
}
// set text
function updateTitle(newTitle) {
	jQuery("#menuTitle").text(newTitle);
}
// splash page > sub page functionality
function selectSubPage() {
	// add class so that css can be customised for sub pages
    jQuery("body").addClass("subpage");

    // temp retarget OK button..(8)
    jQuery("img[name*='img_ok']").parents("a").attr("href", document.location.href);

    // html version
    jQuery("#menuLinksDiv").html(jQuery("#intmenu").clone(true).remove());
    jQuery("#menuHTMLSplash").remove(); // consider switching using contains intmenu

    // image version - check if there is a subimage
    if (jQuery("#graphicMenu, #menuImage").length == 2) {
    	var image = jQuery("#menuImage");
    	jQuery("#graphicMenu").css("background", "url("+image.attr("src")+")").attr("class", image.attr("class")).width(image.attr("width")).height(image.attr("height"));
	    dynamicPositionImageMenu();
	    jQuery("#menuImageSplash").remove();
	} else
	    setupMenuEvents(); // not sure why cloning events isn't working - children of intmenu? / does first item only?
}

/*** menu > content display and page loading code ***/
function displaySection(menuid) {
	jQuery(".menuitem").hide();
	if(jQuery("#pageList ."+menuid).length == 0)
		loadMenuPage(menuid);
	jQuery("#pageList ."+menuid).show();
	// consider: set class of menu container and selected item to be selected
}

function loadMenuPage(menuid) {
	// check loading container is ready
	if (jQuery("#loading").length == 0)
		jQuery("<div id=\"loading\"></div>").appendTo("body").hide();
		// 9: jQuery("<div id=\"loading\"><ul></ul></div>").appendTo("body").hide();
	if (jQuery("#loading table").length > 0)
		jQuery("#loading table").remove();
	// 9: if (jQuery("#loading li").length > 0)
		// 9: jQuery("#loading li").remove();
	if (jQuery("#loadingGraphic").length == 0)
	    jQuery("#pageList").before("<div id=\"loadingGraphic\"></div>");
	
	jQuery("#loadingGraphic").show();
	
	var menupageURL = document.location.href.replace(/(.*content_id=)[^&]*(.*)/, "$1"+menuid+"$2").replace("menu_","_");
	// check 9!: var menupageURL = document.location.href.replace(/(.*content_id=)[^&]*(.*)/, "$1"+menuid+"$2");

	// load content and append to page
	// jQuery("#loading tbody").load(menupageURL+" h1.pageTitle ~ table:eq(0)>tbody>tr", function() { // issue: need to find and mark table..
	jQuery("#loading").load(menupageURL+"", function() { // issue: need to find and mark table..
		jQuery("#loadingGraphic").hide();
		jQuery("#loading>table:last>tbody>tr").addClass("menuitem");
		jQuery("#loading>table:last>tbody>tr").addClass(menuid);
		// clean up and append
		jQuery("#loading tr:contains('Tweak')").remove();
		localFixLearningObjLink(jQuery);
		jQuery("#pageList tbody").append(jQuery("#loading tr.menuitem"));
		jQuery("#loading").empty();
	// 9: 
	/*
	jQuery("#loading ul").load(menupageURL+" #pageList>li", function() {
		jQuery("#loadingGraphic").hide();
		jQuery("#loading>ul>li").addClass("menuitem");
		jQuery("#loading>ul>li").addClass(menuid);
		// clean up and append
		jQuery("#loading li:contains('Tweak')").remove();
		localFixLearningObjLink(jQuery);
		jQuery("#pageList").append(jQuery("#loading>ul>li"));
		jQuery("#loading li").remove();
		*/
		// retrigger replace icons
		retriggerReplaceIcons();
	});
}

/* functionality to retrigger sub page customisation: currently just icons */
function retriggerReplaceIcons() {
	// replace and hide
	if (window.findReplacementIcons) {
		findReplacementIcons();
		hideIcons();
		// clean up
		jQuery("#pageList h3.replacementicon, #pageList h3.hideicon").parents("li").hide();	
		jQuery("#pageList img.replacementicon").hide();
	}
}

/* temporary fix for Learning Objects / BB9: required until Learning Objects Fix put in place: based on header script */
function localFixLearningObjLink($) {
	$("#loading a[href*='lobj-']").each(function(){ 
		// this is custom but might need to go in header
		var server = document.location.protocol + "//" + document.location.host;
		var serverOffset = (($(this).attr("href").indexOf(server) == 0) ? server.length : 0) + 5;
		if($(this).attr("href").indexOf("/webapps",serverOffset)<0){				   
			if($(this).text() == "View") {				
				$(this).attr("href", singleDecodeLink($(this).attr("href"))); 
			}
			else if($(this).text() == "play") {
				var this_href = $(this).attr("href");
				var decoded_path =  unescape(blackboardServerURL+singleDecodeLink(this_href.substr(this_href.search("href=")+8, this_href.length)));
				if ($(this).parents("span").find("a.downloadlink").length == 0)
					$(this).after(" | <a href='"+decoded_path+"' target='_download' class='downloadlink' title='Right-click and save this file to your computer' alt='Right-click and save this file to your computer'>download</a>");	
			}
		}
	});
}

var singleDecodeLink = function(url) {
	return url.replace(/%253D/g, "%3D").replace(/%2526/g, "%26");
};
/* end header code script */

// ref
// edit mode code
  //var editMode = location.href.indexOf("listContent.jsp")<0;
  //if (!editMode) {
  //} else
  // $("#pageList > li .hidemyrow, #pageList > li script.tweak_script, #menuHTML, #menuImage").parents("li").addClass("specialRow");
    //if (editMode) { 
    //  if ($(this).parents("li").hasClass("specialRow")) // TODO: low priority clean up all this extra hacking for edit mode or remove it
    //  	return true;
    //  title = title.replace(/\s*Edit\s*Copy\s*Delete/, ""); // TODO: lowest priority, filter instead of text replace
    //} else // consider caching parent query and performing once?
    
// hash / bookmarking code -- implemented when I needed intra section links - now not essential but may be request..
  // url hash = id for linking / bookmarking / lookup > display first
  /* TODO - consider smarts
  if (document.location.hash.length) {
	updateTitle($(document.location.hash.replace(/^\#/, "#menu")).text());
  	$(document.location.hash.replace(/^\#/, ".menu")).show();
  	window.scroll(0,0);
  } else { // show first
	updateTitle(intMenuItems[0].title);
	$("."+intMenuItems[0].id).show();
  }*/
