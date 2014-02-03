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
version 2. author Tim Plaisted 2010
 */
jQuery(function ($) {

	if (window.tweak_bb === null || window.tweak_bb.page_id === null) {
		window.tweak_bb = {
			page_id : "#pageList",
			row_element : "li"
		};
	}
	/**
	 * current version of ie [https://gist.github.com/527683]
	 * @type {number|undefined}
	 */
	var ie = (function () {
		var undef,
		v = 3,
		div = document.createElement('div'),
		all = div.getElementsByTagName('i');
		do {
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
		} while (all[0]);
		return v > 4 ? v : undef;
	}
		());

	/* handle "Stylesheet" items */
	$(tweak_bb.page_id + " > " + tweak_bb.row_element).children(".item:contains('Stylesheet')").parents(tweak_bb.row_element).find("ul.attachments").addClass("hidemyrow").find("a").each(function () {
		var thisLink = $(this).attr("href");
		$(this).after("<div class=\"loadStyle\">" + thisLink + "</div>");
	});

	$(tweak_bb.page_id + " > " + tweak_bb.row_element).children(".item:contains('Stylesheet')").parents(tweak_bb.row_element).find(".loadStyle").each(function (i, elem) {
    $(elem).addClass("hidemyrow");
		var URLofCSS = $.trim($(elem).hide().text());
		var currentUnit = courseTitle;
		var firstIndex = currentUnit.indexOf("(") + 1;
		var lastIndex = currentUnit.lastIndexOf(")");
		var CoursePath = "bbcswebdav/courses/";
		var ie8Class = $(elem).hasClass("if-ie-8");
		var ie9Class = $(elem).hasClass("if-ie-9");
		var CoursefilesClass = $(elem).hasClass("fromCoursefiles");

		currentUnit = currentUnit.substring(firstIndex, lastIndex);

		// Check 1:  CoursePath and IE Classes*/
		if (CoursefilesClass && (ie8Class || ie9Class)) {
			//Check for if-ie-8 or 9 class && IE version
			if (ie8Class && ie == 8) {
				URLofCSS = URLofCSS.replace(/^\//, '');
				URLofCSS = CoursePath + currentUnit + "/" + URLofCSS;
				$.xLazyLoader('loadRootPath', {
					css : URLofCSS
				});
			} else if (ie9Class && ie == 9) {
      
				URLofCSS = URLofCSS.replace(/^\//, '');
				URLofCSS = CoursePath + currentUnit + "/" + URLofCSS;
				$.xLazyLoader('loadRootPath', {
					css : URLofCSS
				});
			}
			//Check for Coursefiles && not IEClass
		} else if (CoursefilesClass && (!ie8Class || !ie9Class)) {
			URLofCSS = URLofCSS.replace(/^\//, '');
			URLofCSS = CoursePath + currentUnit + "/" + URLofCSS;
			$.xLazyLoader('loadRootPath', {
				css : URLofCSS
			});
			//Check not Coursefiles && IEClass
		} else if (!CoursefilesClass && (ie8Class || ie9Class)) {
			//Check class && IE Version
			if (ie8Class && ie == 8) {
				URLofCSS = URLofCSS.replace(/^\//, '');
				$.xLazyLoader('loadRootPath', {
					css : URLofCSS
				});
			}
      } else if (ie9Class && ie == 9) {
        URLofCSS = URLofCSS.replace(/^\//, '');
        $.xLazyLoader('loadRootPath', {
				css : URLofCSS
			});

	} else {
			//check path for leading /
			URLofCSS = URLofCSS.replace(/^\//, '');
			$.xLazyLoader('loadRootPath', {
				css : URLofCSS
			});
 } });
		if (tweak_bb.display_view) {
			$(tweak_bb.page_id + " .hidemyrow").parents(tweak_bb.row_element).hide();
		} else if (tweak_bb.display_view === false) {
				$(tweak_bb.page_id + " .loadStyle").show().parents(tweak_bb.row_element).show();
			}

	});