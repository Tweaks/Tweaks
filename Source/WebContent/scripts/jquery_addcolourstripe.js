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
   
 * jquery_addColourStripe (0.4) is script that can be added to a content item in blackboard
 * it applies the colour embedded in a span tag to the containing table row tablecells
 */
// Use with span with class = colourSpan with colour code embedded:
// <span class="colourSpan">[colourcode]</span>
jQuery(function($){
 $("#pageList .colourSpan, #colourSpan").each(function() {
  var colourCODE = $(this).hide().html();
  $(this).parents("li").css("background", colourCODE);
 });
});