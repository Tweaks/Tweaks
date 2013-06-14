jQuery(function($){
	// todo: data store blog read write logic
	// todo: change logic on voting on multiple poll items to have one vote and store process
	var poll_vote = function(pollID, selected){
		// read, then submit
		poll_read(pollID);
		// increment selected response votes
		$(selected).data("votes", $(selected).data("votes")+1);
		
		//alert($(selected).data("votes"));
	
		// store
		if(poll_store(pollID)) {
			// on success, write to mark reviewed
			var markReviewedButton = $("#"+pollID).parents("div.details").find("a:contains(\"Mark Reviewed\")");
			if(markReviewedButton.length) {
				var javascriptmarkReviewedAction = $(markReviewedButton).attr("href").replace("javascript:", "");
				eval(javascriptmarkReviewedAction); // causes refresh of pages
			}
			// catch if not reload parent > view results
			poll_view(pollID);
		}
	};
	
	var poll_view = function(pollID) {
		poll_read(pollID);
		$("#"+pollID).find("input, a").hide();
		var max_votes = 0;
		$("#"+pollID).find("input").each(function(){
			//alert($(this).attr("id"));
			if ($(this).data("votes") > max_votes)
				max_votes = $(this).data("votes");
				
			$(this).parents("div.pollanswer").append("<div class=\"votes\">"+$(this).data("votes")+"</div>");
			poll_response_animate($(this).parents("div.pollanswer").find(".votes"), $(this).data("votes"), $("#"+pollID).data("total_votes"));
		});
		$("#"+pollID+" .votes:contains(\""+max_votes+"\")").addClass("maxvotes");
		$("#"+pollID).append("Total votes: "+$("#"+pollID).data("total_votes"));
	};
	
	var poll_read = function(pollID) {
		var total_votes = 0;
		$(".r"+pollID+" span").each(function(){
			var responseID = $(this).attr("class").substr(1);
			var votes = parseInt($(this).text());
			if (votes)
				total_votes += votes;
			else
				votes = 0;
			//alert(responseID+" "+votes);
			$("#"+responseID).data("votes", votes);
			//alert(responseID+" "+$("#"+responseID).data("votes"));
		});
		//alert(total_votes);
		$("#"+pollID).data("total_votes", total_votes);
	};
	
	var poll_store = function(pollID){
		var newrecord = "<div class=\"r"+pollID+" rpoll\">";
		$("#"+pollID).find("input").each(function(){
			newrecord += "<span class=\"r"+$(this).attr("id")+"\">"+$(this).data("votes")+"</span>";
		});
		newrecord += "</div>";

		// write to wiki
		$(".r"+pollID).replaceWith(newrecord);
		return true;
	};
	
	var poll_response_animate = function(voteElem, votes, total_votes) {
		var base_width = 40;
		$(voteElem).width(base_width + Math.round(votes/total_votes*180));
	};
	
	// returns -1 if voting not setup and or student not enrolled / 0 if not voted / 1 if voted
	var check_mark_review_button = function(pollID){
		var voted = 0;
		if($("body.ineditmode").length) {
			// check if review enabled
			if($("#"+pollID).parents("div.details:contains(\"Enabled: Review\")").length == 0) {
				$("#"+pollID).append("<br>Set Review Status to \"Enabled\" via the grey drop down box above to complete setup for enrolled students.");
				voted = -1;
			}
		} else {
			var reviewLink = $("#"+pollID).parents("div.details").find("a:contains(\"Reviewed\")");
			if (reviewLink.length == 0) {
				$("#"+pollID).append("<br>Voting currently disabled").find("input").attr("disabled", true);
				voted = -1; // review not set up or student not enrolled
			} else {
				$(reviewLink).hide();
				if ($(reviewLink).text().indexOf("Mark") == -1)
					voted = 1;
			}
		}
		return voted;
	}

	// setup poll
	$(".quickpoll").each(function(p){
		$(this).attr("id", "poll"+p).wrapInner("<span></span>");
		
		// generate poll
		var questions = $(this).nextAll("table:eq(0)").hide().find("td");
		//alert(questions.length+" "+i);
		//after("<div class=\"pollquestions\"></div>");
		var formattedquestions = "";
		for (var q = 0; q < questions.length; q++) {
			var pollanswerid = "poll" + p + q;
			formattedquestions += "<div class=\"pollanswer\">"+
								  "<input type=\"radio\" name=\"poll"+p+"\" id=\""+pollanswerid+"\" value=\"input\"/>"+
								  "<label for=\""+pollanswerid+"\">"+$(questions).eq(q).text()+"</label></div>";
		//$(this).wrap("<form></form>");
		}
		$(this).append(formattedquestions);

		// check if voted
		// use Mark Review button
		var voted = check_mark_review_button("poll"+p);
		if (voted == 0) {
			// add vote links
			$(this).append("<span><a href=\"#\" class=\"submitpoll\">Vote</a> <a href=\"#\" class=\"viewpoll\">View Results</a></span>");
	
			// vote
			$("#poll"+p+" .submitpoll").click(function(e){
				var selected = $(this).parents("div.quickpoll").find("input:checked");
				if(selected.length == 0)
					alert("Please select an item");
				else
					poll_vote($(this).parents("div.quickpoll").attr("id"), $(selected)); //$(selected).next("label").text()
				e.preventDefault();
			});
		
			// view results	
			$("#poll"+p+" .viewpoll").click(function(e){
				poll_view($(this).parents("div.quickpoll").attr("id"));
				e.preventDefault();
			});
		} else if (voted == 1) {
			// voted, read results and generate graph
			poll_view($(this).attr("id"));
		}
	});	 
});