<%@	page language="java"            
                import="java.util.*,
				java.text.*,
				java.util.regex.*,
				blackboard.base.FormattedText,
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
				au.edu.qut.b2.data.custom.*,
				au.edu.qut.b2.data.utilities.*,
				javax.xml.parsers.DocumentBuilderFactory,
				javax.xml.parsers.DocumentBuilder,
				org.w3c.dom.*,
				au.edu.qut.b2.tweak.TweakItemComparator,
				blackboard.platform.persistence.PersistenceServiceFactory,
				java.io.*"
		pageEncoding="UTF-8"
		errorPage="/error.jsp"
	
%>
<%@ taglib uri="/bbUI" prefix="bbUI"%>
<%@ taglib uri="/bbData" prefix="bbData"%>
<%@ taglib uri="/bbNG" prefix="bbNG"%>
<bbNG:learningSystemPage ctxId="ctx">
<%
if (!PlugInUtil.authorizeForCourseControlPanel(request, response))
  return;
	String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
	String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";
%>


<%

Course thisCourse = ctx.getCourse();
String thisCourseId=thisCourse.getCourseId();
String srcCourseId = thisCourseId;
String action = request.getParameter("action");
String title = "Tweak";

//Date startDate = null;
//Date endDate = null;
boolean isTracked = false;
boolean isAvailable = true;

Calendar now = new GregorianCalendar();
DateFormat df = DateFormat.getDateInstance(DateFormat.SHORT);
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
//Calendar startDateCal = Calendar.getInstance();
//Calendar endDateCal = Calendar.getInstance();
FormattedText courseDocBody;
String labelForAction = "";
String courseDocText;

BbPersistenceManager bbPm = PersistenceServiceFactory.getInstance().getDbPersistenceManager();
Container bbContainer = bbPm.getContainer();
ContentDbLoader courseDocumentLoader = (ContentDbLoader) bbPm.getLoader( ContentDbLoader.TYPE );	
Id courseId = bbPm.generateId(Course.DATA_TYPE,request.getParameter("course_id"));
Id parentId = bbPm.generateId(CourseDocument.DATA_TYPE,request.getParameter("content_id")); 


Id contentId = new PkId( bbContainer, CourseDocument.DATA_TYPE, request.getParameter("content_id") );
Content courseDoc = courseDocumentLoader.loadById( contentId );
isTracked = courseDoc.getIsTracked();
isAvailable = courseDoc.getIsAvailable();
Calendar startDate = courseDoc.getStartDate();
Calendar endDate = courseDoc.getEndDate();
title = courseDoc.getTitle();
labelForAction = "Modify";
%>
<bbNG:pageHeader >
<bbNG:breadcrumbBar isContent="true" >
  <bbNG:breadcrumb>Modify Tweak</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="<%=thisPluginImageUrlPath %>" title="Modify Tweak"></bbNG:pageTitleBar>
</bbNG:pageHeader>
<%@ include file="/admin/genConfigPath.jsp"%>
<%@ include file="XMLData.jsp"%>
<bbNG:jsFile href="jquery.js"/>
<bbNG:jsFile href="jquery.tweakSetup.js"/>
<bbNG:jsFile href="jquery.tweakAdmin.js"/>
<bbNG:cssBlock>
	<link type="text/css" href="../styles/tweakAdmin.css" rel="stylesheet">
</bbNG:cssBlock>



<%
courseDocBody = courseDoc.getBody();
courseDocText = courseDocBody.getText();
Pattern p1 = Pattern.compile("<!--- TweakID=");
Pattern p2 = Pattern.compile("--->");
Matcher m1 = p1.matcher(courseDocText);
Matcher m2 = p2.matcher(courseDocText);
int twStart =0;
int twEnd=0;
String tweakID = "";
if (m1.find())
{ 
	twStart =m1.end();
}

if (m2.find())
{
	twEnd=m2.start();
}

if ( twStart > 0 && twEnd > 0) {
	tweakID =courseDocText.substring(twStart,twEnd-1);
	//out.print(tweakID + " hoooray<br>");
}


%> 


<%
String isAvailableChk0 = "";
String isAvailableChk1 = "";
String isTrackChk0 = "";
String isTrackChk1 = "";
action ="modify";

if (isAvailable)
{
	isAvailableChk0 = "checked";
	isAvailableChk1 = "";
}
else
{
	isAvailableChk0 = "";
	isAvailableChk1 = "checked";
}

if (isTracked)
{
	isTrackChk0 = "checked";
	isTrackChk1 = "";
}
else
{
	isTrackChk0 = "";
	isTrackChk1 = "checked";
}

%>


<form action="modify_proc.jsp" method="post" name="addModify">
	<bbNG:dataCollection showSubmitButtons="true"> 
	<input type=hidden name=content_id value="<%=request.getParameter("content_id")%>">
	<input type=hidden name=course_id value="<%=request.getParameter("course_id")%>">
	<input type=hidden name=action value="<%=action%>">
	<input type=hidden name=title value="<%=title%>">
	<bbNG:step title="Script Options">
		<bbNG:dataElement>
		<bbNG:jsBlock>
        <script language="javascript" type="text/javascript">
			jQuery(function($) {
			 <% 
			 	for (int i=0; i < tweakItems.size(); i++) { 
				  if (tweakItems.get(i)[3].equals("true")) { %>
				$("#<%=tweakItems.get(i)[7]%>").click(function(){$("#usage_instruction").text("<%=tweakItems.get(i)[5]%>");inlineFormatInstructions();});
 		  	 <%   }
			 	  if (tweakID.equals(tweakItems.get(i)[7])) {
			  %>
			  	$("#usage_instruction").text("<%=tweakItems.get(i)[5]%>").show();
				inlineFormatInstructions();
			 <%	  }
				}
				%>
				var maxheight = 0;
				jQuery(".tweak_fieldset").each(function(){ if (jQuery(this).height() > maxheight) { maxheight = jQuery(this).height();} }).height(maxheight);
			});
			function inlineFormatInstructions() {
				jQuery("#usage_instruction").html(jQuery("#usage_instruction").html().replace(/&lt;br[\/]?&gt;/g, "<br/>").replace(/'/g, "\""));
			}
        </script>
        </bbNG:jsBlock>
  		<fieldset class="tweak_fieldset">
		 <span><strong>Structure</strong></span>
		  	<% for (int i=0; i < tweakItems.size(); i++) {
		  		if (tweakItems.get(i)[3].equals("true")) {
		 			if (tweakItems.get(i)[1].equals("Structure")){ %>
		 				<input type="radio" name="tweak_script" id="<%=tweakItems.get(i)[7]%>" value="<%=tweakItems.get(i)[7]%>" <%if (tweakID.equals(tweakItems.get(i)[7])){out.print("CHECKED");}%>><label for="<%=tweakItems.get(i)[7]%>" class="tweak_fieldset"><%=tweakItems.get(i)[0]%></label><br>
  		  <%    }
			  } 
			} %>
		</fieldset>
		<fieldset class="tweak_fieldset">
			  <span><strong>Presentation</strong></span>
			  <% for (int i=0; i < tweakItems.size(); i++) { 
				  if (tweakItems.get(i)[3].equals("true")) {
			  		if (tweakItems.get(i)[1].equals("Presentation")){ %>
		 				<input type="radio" name="tweak_script" id="<%=tweakItems.get(i)[7]%>" value="<%=tweakItems.get(i)[7]%>" <%if (tweakID.equals(tweakItems.get(i)[7])){out.print("CHECKED");}%>><label for="<%=tweakItems.get(i)[7]%>" class="tweak_fieldset"><%=tweakItems.get(i)[0]%></label><br>
  		  <%    }
			  } 
			} %>
		</fieldset>
		<fieldset class="tweak_fieldset" >
		 	<span><strong>Learning Activities</strong></span>
		 	<% for (int i=0; i < tweakItems.size(); i++) { 
		 		if (tweakItems.get(i)[3].equals("true")) {
		 			if (tweakItems.get(i)[1].equals("Learning Activities")){ %>
		 				<input type="radio" name="tweak_script" id="<%=tweakItems.get(i)[7]%>" value="<%=tweakItems.get(i)[7]%>" <%if (tweakID.equals(tweakItems.get(i)[7])){out.print("CHECKED");}%>><label for="<%=tweakItems.get(i)[7]%>" class="tweak_fieldset"><%=tweakItems.get(i)[0]%></label><br>
  		  <%    }
			  } 
			} %>
		</fieldset>
		<fieldset class="tweak_fieldset">
			  <span><strong>Tools</strong></span>
			  <% for (int i=0; i < tweakItems.size(); i++) { 
				  if (tweakItems.get(i)[3].equals("true")) {
			  		if (tweakItems.get(i)[1].equals("Tools")){ %>
		 				<input type="radio" name="tweak_script" id="<%=tweakItems.get(i)[7]%>" value="<%=tweakItems.get(i)[7]%>" <%if (tweakID.equals(tweakItems.get(i)[7])){out.print("CHECKED");}%>><label for="<%=tweakItems.get(i)[7]%>" class="tweak_fieldset"><%=tweakItems.get(i)[0]%></label><br>
  		  <%    }
			  } 
			} %>
		</fieldset>
		</bbNG:dataElement>
		 <bbNG:dataElement label="Usage Instructions">
		 	<div id="usage_instruction"></div>
		</bbNG:dataElement>
		<bbNG:dataElement>
		 	<input name="usage" type="Hidden" />
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:step title="Release Options">	
		<bbNG:dataElement label="Make the content available">
			<input type="Radio" name="isAvailable" value="true" <%=isAvailableChk0%>>Yes <input type="Radio" name="isAvailable" value="false" <%=isAvailableChk1%>>No 
		</bbNG:dataElement>
		<bbNG:dataElement label="Track number of views">
			<input type="Radio" name="isTracked" value="true" <%=isTrackChk0%>>Yes <input type="Radio" name="isTracked" value="false" <%=isTrackChk1%>>No 
		</bbNG:dataElement>
		<bbNG:dataElement label="Choose date and time restrictions">
			<bbNG:dateRangePicker 
				baseFieldName="bbDateTimePicker"
				startDateTime="<%=startDate%>" 
				endDateTime="<%=endDate%>"
				showTime = "true"
			/>
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:stepSubmit   />
	</bbNG:dataCollection>
</form>
</bbNG:learningSystemPage >