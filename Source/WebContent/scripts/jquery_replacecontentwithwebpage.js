/* 
 
 Replace Content with Webpage
 
 Version 1 (Nov 2012)
 
 This script replaces the legacy loadiframeascontent.js and loadsubsite.js tweaks

   Copyright 2012 Christopher Baldwin, Tim Plaisted (Queensland University of Technology)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License. 
  
*/



// returns true if the iframe is from another domain. 
// we can only see the height of frame contents if they come from the same protocol, host + port
var xdom = function(url) {
  var blackboardServerURL = location.protocol + '//' + location.host + '/';
  if (url.indexOf(blackboardServerURL)) {
    console.log(url);
    return url;
  } else {
    return false;
  }
};

var restyleFrame = function() {

  // check if we're loading an external site (note: $ = prototype!!)
  if (!(xdom($('tweakframe').src))) {
    
    jQuery(function($) {
    
      var frame = $("#tweakframe").contents();
      
      if (frame.find("#navigationPane, #breadcrumbs").length) {

        // re-style parent content item
        $("#content, #tweakframe").css({
          "height": frame.find(".locationPane").height() + 10,
          "border": "none",
          "-moz-border-radius": "none",
          "-webkit-border-radius": "none",
          "border-radius": "none",
          "-moz-box-shadow": "none",
          "-webkit-box-shadow": "none",
          "box-shadow": "none"
        });

        // restyle frame elements
        frame.find("body").css("padding", "0");
        frame.find("#navigationPane, #breadcrumbs").hide();
        frame.find("div.locationPane").css("margin-top", "0");
        frame.find("#contentPane, div.contentPane").css("margin", "0px");
        frame.find(".footer").css("display","none","important");
        frame.find("script.tweak_script").parents(tweak_bb.row_element).hide();

        // hyperlink click events
        frame.find("a").click(function() {
        
          // check for blanks, targetted link, hideshow, submenu
          if ($(this).attr("href") == "#" || $(this).filter("[target]").length > 0 || $(this).hasClass("hideShowLink") || $(this).parent("#intmenu").length > 0) {
            // don't get in the way
            return false;
          } else {
            return true;
          }
        });
      }

      // non-blackboard page (but still same domain so assume it's uploaded content)
      else {
        $("#content, #tweakframe").css({
          "height": frame.height() + 10
        });
      }
    });
  }

  // non-blackboard and different domain, we set arbitary height of over 9000 and warning splashes
  else {
    jQuery('#inlineReceipt_good').remove();
    jQuery('#contentPanel').prepend('<div id="inlineReceipt_good" class="receipt good"><h3 class="hideoff">External Webiste</h3><span tabindex="-1" id="goodMsg1">The following website is outside this Blackboard system.</span><br>  <a class="close" href="#" title="Close" onclick="Element.remove($(\'inlineReceipt_good\'));return false;"><img alt="Close" src="/images/ci/ng/close_mini.gif"></a></div>');
    jQuery("#content, #tweakframe").height = "4920px";
  }

  // we all done, reveal
  jQuery("#content").show();
};


var replaceContentWithURL = function(url) {
  jQuery(function($) {
    $("#content").html("<iframe id='tweakframe' src=\"" + url + "\" width=\"100%\" height=\"4920px\" frameBorder=\"0\"></iframe>");
    $("#tweakframe").load(restyleFrame).ready(restyleFrame);
  });
};


jQuery(function($) {
  if (window.tweak_bb === null || window.tweak_bb.page_id === null) {
    window.tweak_bb = {
      page_id: "#pageList",
      row_element: "li"
    };
  }

  // utility extension: case insensitive contains
  jQuery.expr[':'].cicontains = function(a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
  };

  // if we're in edit mode
  if (tweak_bb.display_view) {

    // look for iframes first
    if ($("iframe").length) {
      replaceContentWithURL($("iframe:eq(0)").attr('src'));
    }

    // look for everything else now
    else {
      var linknames = ['Load Webpage', 'Web Package', 'Site Link'];
      $.each(linknames, function(index, linkname) {
        var link = $(tweak_bb.page_id + " > " + tweak_bb.row_element).children(".item:cicontains(\"" + linkname + "\")").parents(tweak_bb.row_element).find("a:first");
        if (link.length) {
          replaceContentWithURL(link.attr('href'));
        }
      });
    }

    $("#contentPanel div.topRound").hide();
  }
});