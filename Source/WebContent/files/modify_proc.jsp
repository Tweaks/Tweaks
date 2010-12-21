<%@	page language="java"            
                import="java.text.*,
				java.util.regex.*,
				java.util.Date,
				java.util.Calendar,
				java.net.URLEncoder,
				blackboard.base.*,
				blackboard.data.*,
				blackboard.data.user.*,
				blackboard.data.content.*,
				blackboard.data.course.*,
				blackboard.persist.*,
				blackboard.persist.user.*,
				blackboard.persist.course.*,
				blackboard.persist.content.*,
				blackboard.platform.plugin.*,
				blackboard.platform.*,
				blackboard.platform.persistence.PersistenceServiceFactory,
				blackboard.util.RequestUtil,
				blackboard.data.ReceiptMessage,
				blackboard.data.ReceiptOptions,
				blackboard.platform.servlet.InlineReceiptUtil,
				blackboard.db.*,
				au.edu.qut.b2.data.custom.*,
				au.edu.qut.b2.data.utilities.*,
				javax.xml.parsers.DocumentBuilderFactory,
				javax.xml.parsers.DocumentBuilder,
				org.w3c.dom.*,
				au.edu.qut.b2.tweak.TweakItemComparator,
				java.io.*,
				java.util.*,
				java.sql.*"
		pageEncoding="UTF-8"
		errorPage="/error.jsp"
%>
<%@ taglib uri="/bbNG" prefix="bbNG"%>

<bbNG:learningSystemPage ctxId="ctx">
<%@ include file="XMLData.jsp"%>
<% 
Course thisCourse = ctx.getCourse();

String action = request.getParameter("action");
if (!PlugInUtil.authorizeForCourseControlPanel(request, response))
  return;

BbPersistenceManager bbPm = PersistenceServiceFactory.getInstance().getDbPersistenceManager();
ContentDbPersister persister = (ContentDbPersister) bbPm.getPersister( ContentDbPersister.TYPE );
ContentDbLoader cLoader = (ContentDbLoader) bbPm.getLoader( ContentDbLoader.TYPE );
 
Id courseId = bbPm.generateId(Course.DATA_TYPE,request.getParameter("course_id"));
Content courseDoc = new CourseDocument();
Id contentId = bbPm.generateId(Content.DATA_TYPE,request.getParameter("content_id"));
courseDoc = cLoader.loadById(contentId);
Id parentId = courseDoc.getParentId();

String strReturnUrl = PlugInUtil.getEditableContentReturnURL(courseDoc.getParentId());
String uriStem = PlugInUtil.getUriStem("qut", "tweakbb");

String isTracked = 		RequestUtil.getStringParameter(request, "isTracked","false");
String isAvailable =	RequestUtil.getStringParameter(request, "isAvailable","false");
String startDate  = 	RequestUtil.getStringParameter(request, "bbDateTimePicker_start_datetime",null);
String useStartDate  = 	RequestUtil.getStringParameter(request, "bbDateTimePicker_start_checkbox","0");
String endDate = 		RequestUtil.getStringParameter(request, "bbDateTimePicker_end_datetime",null);
String useEndDate = 	RequestUtil.getStringParameter(request, "bbDateTimePicker_end_checkbox","0");
String tweakScript =	RequestUtil.getStringParameter(request, "tweak_script","");

String tweakName = "";
Boolean success = true;

if (tweakScript != "")
{
	String tweak_text = "";
	String usage_type = request.getParameter("tweak_script");
	for (int i=0; i < tweakItems.size(); i++) { 
		if (tweakItems.get(i)[7].equals(usage_type)){  		
			tweakName = tweakItems.get(i)[0];
	 		String stEmbed = tweakItems.get(i)[6];
	 		String tweak_header = "<br> Edit this item to see instructions. This item will be hidden in Edit Mode: OFF (i.e. the view that students see)." +
			"<script src='"+uriStem+"jquery.js' type='text/javascript'></script>"+
		 	 "<script src='"+uriStem+"jquery.tweakSetup.js' type='text/javascript'></script>\n"+
			"<script type='text/javascript' class='tweak_script'>\n"+
			"jQuery(function($) {\n"+
			"  $.xLazyLoader({ ";
			String tweak_footer = "});});</script>";
 			tweak_text = "<!--- TweakID="+usage_type+" --->" + tweakName + tweak_header + stEmbed + tweak_footer;
		}
	} 

	FormattedText courseDocBody = new FormattedText(tweak_text, FormattedText.Type.HTML);
	courseDoc.setBody(courseDocBody);
	courseDoc.setTitle(request.getParameter("title"));
	courseDoc.setIsAvailable(isAvailable.equals("true"));
	courseDoc.setIsTracked(isTracked.equals("true"));
	
	if (useStartDate.equals("1")){courseDoc.setStartDate((Calendar) DbUtil.stringToCalendar(startDate));}
	else {courseDoc.setStartDate(null);}
	if (useEndDate.equals("1")) {courseDoc.setEndDate((Calendar) DbUtil.stringToCalendar(endDate));}
	else {courseDoc.setEndDate(null);}

	persister.persist(courseDoc);
} else {
	success = false;
}

String strMessage = (success) ? "Success: Tweak "+tweakName+" modified." : "Fail: Tweak update empty.";
StringBuffer returnUrl = new StringBuffer("");
returnUrl.append(strReturnUrl);
returnUrl.append("&");
if (success)
	returnUrl.append(InlineReceiptUtil.SIMPLE_STRING_KEY);
else
	returnUrl.append(InlineReceiptUtil.SIMPLE_ERROR_KEY);
try {
	returnUrl.append("=").append(URLEncoder.encode(strMessage, "UTF-8"));
} catch (UnsupportedEncodingException e) {
	// UTF-8 supported.
}
response.sendRedirect(returnUrl.toString());
%>
</bbNG:learningSystemPage >