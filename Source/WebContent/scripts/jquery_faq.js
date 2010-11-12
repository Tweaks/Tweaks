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
 */
/* nextUntil Including TextNodes adapted from StackOverflow: http://stackoverflow.com/questions/3276133/jquery-wrapping-text-and-elements-between-hr-tags */
jQuery(function($) {
	// find faqs
	var faqRows = jQuery("#pageList h3.item:contains('FAQ')").parents("li").addClass("faq");
	if (faqRows) {
		// find questions and answers
		// jQuery 1.4.2 bug: faqRows.children("div.details").find("b, strong, *[style*='bold']").addClass("faqQuestion").each(function(){
		//jQuery("#pageList .faq b, #pageList .faq strong, #pageList .faq *[style*='bold']").addClass("faqQuestion").each(function(){
		alert(faqRows.find("div.details").find("b, strong, *[style*='bold']").length);
		alert(faqRows.find("div.details").find("b, strong, span[style*='bold'], div[style*='bold']").length);
		alert(jQuery("#pageList .faq span[style*='bold']").length);
		// set up questions and make sure parent is at top level of content
		jQuery("#pageList .faq b, #pageList .faq strong, #pageList .faq div[style*='bold'], #pageList .faq span[style*='bold']").addClass("faqQuestion").each(function(){
			var node = jQuery(this);
			while(node.parents("div.details").length && !node.parent().is("span.fnt0"))
				node = node.parent();
			node.addClass("faqQuestion").find(".faqQuestion").removeClass("faqQuestion");
		});
		jQuery("#pageList .faqQuestion").each(function(){
			//jQuery(this).nextUntil(".faqQuestion, *:has(.faqQuestion)").wrap("<div class=\"faqAnswer\"><div>");
			var $set = jQuery();
			var nxt = this.nextSibling;
			while(nxt) {
				if(!jQuery(nxt).is('.faqQuestion, *:has(.faqQuestion)')) {
					$set.push(nxt);
					nxt = nxt.nextSibling;
				} else break;
			} 
			$set.wrapAll('<div class="faqAnswer"/>');		
		});
		// attach faq functionality
		faqRows.find(".faqQuestion").click(function(){
			var faqShowing = (jQuery(this).next(".faqAnswer:visible").length > 0);
			jQuery(".faqAnswer").hide();
			jQuery(this).nextUntil(".faqQuestion, *:has(.faqQuestion)").toggle(!faqShowing);
		});
		// hide on init
		jQuery(".faqAnswer").hide();
	}
});
		/*
		var questionsFound = 0;
		jQuery("#tq").each(function(){
			//var startElem = jQuery("#tq").get();
			questionsFound++;
			jQuery(this).addClass("faqQuestionStart"+questionsFound);
			var foundBegin = false;
			var foundEnd = false;
			//var $set = jQuery();
			jQuery("#tq").parents("div.details").children().contents().each(function() {
				if(jQuery(this).is('.faqQuestionStart, *:has(.faqQuestionStart)')) { foundBegin = true; alert("hereB"); } // '.faqQuestionStart, *:has(.faqQuestionStart)'
				if(jQuery(this).is('.faqQuestion, *:has(.faqQuestion)')) { foundEnd = true;	alert("hereE");}
				if (foundBegin && !foundEnd)
					alert("hereX"); // $set.push(jQuery(this).get());
			}); //.wrapAll('<div class="faqAnswer"/>');​
		});*/
			//jQuery(this).removeClass("faqQuestionStart").addClass("faqQuestion");
		
		//jQuery(this).nextUntil(".faqQuestion, *:has(.faqQuestion)").wrap("<div class=\"faqAnswer\"><div>");
		/*
		var $set = $();
		var nxt = this.nextSibling;
		if 
		while(nxt) {
			if(!$(nxt).is('.faqQuestion, *:has(.faqQuestion)')) {
				$set.push(nxt);
				nxt = nxt.nextSibling;
			} else break;
		} 
		
		$set.wrapAll('<div class="faqAnswer"/>');
		*/
		/* old style 
		jQuery("#pageList .faq b, #pageList .faq strong, #pageList .faq *[style*='bold']").addClass("faqQuestion").each(function(){
			var jQuery(this).nextUntil(".faqQuestion, *:has(.faqQuestion)").addClass("
			*/