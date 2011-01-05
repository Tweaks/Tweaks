/* 
   Copyright 2010 Tim Plaisted, Queensland University of Technology

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

	* dynamic text map
	* created/in development for BFLI project and Business Faculty
	* settings -- add as class="" to image
		customStyle: use custom style sheet (forces loading before laying out map)
	  	keepModuleText: keep "Module" text in Module items
		useBlackboardItemColours: use Blackboard Item colours
		staticPositioning: position items in CSS
		horizontal: horizontal layout

	* todo:	MSIE CSS override load check
	*			Dynamically shift down rows based on preceding row's position
	*/
if (window.tweak_bb == null || window.tweak_bb.page_id == null)
	window.tweak_bb = { page_id: "#pageList", row_element: "li" };

function dynamicTextMap() {
	// utility extension: case insensitive contains
	jQuery.expr[':'].contains = function(a,i,m){
		return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
	};
	
	// find image map image source
	var mapsource = jQuery("#dynamicmap");
	// if no item with ID, search for item titled Unit Map or Unit Navigation (horizontal layout)
	if (mapsource.length == 0)
		mapsource = jQuery(tweak_bb.page_id +" > "+tweak_bb.row_element).children(".item").filter(":contains(\"Unit Map\"), :contains(\"Unit Navigation\")").parents(tweak_bb.row_element).find("div.details").find("img:first");

	// horizontal layout - text to be confirmed
	if (mapsource.parents(tweak_bb.row_element).children(".item:contains(\"Unit Navigation\")").length)
		mapsource.addClass("horizontal");
		
	// set up container div for dynamic map
	if (mapsource.length) {
		mapsource.after("<div id=\"tweakmap\"></div>").hide();;
		var tweakmap = jQuery("#tweakmap");
		tweakmap.addClass(mapsource.attr("class")); 

		// set width and height
		//debug var imageWidth0 = mapsource.width();
		if(mapsource.width())
			tweakmap.width(mapsource.width());
		if(mapsource.height())
			tweakmap.height(mapsource.height());
			
		// read in settings
		var removeModuleText = !mapsource.hasClass("keepModuleText");
		var useBlackboardItemColours = mapsource.hasClass("useBlackboardItemColours");
		var staticPositioning = mapsource.hasClass("staticPositioning");
		var horizontalLayout = mapsource.hasClass("horizontal");
		if (!horizontalLayout) { tweakmap.addClass("linear"); }

		// swap display
		tweakmap.css("background", "url("+mapsource.attr("src")+")");

		// read in items, count columns and rows and set up classes for reference
		var columnBreakHTXT = "column break header";
		var columnBreakTXT = "column break";
		var rowBreakTXT = "row break";
			
		// look through links to count total columns/modules in advance for formatting and add class for retrieval
		var columns = 0, itemIndex = 0, rows = 0, thisRowCols = 0, maxRowCols = 0;
		tweakmap.parents(tweak_bb.row_element).nextAll(tweak_bb.row_element).each(function(){
			var thisItem = jQuery(this).find("h3:first");
			// process until Visual Unit Map Tweak
			if (thisItem.length == 0 || (thisItem.text().indexOf("Tweak")>-1)) // && thisItem.parents(tweak_bb.row_element).find("div.details:contains(\"map\")").length))
				return false;

			var itemTitleLink = thisItem.find("a:first").addClass("mapItemLink"); // add class for retrieval
			if (itemTitleLink.length)
			{
				itemIndex++;
				// count if first column or Module in item title link or "column break" in description
				if (itemIndex == 1 || horizontalLayout || (itemTitleLink.text().indexOf("Module")>-1) || (thisItem.parents(tweak_bb.row_element).find("div.details:contains(\""+columnBreakTXT+"\")").length>0))
				{
					itemTitleLink.addClass("columnBreak");
					// also check if column break bold
					if (thisItem.parents(tweak_bb.row_element).find("div.details:contains(\""+columnBreakHTXT+"\")").length>0)
						itemTitleLink.addClass("columnHeader");
					columns++;
				}
				if (horizontalLayout)
				{
					//horizontalCols
					if (thisItem.parents(tweak_bb.row_element).find("div.details:contains(\""+rowBreakTXT+"\")").length>0)
					{
						itemTitleLink.addClass("rowBreak");
						rows++;
						thisRowCols = 0;
					}
					thisRowCols++;
					maxRowCols = (maxRowCols > thisRowCols) ? maxRowCols : thisRowCols;
					itemTitleLink.addClass("row"+(rows+1));
				}
			}
		});
		
		var imageWidth = tweakmap.width();
		var actualColumns = (columns < 4) ? columns : ((columns == 4) ? 2 : 3);
		if (horizontalLayout)
			actualColumns = maxRowCols;
		
		// hide content items in Edit mode off
		if(location.href.indexOf("Content.")>0)
		{
			jQuery(tweak_bb.page_id + " .mapItemLink").parents(tweak_bb.row_element).hide();
			jQuery("#tweakmap").parents(tweak_bb.row_element).show();
		}
		
		// check if custom style to force load stylesheets
		this.hasCustomStyle = function() {
			var customStyled = tweakmap.hasClass("customStyle");
			if (!customStyled)
				tweakmap.addClass("noCustomStyle");
			return customStyled;
		};
		
		// lookup headers once
		
		// append links to map: set up in closure to allow for delayed calling after CSS has loaded
		this.applyFormatting = function() {		
			var lastBase = 0, verticalSpacing = 5; // consider taking from CSS if possible to query before writing map? "#tweakmap div.topic:not(\".moduleHeader\"):eq(0)").css("line-height")
			var colIndex = 1; // 1 indexed column for css and readability
			jQuery(tweak_bb.page_id + " .mapItemLink").each(function(mapItemCount) {
				var mapItemLink = jQuery(this);				
				tweakmap.append("<div id=\"mapitem"+mapItemCount+"\"></div>");
				var mapItem = jQuery("#mapitem"+mapItemCount);
				if(mapItemLink.hasClass("columnBreak")) {
					if (mapItemCount > 0)
						colIndex += 1;
						
					lastBase = 0;
					if (mapItemLink.hasClass("columnHeader") || mapItemLink.filter(":contains(\"module\")").length)
					{
						mapItem.addClass("moduleHeader");
						if (removeModuleText)
							mapItemLink.text(mapItemLink.text().replace("Module: ", ""));
					}
				}
				if (!useBlackboardItemColours) { mapItemLink.html(mapItemLink.text()); }
				mapItem.append(mapItemLink.clone()).addClass("topic").addClass("module"+colIndex);
				// todo: make this optional
				mapItem.filter(":not('.moduleHeader')").find("a").prepend("&diams;&nbsp; ");
				// make link title description text if available or item text
				var altText = mapItemLink.parents(tweak_bb.row_element).find("div.details").text();
				altText = jQuery.trim(altText.replace(columnBreakHTXT, "").replace(columnBreakTXT, "").replace(rowBreakTXT, ""));
				mapItem.find("a").attr("title", (altText.length) ? altText : mapItem.text());
				// offset links
				if (lastBase > 0)
					mapItem.css("top", lastBase + verticalSpacing);

				var position = mapItem.position();
				lastBase = position.top + mapItem.find("a").outerHeight();
			});
			
			// todo: clean this up
			// dynamic positioning basing all off tweakmap.width
			if (!staticPositioning) {
				var colWidth = jQuery("#mapitem0 a").outerWidth();
				var totalColWidth = colWidth * actualColumns;
				// todo: consider appending one link and then do this processing earlier
				var minSpace = (jQuery.browser.ie) ? 40 : 15;
				var checkMaxWidth = imageWidth - (actualColumns+1)*minSpace - 10;
				if (totalColWidth > checkMaxWidth) {
					colWidth = Math.round(checkMaxWidth /  actualColumns);
					totalColWidth = colWidth * actualColumns;
					tweakmap.find("a").width(colWidth);
				}
				var spacer = Math.round((imageWidth - totalColWidth) / (actualColumns + 1));

				//alert("spacer "+spacer+" actualColums "+actualColumns+" checkMaxWidth "+checkMaxWidth+" totalColWidth "+b+" "+totalColWidth+" colWidth "+colWidth+" imageWidth "+imageWidth+" 0"+imageWidth0+" 1"+imageWidth1);	
				if (columns == 2 || (columns == 4 && !horizontalLayout)) {
					tweakmap.find(".module1, .module3").css("left", spacer +"px");
					tweakmap.find(".module2, .module4").css("left", (2*spacer+colWidth)+"px");
					jQuery("#tweakmap .module3").each(function(){
						jQuery(this).css("top", (jQuery(this).position().top+160)+"px");
					});
					// todo shift down baseOfTopRow = 
					//tweakmap.find(".module3, .module4").css("top", (jQuery(").position().top+160)+"px");
				}
				else if (horizontalLayout)
				{
					var thisRowCol = 0;
					for (var i = 1; i <= columns; i++)
					{
						if (tweakmap.find(".module"+i+" .rowBreak").length)
							thisRowCol = 0;
						thisRowCol++;
						//var thisRowCols = ((i-1) % maxRowCols) + 1;
						tweakmap.find(".module"+i).css("left", (thisRowCol*spacer +(thisRowCol-1)*colWidth) +"px");
					}
					// make this dynamic
					tweakmap.find(".row1").closest("div").css("top", 70+"px");
					tweakmap.find(".row2").closest("div").css("top", 160+"px");
					tweakmap.find(".row3").closest("div").css("top", 250+"px");
					tweakmap.find(".row4").closest("div").css("top", 340+"px");
				}
				else // columns = 1 or 3
				{
					tweakmap.find(".module1, .module4").css("left", spacer +"px");
					tweakmap.find(".module2, .module5").css("left", (2*spacer+colWidth)+"px");			
					tweakmap.find(".module3, .module6").css("left", (3*spacer+2*colWidth)+"px");		
				}
			}			
		};
	}
	// try appending image
	if (mapsource.attr("usemap")) {
		tweakmap.append(mapsource);
		tweakmap.find("img").show();
	}
};
function delayedApply(millis) {
	setTimeout("dynamicTextMapInstance.applyFormatting()", millis); // find event to call this after Tweak and CSS have loaded instead of timer!
}

var dynamicTextMapInstance = new dynamicTextMap();

// check for stylesheets on the page and load these before processing tweak
// todo: clean up retest this and see if optimised - set up minimum required, call css then continue setting up - callback to apply
if (dynamicTextMapInstance.hasCustomStyle()) {
	jQuery(function($){
		//force load stylesheets
		var styleSheets = new Array();
		$(tweak_bb.page_id + ".loadStyle").each(function(){ styleSheets.push($(this).text()); });
		var styleSheetHeaders = jQuery(tweak_bb.page_id +" > "+tweak_bb.row_element).children(".item:contains('Stylesheet')");
		//alert("styleSheetHeaders"+styleSheetHeaders.length);
		styleSheetHeaders.each(function(){
			if ($(this).find("div.loadStyle").length == 0) {
				$(this).find("ul.attachments").find("a").each(function() {
					var thisLink = $(this).attr("href");
					styleSheets.push(thisLink.substr(thisLink.search("/course")));
				});
			}
		});
		
		if ($("body.ineditmode").length == 0)
			styleSheetHeaders.parents(tweak_bb.row_element).hide();

		var numStylesheets = styleSheets.length;
		if (numStylesheets) {
			var $head = $("head");
			for (var i = 0; i < numStylesheets; i++) {
				if ($head.find("link[href*='"+styleSheets[i]+"']").length == 0) {
					var cssNode = document.createElement('link');
					cssNode.type = 'text/css';
					cssNode.rel = 'stylesheet';
					cssNode.href = styleSheets[i];
					cssNode.media = 'screen';
					$head.append(cssNode);
				}
			}
			// fire on load last stylesheet
			// jQuery("link[href*='"+styleSheets[numStylesheets-1]+"']").load(function(){ alert("loaded"); });
			// first load was off in IE.. how best to fix
			var waitToApply = (jQuery.browser.msie) ? 350 : 150;
			jQuery("link[href*='"+styleSheets[numStylesheets-1]+"']").ready(function(){ 
				delayedApply(waitToApply);
			});
		} else
			dynamicTextMapInstance.applyFormatting();
	});
} else
	dynamicTextMapInstance.applyFormatting();