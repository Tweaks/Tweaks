/* 
   Copyright 2013 Chris Baldwin + Tim Plaisted, Queensland University of Technology

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   
looks for "Banner" item or div / image with id="banner" and inserts it above the page title
*/


jQuery(function ($) {

  //styles #tweak_banner
  var styleBanner = function() {
  $("#tweak_banner").css({
    "display": "block",
      "margin-left": "0",
      "padding": "0 0 12px 0",
      "height": "auto",
      "max-height": "380px",
      "overflow": "hidden",
      "text-align": "center"
  }).parents(tweak_bb.row_element).addClass("tweak_banner").hide().end().insertBefore("#content");
  };
  
  if (window.tweak_bb === null || window.tweak_bb.page_id === null) {
    window.tweak_bb = {
      page_id: "#pageList",
      row_element: "li"
    };
  }

  // find #banner
  $imaBanner = $("#banner");

  if ($imaBanner.length === 0) {

    // no #banner, let's make one
    $(tweak_bb.page_id + " > " + tweak_bb.row_element).children(".item:contains(\"Banner\"):eq(0)").parents(tweak_bb.row_element).find("div.details").find("img:first").attr("id", "banner").wrap('<div id="tweak_banner" />');
    $('#pageBanner img[title="Banner"], #qut_siteWideBanner').remove();

    styleBanner();
  } else {

    // #banner exists, move it's content plx
    $imaBanner.wrap('<div id="tweak_banner" />');
    styleBanner();
  }

  // edit mode
  if (tweak_bb.display_view === false) {
    $(tweak_bb.page_id + " > " + tweak_bb.row_element + ".tweak_banner").show();
  }
});