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

Status: rewriting abd testing for online trial deployment across BB8, BB9 and BB9.1
*/ 
// paths: configured via bb admin
var tweak_path = "/webapps/qut-tweakbb-bb_bb60/"; 
var tweak_live_help = "http://blackboard.qut.edu.au/webapps/portal/frameset.jsp?tab_tab_group_id=_5_1&url=/webapps/blackboard/execute/courseMain?course_id=_59724_1"; 
var tweak_bb_active_url_pattern = "listContent.jsp";
var tweak_bb_display_view = location.href.indexOf(tweak_bb_active_url_pattern) > 0;
var bb_page_id_9 = "#pageList";
var bb_page_id_9_x = "#content_listContainer";

// version: detected at run time: could just put bb page_id as configurable single item, but prefer to make it work by default across versions as much as possible
var tweak_bb_page_id, tweak_row_element, BB8, BB9, BB9_x;

// Tweak currently compatible with 8, 9 and 9.1
function BBVersionSetup() {
	BB8 = BB9 = BB9_x = false;
	BB9_x = (jQuery(bb_page_id_9_x).length == 1);
	if (!BB9_x)
		BB9 = (jQuery(bb_page_id_9).length == 1);
	if (!BB9) { // make BB8 look like 9
		BB8 = true;
		var page = tweak_bb_display_view ? jQuery("h1.pageTitle").next("table") : jQuery("#endActionBar ~ table:eq(0)");
		page.attr("id", "pageList");
	}
	tweak_bb_page_id = BB9_x ? bb_page_id_9_x : bb_page_id_9 ;
	tweak_row_element = BB8 ? "tr" : "li";
}

// display: would prefer better way of only calling these lines once..
jQuery.noConflict();
jQuery(function($) {
  if (window.tweak_bb_page_id == null)
    BBVersionSetup();
  if (tweak_bb_display_view)
    $(tweak_bb_page_id +" script.tweak_script").parents(tweak_row_element).hide();
});

// Lazy Loading code
/*
 * xLazyLoader 1.0 - Plugin for jQuery
 * 
 * Load js, css and  images
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Depends:
 *   jquery.js
 *   tweak_properties.js: declares basepath // how to implement: ?
 *
 *  Copyright (c) 2008 Oleg Slobodskoi (jimdo.com)
 */

;(function($){

	// basepath modification
	var basepath = '';

	$.xLazyLoader =  function ( method, options ) {
		if (typeof method == 'object') {
			options = method;
			basepath = '';
			method = 'load';
		};
		
		xLazyLoader[method]( options );
	};
	
	var xLazyLoader = new function ()
	{
		var head = document.getElementsByTagName("head")[0];
		
		this.load = function ( options )
		{
			//Defaults
			var d = {
				js: [],
				css: [],
				image: [],
				name: null,
				load: function(){}
			};
			$.extend(d, options);

			// basepath modification
			if (basepath.length == 0 && typeof tweak_path == 'string')
				{basepath = tweak_path;}

			var self = this,
				ready = false,
				loaded = {
					js: [],
					css: [],
					image: []
				}
			;
			
			each('js', d.js);
			each('css', d.css);
			each('image', d.image);
			
			function each (type, urls)
			{
				if ( $.isArray(urls) && urls.length>0 )
					$.each( urls, function(i, url){
						load(type, basepath+url);
					});
				else if (typeof urls == 'string')
					load(type, basepath+urls);
			};

			function load (type, url)
			{
 				self[type](url, function() { 
					$.isArray(d[type]) ? loaded[type].push(url) : loaded[type] = url;
					d.js.length == loaded.js.length 
					&& d.css.length == loaded.css.length 
					&& d.image.length == loaded.image.length
					&& d.load.apply(loaded, []);
                    return;
				}, d.name ?'lazy-loaded-'+ d.name : 'lazy-loaded-'+new Date().getTime());
			};
			
		};
		
		this.loadRootPath = function ( options )
		{
			basepath = '/';
			this.load ( options );
		}
		
		this.js = function (src, callback, name)
		{
			if ($('script[src*="'+src+'"]').length>0) {
				callback();
				return;
			};

            var script = document.createElement('script');
            script.setAttribute("type","text/javascript");
            script.setAttribute("src", src);
            script.setAttribute('id', name);

			if ($.browser.msie)
				script.onreadystatechange = function ()	{
					 /loaded|complete/.test(script.readyState) && callback();
				}
			else
				//FF, Safari, Opera
				script.onload = callback;

			head.appendChild(script);
		};
		
		this.css = function (href, callback, name)
		{
			if ($('link[href*="'+href+'"]').length>0) {
				return;
			};

			var link = document.createElement('link');
			link.type = 'text/css';
			link.rel = 'stylesheet';
			link.href = href;
			link.id = name;
			link.media = 'screen';
			head.appendChild(link);
		};
		
		this.image = function (src, callback)
		{
			var img = new Image();
			img.onload = callback;
			img.src = src;
		};
	};

})(jQuery);		