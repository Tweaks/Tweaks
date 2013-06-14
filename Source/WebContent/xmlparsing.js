// JavaScript Document
var xmlURL = "tweak_packages.xml";
$(document).ready(function()
{
  $.ajax({
    type: "GET",
    url: xmlURL,
    dataType: "xml",
    success: parseXml
  });
});

var test;
function parseXml(xml) {
	test = xml;
	alert(xml);
	alert("packages"+xml.find("package").length);
}