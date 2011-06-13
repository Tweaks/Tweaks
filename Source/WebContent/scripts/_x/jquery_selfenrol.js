/*
 * Thickbox 3.1 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2007 cody lindley
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/
// use server path for github hosting or server relative path for building block
var tweak_imagePath = (window.tweak_path == null) ? "../" : ((tweak_path == "") ? "http://tweaks.github.com/Tweaks/Source/WebContent/" : tweak_path) + "images/";
var tb_pathToImage = tweak_imagePath + "loadingAnimation.gif";
/*!!!!!!!!!!!!!!!!! edit below this line at your own risk !!!!!!!!!!!!!!!!!!!!!!!*/
//on page load call tb_init :: customised with functions at end
//add thickbox to href & area elements that have a class of .thickbox
function tb_init(domChunk){
  jQuery(domChunk).click(function(){
  var t = this.title || this.name || null;
  var a = this.href || this.alt;
  var g = this.rel || false;
  tb_show(t,a,g);
  this.blur();
  return false;
  });
}
function tb_show(caption, url, imageGroup) {//function called when the user clicks on a thickbox link
  try {
    if (typeof document.body.style.maxHeight === "undefined") {//if IE 6
      jQuery("body","html").css({height: "100%", width: "100%"});
      jQuery("html").css("overflow","hidden");
      if (document.getElementById("TB_HideSelect") === null) {//iframe to hide select elements in ie6
        jQuery("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>");
        jQuery("#TB_overlay").click(tb_remove);
      }
    }else{//all others
      if(document.getElementById("TB_overlay") === null){
        jQuery("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>");
        jQuery("#TB_overlay").click(tb_remove);
      }
    }
    
    if(tb_detectMacXFF()){
      jQuery("#TB_overlay").addClass("TB_overlayMacFFBGHack");//use png overlay so hide flash
    }else{
      jQuery("#TB_overlay").addClass("TB_overlayBG");//use background and opacity
    }
    
    if(caption===null){caption="";}
    jQuery("body").append("<div id='TB_load'><img src='"+imgLoader.src+"' /></div>");//add loader to the page
    jQuery('#TB_load').show();//show loader
    
    var baseURL;
     if(url.indexOf("?")!==-1){ //ff there is a query string involved
      baseURL = url.substr(0, url.indexOf("?"));
     }else{ 
         baseURL = url;
     }
     
     var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
     var urlType = baseURL.toLowerCase().match(urlString);
    if(urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp'){//code to show images
        
      TB_PrevCaption = "";
      TB_PrevURL = "";
      TB_PrevHTML = "";
      TB_NextCaption = "";
      TB_NextURL = "";
      TB_NextHTML = "";
      TB_imageCount = "";
      TB_FoundURL = false;
      if(imageGroup){
        TB_TempArray = jQuery("a[@rel="+imageGroup+"]").get();
        for (TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML === "")); TB_Counter++) {
          var urlTypeTemp = TB_TempArray[TB_Counter].href.toLowerCase().match(urlString);
            if (!(TB_TempArray[TB_Counter].href == url)) {            
              if (TB_FoundURL) {
                TB_NextCaption = TB_TempArray[TB_Counter].title;
                TB_NextURL = TB_TempArray[TB_Counter].href;
                TB_NextHTML = "<span id='TB_next'>&nbsp;&nbsp;<a href='#'>Next &gt;</a></span>";
              } else {
                TB_PrevCaption = TB_TempArray[TB_Counter].title;
                TB_PrevURL = TB_TempArray[TB_Counter].href;
                TB_PrevHTML = "<span id='TB_prev'>&nbsp;&nbsp;<a href='#'>&lt; Prev</a></span>";
              }
            } else {
              TB_FoundURL = true;
              TB_imageCount = "Image " + (TB_Counter + 1) +" of "+ (TB_TempArray.length);                      
            }
        }
      }
      imgPreloader = new Image();
      imgPreloader.onload = function(){    
      imgPreloader.onload = null;
        
      // Resizing large images - orginal by Christian Montoya edited by me.
      var pagesize = tb_getPageSize();
      var x = pagesize[0] - 150;
      var y = pagesize[1] - 150;
      var imageWidth = imgPreloader.width;
      var imageHeight = imgPreloader.height;
      if (imageWidth > x) {
        imageHeight = imageHeight * (x / imageWidth); 
        imageWidth = x; 
        if (imageHeight > y) { 
          imageWidth = imageWidth * (y / imageHeight); 
          imageHeight = y; 
        }
      } else if (imageHeight > y) { 
        imageWidth = imageWidth * (y / imageHeight); 
        imageHeight = y; 
        if (imageWidth > x) { 
          imageHeight = imageHeight * (x / imageWidth); 
          imageWidth = x;
        }
      }
      // End Resizing
      
      TB_WIDTH = imageWidth + 30;
      TB_HEIGHT = imageHeight + 60;
      jQuery("#TB_window").append("<a href='' id='TB_ImageOff' title='Close'><img id='TB_Image' src='"+url+"' width='"+imageWidth+"' height='"+imageHeight+"' alt='"+caption+"'/></a>" + "<div id='TB_caption'>"+caption+"<div id='TB_secondLine'>" + TB_imageCount + TB_PrevHTML + TB_NextHTML + "</div></div><div id='TB_closeWindow'><a href='#' id='TB_closeWindowButton' title='Close'>Close</a> or Esc Key</div>");     
      
      jQuery("#TB_closeWindowButton").click(tb_remove);
      
      if (!(TB_PrevHTML === "")) {
        function goPrev(){
          if(jQuery(document).unbind("click",goPrev)){jQuery(document).unbind("click",goPrev);}
          jQuery("#TB_window").remove();
          jQuery("body").append("<div id='TB_window'></div>");
          tb_show(TB_PrevCaption, TB_PrevURL, imageGroup);
          return false;  
        }
        jQuery("#TB_prev").click(goPrev);
      }
      
      if (!(TB_NextHTML === "")) {    
        function goNext(){
          jQuery("#TB_window").remove();
          jQuery("body").append("<div id='TB_window'></div>");
          tb_show(TB_NextCaption, TB_NextURL, imageGroup);        
          return false;  
        }
        jQuery("#TB_next").click(goNext);
        
      }
      document.onkeydown = function(e){   
        if (e == null) { // ie
          keycode = event.keyCode;
        } else { // mozilla
          keycode = e.which;
        }
        if(keycode == 27){ // close
          tb_remove();
        } else if(keycode == 190){ // display previous image
          if(!(TB_NextHTML == "")){
            document.onkeydown = "";
            goNext();
          }
        } else if(keycode == 188){ // display next image
          if(!(TB_PrevHTML == "")){
            document.onkeydown = "";
            goPrev();
          }
        }  
      };
      
      tb_position();
      jQuery("#TB_load").remove();
      jQuery("#TB_ImageOff").click(tb_remove);
      jQuery("#TB_window").css({display:"block"}); //for safari using css instead of show
      };
      
      imgPreloader.src = url;
    }else{//code to show html
      
      var queryString = url.replace(/^[^\?]+\??/,'');
      var params = tb_parseQuery( queryString );
      TB_WIDTH = (params['width']*1) + 30 || 630; //defaults to 630 if no paramaters were added to URL
      TB_HEIGHT = (params['height']*1) + 40 || 440; //defaults to 440 if no paramaters were added to URL
      ajaxContentW = TB_WIDTH - 30;
      ajaxContentH = TB_HEIGHT - 45;
      
      if(url.indexOf('TB_iframe') != -1){// either iframe or ajax window    
          urlNoQuery = url.split('TB_');
          jQuery("#TB_iframeContent").remove();
          if(params['modal'] != "true"){//iframe no modal
            jQuery("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton' title='Close'>Close</a> or Esc Key</div></div><iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;' > </iframe>");
          }else{//iframe modal
          jQuery("#TB_overlay").unbind();
            jQuery("#TB_window").append("<iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;'> </iframe>");
          }
		  setupThickboxFrame();
      }else{// not an iframe, ajax
          if(jQuery("#TB_window").css("display") != "block"){
            if(params['modal'] != "true"){//ajax no modal
            jQuery("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'>Close</a> or Esc Key</div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px'></div>");
            }else{//ajax modal
            jQuery("#TB_overlay").unbind();
            jQuery("#TB_window").append("<div id='TB_ajaxContent' class='TB_modal' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>");  
            }
          }else{//this means the window is already up, we are just loading new content via ajax
            jQuery("#TB_ajaxContent")[0].style.width = ajaxContentW +"px";
            jQuery("#TB_ajaxContent")[0].style.height = ajaxContentH +"px";
            jQuery("#TB_ajaxContent")[0].scrollTop = 0;
            jQuery("#TB_ajaxWindowTitle").html(caption);
          }
      }
          
      jQuery("#TB_closeWindowButton").click(tb_remove);
      
        if(url.indexOf('TB_inline') != -1){  
          jQuery("#TB_ajaxContent").append(jQuery('#' + params['inlineId']).children());
          jQuery("#TB_window").unload(function () {
            jQuery('#' + params['inlineId']).append( jQuery("#TB_ajaxContent").children() ); // move elements back when you're finished
          });
          tb_position();
          jQuery("#TB_load").remove();
          jQuery("#TB_window").css({display:"block"}); 
        }else if(url.indexOf('TB_iframe') != -1){
          tb_position();
          if(jQuery.browser.safari){//safari needs help because it will not fire iframe onload
            jQuery("#TB_load").remove();
            jQuery("#TB_window").css({display:"block"});
          }
        }else{
          jQuery("#TB_ajaxContent").load(url += "&random=" + (new Date().getTime()),function(){//to do a post change this load method
            tb_position();
            jQuery("#TB_load").remove();
            tb_init("#TB_ajaxContent a.thickbox");
            jQuery("#TB_window").css({display:"block"});
          });
        }
      
    }
    if(!params['modal']){
      document.onkeyup = function(e){   
        if (e == null) { // ie
          keycode = event.keyCode;
        } else { // mozilla
          keycode = e.which;
        }
        if(keycode == 27){ // close
          tb_remove();
        }  
      };
    }
    
  } catch(e) {
    //nothing here
  }
}
//helper functions below
function tb_showIframe(){
  jQuery("#TB_load").remove();
  jQuery("#TB_window").css({display:"block"});
  styleIframe();
}
function tb_remove() {
  jQuery("#TB_imageOff").unbind("click");
  jQuery("#TB_closeWindowButton").unbind("click");
  jQuery("#TB_window").fadeOut("fast",function(){jQuery('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
  jQuery("#TB_load").remove();
  if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
    jQuery("body","html").css({height: "auto", width: "auto"});
    jQuery("html").css("overflow","");
  }
  document.onkeydown = "";
  document.onkeyup = "";
  location.href = location.href;
  return false;
}
function tb_position() {
jQuery("#TB_window").css({marginLeft: '-' + parseInt((TB_WIDTH / 2),10) + 'px', width: TB_WIDTH + 'px'});
  if ( !(jQuery.browser.msie && jQuery.browser.version < 7)) { // take away IE6
    jQuery("#TB_window").css({marginTop: '-' + parseInt((TB_HEIGHT / 2),10) + 'px'});
  }
}
function tb_parseQuery ( query ) {
   var Params = {};
   if ( ! query ) {return Params;}// return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}
function tb_getPageSize(){
  var de = document.documentElement;
  var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
  var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
  arrayPageSize = [w,h];
  return arrayPageSize;
}
function tb_detectMacXFF() {
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox')!=-1) {
    return true;
  }
}

/* custom code */
/**
 * Customise Thickbox
 * Version: 0.5
 * author Tim Plaisted 2010
 * Call in to setupThickboxFrame in line 196 and to styleIframe in line 256 
 * Added context reload on iframe remove: location.href = location.href;
 * Added local code in to remove from page
 */
var iframeID = "TB_iframeContent"; // AndName
var ifr;
var ifrDoc;

function setupThickboxFrame() {
	ifr = document.getElementById(iframeID);
	if (ifr) {
		ifrDoc = getIframeDocument(ifr);	// && document.location.href.indexOf("Editable") < 0)
		if (ifrDoc)
		{
		  addEvent(ifr, "load", styleIframe); 
		}
	}
}

// iframe code
function styleIframe() {
 jQuery("#" + iframeID).contents().find("a:last, #breadcrumbs .root").hide();
 jQuery("#" + iframeID).contents().find("b:eq(12)").text("Close").css({'background-color' : '#eb0',
																	  	'padding' : '2px',
																		'cursor' : 'pointer',
																		'margin' : '2px',
																		'border' : '2px outset black'}).click(function() { tb_remove(); parent.tb_remove(); }); 
 jQuery("#" + iframeID).contents().find("input[value*=\"Cancel\"]").attr("onclick", "").click(function(e) { tb_remove(); parent.tb_remove(); e.preventDefault(); });
}

// helper functions
// get iframe code
function getIframeDocument(thisIfr) {
 var iFrameDocument;
 if (thisIfr.contentDocument) {
  // For NS6
  iFrameDocument = thisIfr.contentDocument; 
 } else if (thisIfr.contentWindow) {
  // For IE5.5 and IE6
  iFrameDocument = thisIfr.contentWindow.document;
 } else if (thisIfr.document) {
  // For IE5
  iFrameDocument = thisIfr.document;
 }
 return iFrameDocument;
}

// creative commons cross browser helper from Christian Heilmann to append function to onload
function addEvent(obj, evType, fn){ 
 if (obj.addEventListener){ 
   obj.addEventListener(evType, fn, false); 
   return true; 
 } else if (obj.attachEvent){ 
   var r = obj.attachEvent("on"+evType, fn); 
   return r; 
 } else { 
   return false; 
 } 
}
// CUSTOMISED INTIALISATION CODE STARTS HERE
if (window.tweak_bb == null || window.tweak_bb.page_id == null)
	window.tweak_bb = { page_id: "#pageList", row_element: "li" };

// look for hide until enrolled flag before rendering page
var hideContentUntilEnrolled = (jQuery("#hideContentUntilEnrolled").length > 0 && location.href.indexOf("listContent.") > 0);
if (hideContentUntilEnrolled)
	jQuery(tweak_bb.page_id).hide();

// after page ready, set up rest of functionality
jQuery(function($){
	// check if enrol flag found (tweak set as Mark Review enabled -- only displays when enrolled)
	var enrolFlagged = jQuery(tweak_bb.page_id +"  script.tweak_script").parents("div.details").find("a:contains(\"Mark\")").length > 0;
	// if enrol flag found (and hiding until enrolled) display content
	if (enrolFlagged && hideContentUntilEnrolled)
		$(tweak_bb.page_id).show();
	
	// if no enrol flag found -- or in edit mode, add enrol link and set up
	if (!enrolFlagged || tweak_bb.display_view)
	{
	  var comname = $("#breadcrumbs .courseName").text();
	  var enrolMessage = "Self Enrol in ("+comname+") Organization/Community Site</a></h3>You will need to self enrol in this site in order to participate. Click Close after you have enrolled to return to this page.<br><br>";
	  $(tweak_bb.page_id).before("<div><h3><a href=\"#\" class=\"thickbox\">"+enrolMessage+"</div>");
	  $("a.thickbox").attr("title", "Click close after enrolling in site or to cancel enrolment").click(function(){ if (tweak_bb.display_view === false) { $("#addCmItem").hide(); } });
	  // set up enrol link
	  var bb_course_id = location.href.replace(/.*course_id=([^&]+).*/, "$1");
	  var fixedEnrolURL = "/webapps/blackboard/execute/enrollCourse?context=Org&course_id=" + bb_course_id +"&KeepThis=true&TB_iframe=true&height=410&width=795";
	  $("a.thickbox").attr("href", fixedEnrolURL);
	  // set up thickbox
	  tb_init('a.thickbox, area.thickbox, input.thickbox');//pass where to apply thickbox
	  imgLoader = new Image();// preload image
	  imgLoader.src = tb_pathToImage;
	}
});