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
   
ajax version of submenu 1.0. author Tim Plaisted 2010-2011
generates a text overlay menu for the page's items
looks for "Menu Image" item,  #menuImage, #menuImageSplash > generates Image menu
		  #menuHTML,#menuHTMLSplash > generates HTML menu
		  or generates a text menu		  
*/
if (window.tweak_bb == null || window.tweak_bb.page_id == null)
	window.tweak_bb = { page_id: "#pageList", row_element: "li" };
var intMenuItems = new Array();
jQuery(function($) {
 if (location.href.indexOf("listContent.jsp")>0) {

  // load headers as parsed several times in script
  var headers = $(tweak_bb.page_id +" > "+tweak_bb.row_element).children(".item");

  // filter menu image + submenu image // look for ID markers: then look for "Menu Image" item >> if found: assign their images ID markers
  if ($("#menuHTML, #menuImage, #menuHTMLSplash").length == 0) { // also #menuImageSplash, but leaving out in case the sub page item doesn't have marker
  	var menuImagesHeaders = headers.filter(":contains(\"Menu Image\")");
  	// sub page image and splash page image
  	if (menuImagesHeaders.filter(":contains(\"Sub\")").length > 0) {
  		menuImagesHeaders.filter(":contains(\"Sub\")").eq(0).parents(tweak_bb.row_element).find("div.details").find("img:first").attr("id","menuImage");
	  	menuImagesHeaders.not(":contains(\"Sub\")").eq(0).parents(tweak_bb.row_element).find("div.details").find("img:first").attr("id","menuImageSplash");
	} else {
		// just single menu image
  		menuImagesHeaders.eq(0).parents(tweak_bb.row_element).find("div.details").find("img:first").attr("id","menuImage");
	}
  }
  // make sure script items, hidden classes and menu constructors not included
  var scriptRows = $(tweak_bb.page_id+" script.tweak_script").parents(tweak_bb.row_element).hide();
  $("#menuHTML, #menuImage, #menuHTMLSplash, #menuImageSplash").parents(tweak_bb.row_element).hide();
  $("#pageTitleDiv").hide(); // required? currently defaults to hiding the page title

  // find tweak item on page and mark previous item as end of menu
  scriptRows.filter(":contains('Submenu')").prev("li:visible").find(".item:first").addClass("endMenu");

  // parse in content items until end of menu
  headers.filter(":visible").each(function() { 
  	// base functionality : folders
	var title = $.trim($(this).text()); /* todo: check this 9.x */
	var id = $(this).attr("id");
	var desc = $.trim($(this).parents(tweak_bb.row_element).find("div.details").text().replace("'",""));
	var href= "#";
	var target = "self";
    $(this).addClass("inMenu");

	// content and link functionality: if not contain link: then this row was an item so add class
	var itemLink = $(this).find("a:first");
	if (itemLink.length == 0)
		$(this).parents(tweak_bb.row_element).addClass("menuitem "+id);
	else if (itemLink.attr("href").indexOf("launchLink.jsp")>0 ||
			 itemLink.attr("href").indexOf("contentWrapper")>0 ||
			 itemLink.attr("href").indexOf("course_id")<0) { // check this 
		href = itemLink.attr("href");
		target = itemLink.attr("target");
	}

	// push to array
	intMenuItems.push({"id":id,"title":title,"desc":desc,"href":href,"target":target});

	// break from loop at tweak script
	if ($(this).hasClass("endMenu")) {
		if ($("#menuHTMLSplash, #menuImageSplash").length) // this was a request for splash page menus - possibly all to have 'home page' content
			$(this).parents(tweak_bb.row_element).nextAll(tweak_bb.row_element+":visible").addClass("menuitem");
		return false;
	}
  });
  // hide in menu rows initially
  headers.filter(".inMenu").parents(tweak_bb.row_element).hide();

  // generate menu links HTML from array
  var menuLinksHTML = setupMenuLinks(intMenuItems);
   
  // add menu to page
  addMenuToPage(menuLinksHTML);
  
  // setup menu event actions
  setupMenuEvents();
// todo: see if this can work split back into image map tweak
  setupImageMapMouseover(headers);
  
  // see if there is an item to display on load
  $("#displayFirst").parents(tweak_bb.row_element).find(".item:first").each(function(){ 
    var title = $.trim($(this).text()); // todo: check this 9.x
  	displaySection($(this).attr("id"), updateTitle(title)); 
  });
 }
});

/*** menu structure setup ***/
// build components of menu text version
function setupMenuLinks(intMenuItems) {
	var menuHTML = "<div id=\"intmenu\">";
	var imageMapLinks = jQuery("#menuHTMLSplash, #menuHTML").find("area");
	var imageMapLinksExist = (imageMapLinks.length > 0);

	var intMenuItemsLength = intMenuItems.length;
	for(var i = 0; i < intMenuItemsLength; i++) {
		var altText = (intMenuItems[i].desc.length > 0) ? intMenuItems[i].desc : intMenuItems[i].title;
		menuHTML+= "<a href='"+ intMenuItems[i].href + "' id='"+ intMenuItems[i].id +"' title='"+ altText +"' target='"+ intMenuItems[i].target +"'>"+ intMenuItems[i].title+"</a> ";
		// set any corresponding image map item. benchmark new image map changes
		if (imageMapLinksExist)
			imageMapLinks.filter("[alt*="+intMenuItems[i].title+"]").attr({
				id: intMenuItems[i].id,
				href: intMenuItems[i].href,
				target: intMenuItems[i].target
			});
		// consider swapping titles from image map alt to menu links to allow for shorter..
	}	
	// trim trailing chars and return
	return menuHTML.replace(/ $/, "</div>");
}

function addMenuToPage(menuLinksHTML) {
  // is this html, image or plain text menu?

  // benchmark previous clone remove attempts
  // html options: add custom html to page and insert link menu
  if (jQuery("#menuHTMLSplash").length == 1) {
	jQuery(tweak_bb.page_id).before(jQuery("#menuHTMLSplash"));
	jQuery(tweak_bb.page_id).before(jQuery("#menuHTML"));
	jQuery("#menuLinksSplashDiv").html(menuLinksHTML);
  } else if (jQuery("#menuHTML").length == 1) {
	jQuery(tweak_bb.page_id).before(jQuery("#menuHTML"));
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
	jQuery(tweak_bb.page_id +"").before(menuHTML);

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
  jQuery("#intmenu, #menuHTMLSplash, #menuHTML").find("a, area").click(function(event) {
  	var link = jQuery(this);
  	// load content if submenu link or return if normal link
    if(link.attr("href").indexOf("#") != (link.attr("href").length-1)) { return true; } // use regex: IE fix href includes server
	displaySection(link.attr("id"));
	// update Title
	var title = (link.filter("[alt]").length==0) ? link.text() : link.attr("alt");
	updateTitle(title);
	// mark Selection
	jQuery("#intmenu a").removeClass("selected");
	link.addClass("selected");
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
	// check minimal optimise: tweak_bb.page_id+">"+tweak_bb.row_element+".menuitem"
	jQuery(".menuitem").hide();
	if(jQuery(tweak_bb.page_id +" ."+menuid).length == 0)
		loadMenuPage(menuid);
	// check minimal optimise: tweak_bb.page_id+">"+tweak_bb.row_element+"."+menuid
	jQuery(tweak_bb.page_id +" ."+menuid).show();
	// consider: set class of menu container and selected item to be selected
}

function loadMenuPage(menuid) {
	// check loading container is ready
	if (jQuery("#loading").length == 0)
		jQuery("<div id=\"loading\"><ul></ul></div>").appendTo("body").hide();
	if (jQuery("#loading li").length > 0)
		jQuery("#loading li").remove();
	if (jQuery("#loadingGraphic").length == 0)
	    jQuery(tweak_bb.page_id +"").before("<div id=\"loadingGraphic\"></div>");

	jQuery("#loadingGraphic").show();

	var menupageURL = document.location.href.replace(/(.*content_id=)[^&]*(.*)/, "$1"+menuid+"$2");;

	// load content and append to page
	jQuery("#loading ul").load(menupageURL+" "+tweak_bb.page_id+">"+tweak_bb.row_element, function() {
		jQuery("#loadingGraphic").hide();
		jQuery("#loading>ul>li").addClass("menuitem");
		jQuery("#loading>ul>li").addClass(menuid);
		// clean up and append
		jQuery("#loading li:contains('Tweak')").remove();
		localFixLearningObjLink(jQuery);
		jQuery(tweak_bb.page_id +"").append(jQuery("#loading>ul>li"));
		jQuery("#loading li").remove();
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
		jQuery(tweak_bb.page_id +" h3.replacementicon, "+tweak_bb.page_id +" div.replacementicon, "+tweak_bb.page_id +" h3.hideicon").parents(tweak_bb.row_element).hide();	
		jQuery(tweak_bb.page_id +" img.replacementicon").hide();
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
				var blackboardServerURL = location.protocol + "//" + location.host + "/";
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

// image map description integration work: issue was menu was going above page -- but was looking in page to map
function setupImageMapMouseover(headers) {
  if (jQuery("#description").length) {
	jQuery("#menuHTMLSplash, #menuHTML").find("area").each(function(){
	  var matchingHeader = headers.filter(":contains('"+jQuery.trim(jQuery(this).attr("alt"))+"')").eq(0);
	  if (matchingHeader.length) {
		  var desc = matchingHeader.parents(tweak_bb.row_element).find("div.details > span").html();
		  if (desc) { jQuery(this).data("desc", desc); }
	  }
	}).mouseover(function(){
	  var desc = jQuery(this).data("desc");
	  if (desc != null) { jQuery("#description").html(desc); }
	});
  }
}