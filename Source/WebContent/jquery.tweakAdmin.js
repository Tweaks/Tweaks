// sysadmin manage delete
function removeTweak(tweakid) {
	var isSubmit = window.confirm("This action is final and cannot be undone. Remove?");
	if (isSubmit)
	{
		window.location = "delete_tweak.jsp?TweakID="+tweakid;
	}
}

jQuery.noConflict();
jQuery(function($) {
	// sysadmin manage availability
	$("select.tweak_avail").change(function() {
		document.location = "tweak_availability.jsp?TweakID=" + $(this).attr("id") + "&avail_value=" + $(this).val();
	});
  
	// add / modify live_help href
	if (typeof(tweak_live_help) == "string" && tweak_live_help.length)
	{
		$("#usage_instruction").after("<span id=\"live_help\"><a href=\""+tweak_live_help+"\" target=\"_blank\">See detailed examples of Tweak usage in Blackboard</a></span>");
		// set for modify page on init
        if ($("fieldset.tweak_fieldset input:checked").length == 1)
        	$("#live_help").attr("href", tweak_live_help+"#"+$("fieldset.tweak_fieldset input:checked").attr("id"));
          
        // attach event
        $("fieldset.tweak_fieldset input").click(function(){
            $("#live_help").attr("href", tweak_live_help+"#"+$(this).attr("id"));
        });	
  }
        
  
});

