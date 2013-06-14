// print frame
// Author: Tim Plaisted
// Version: 0.2
jQuery(document).ready(function($){
	$(".breadcrumb:last").parent().prepend('<span style="float:right; padding-left:5px"><a href="#" onclick="window.print();return false;" target="_blank" class="printlink breadcrumb">Print Frame</a></span>');
});