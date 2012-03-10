/* Tweak Setup. File also contains lazy Loading code adapted from xLazyLoader by Oleg Slobodoskoi (see separate copyright notice below)
Version 3.1.9 -- client viewable version of BB Manifest
Copyright 2011, 2012 Tim Plaisted, Queensland University of Technology

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

Status: rewriting and testing for online trial deployment across BB8, BB9 and BB9.1
*/ 
// paths: configured via bb admin
var tweak_path = "/webapps/qut-tweakbb-bb_bb60/"; 
var tweak_live_help = "http://tweaks.github.com/Tweaks/description.html"; 
var tweak_bb_active_url_pattern = "listContent.jsp";
// static code: tweak currently compatible with 8, 9 and 9.1
function BBVersionSetup() {
	// namespace setup and display view
	window.tweak_bb = {
		display_view: (location.href.indexOf(tweak_bb_active_url_pattern) > 0)
	};
	// version detect
	var bb_page_id_9 = "#pageList";
	var bb_page_id_9_x = "#content_listContainer";
	var BB8, BB9, BB9_x;
	BB8 = BB9 = BB9_x = false;
	BB9_x = (jQuery(bb_page_id_9_x).length == 1);
	if (!BB9_x) {
		BB9 = (jQuery(bb_page_id_9).length == 1);
		if (!BB9) { // make BB8 look like 9
			BB8 = true;
			var page = tweak_bb.display_view ? jQuery("h1.pageTitle").next("table") : jQuery("#endActionBar ~ table:eq(0)");
			page.attr("id", "pageList");
		}
	}
	// add version id and rowspace info to namespace
	tweak_bb.page_id = BB9_x ? bb_page_id_9_x : bb_page_id_9;
	tweak_bb.row_element = BB8 ? "tr" : "li";
}

jQuery(function($) {
  if (window.tweak_bb == null)
    BBVersionSetup();
  if (tweak_bb.display_view)
    $(tweak_bb.page_id +" script.tweak_script").parents(tweak_bb.row_element).hide();
});

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
			//link.media = 'screen';
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