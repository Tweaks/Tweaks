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

 * jquery_faq
 */
jQuery(function($) {
	// find faqs
	var faqRows = jQuery(tweak_bb.page_id +" > "+tweak_bb.row_element).children(".item:contains('FAQ')").parents(tweak_bb.row_element).addClass("faq");
	if (faqRows) {
		// find questions and answers
		// jQuery 1.4.2>4 bug: faqRows.children("div.details").find("b, strong, *[style*='bold']").addClass("faqQuestion").each(function(){
		// set up questions and make sure parent is at top level of content
		faqRows.find("div.details").find("b, strong").addClass("faqQuestion");
		// ie7 workaround: retest in jQuery 1.5.x
		faqRows.find("div.details").find("div, span").filter(function(){
				return (jQuery(this).attr("style") && jQuery(this).attr("style").indexOf("bold")>0);
			}).addClass("faqQuestion");
		
		faqRows.find(".faqQuestion").each(function(){
			//jQuery("#pageList .faq b, #pageList .faq strong, #pageList .faq div[style*=bold], #pageList .faq span[style*=bold]").addClass("faqQuestion").each(function(){
			var node = jQuery(this);
			// test while / if
			while(node.parents("div.details").length && !node.parent().is("span.fnt0") && !node.parent().is("div.vtbegenerated"))
				node = node.parent();
			node.addClass("faqQuestion").find(".faqQuestion").removeClass("faqQuestion");
		});
		// wrap any text nodes: note justice blog also has last child text node wrapping based on specific content
		faqRows.each(function(){
			var container = jQuery(this).find(".faqQuestion:first").parent();
			container.contents().each(function(){
				if (this.nodeType == 3)
				{	
					var thisText = jQuery.trim(this.data);
					if (thisText) {
						this.data = thisText;
						jQuery(this).wrap("<span></span>")
					}
				}
			});
		});
		
		// fix this cross browser / deal with text nodes
		faqRows.find(".faqQuestion").each(function(){
			jQuery(this).nextUntil(".faqQuestion, *:has(.faqQuestion)").wrap("<div class=\"faqAnswer\"><div>");
		}).click(function(){ // attach faq functionality
			var faqShowing = (jQuery(this).next(".faqAnswer:visible").length > 0);
			jQuery(".faqAnswer").hide();
			jQuery(this).nextUntil(".faqQuestion, *:has(.faqQuestion)").toggle(!faqShowing);
		});
		// hide on init
		faqRows.find(".faqAnswer").hide();
	}
});