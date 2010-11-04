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

 * jquery_faq
 * todo: add CSS file .faqAnswer").css("display", "block") .faqQuestion").css({"padding-top": "8px", "display": "block" and display: print
 */
jQuery(function($) {
	// find faqs
	var faqRows = jQuery("#pageList h3.item:contains('FAQ')").parents("li").addClass("faq");
	if (faqRows) {
		// find questions and answers
		// jQuery 1.4.2 bug: faqRows.children("div.details").find("b, strong, div[style*='bold']").addClass("faqQuestion").each(function(){
		jQuery("#pageList .faq b, #pageList .faq strong, #pageList .faq div[style*='bold']").addClass("faqQuestion").each(function(){
			jQuery(this).nextUntil(".faqQuestion, *:has(.faqQuestion)").wrap("<span class=\"faqAnswer\"><span>");
		});
		// attach faq functionality
		faqRows.find(".faqQuestion").css({"padding-top": "8px", "display": "block"}).click(function(){
			var faqShowing = (jQuery(this).next(".faqAnswer:visible").length > 0);
			jQuery(".faqAnswer").hide();
			jQuery(this).nextUntil(".faqQuestion, *:has(.faqQuestion)").toggle(!faqShowing);
		});
		// hide on init
		jQuery(".faqAnswer").css("display", "block").hide();
	}
});