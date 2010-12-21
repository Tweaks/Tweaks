/*
function radioPop(el, field,text){
	for (var i = 0, buts=el.form.elements; i < buts.length; i++)
	{
	 if(buts[i].name==el.name&&buts[i].checked) {
		el.form.elements[field].value=buts[i].value;
		document.getElementById("usage_instruction").innerHTML =  text;
	 }
	}
}

function handleAvail(param1, param2) {
	var myselect = "tweak_avail" + param2;
	var avail_value= document.getElementById(myselect).value;
	window.location ="tweak_availability.jsp?TweakID=" + param1 + "&avail_value=" + avail_value;
}*/

// manage
function removeTweak(tweakid) {
	var isSubmit = window.confirm("This action is final and cannot be undone. Remove?");
	if (isSubmit)
	{
		window.location = "delete_tweak.jsp?TweakID="+tweakid;
	}
}

jQuery.noConflict();
jQuery(function($) {
	// manage
	$("select.tweak_avail").change(function() {
		document.location = "tweak_availability.jsp?TweakID=" + $(this).attr("id") + "&avail_value=" + $(this).val();
	});
	// create / modify: extra help
	if (typeof(tweak_live_help) == "String" && tweak_live_help.length)
	{
		$("#usage_instruction").append("<strong><a href=\""+tweak_live_help+"\">Examples of Tweak Packages in Blackboard</a></strong>");
	}
});