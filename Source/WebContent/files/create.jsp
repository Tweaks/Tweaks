<%@	page language="java"            
                import="java.util.*,
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

<%@ taglib uri="/bbData" prefix="bbData"%>
<%@ taglib uri="/bbNG" prefix="bbNG"%>
<%@ taglib uri="/bbUI" prefix="bbUI"%>

<bbNG:learningSystemPage ctxId="ctx">
<%
if (!PlugInUtil.authorizeForCourseControlPanel(request, response))
  return;
	String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
	String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";
%>
<% String labelForAction = "Add";%>

<%

Course thisCourse = ctx.getCourse();
String thisCourseId=thisCourse.getCourseId();
String srcCourseId = thisCourseId;
//String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
//String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";
String action = request.getParameter("action");
String title = "Tweak";

Date startDate = null;
Date endDate = null;
boolean isTracked = false;
boolean isAvailable = true;
Calendar startDateCal = Calendar.getInstance();
Calendar endDateCal = Calendar.getInstance();
FormattedText courseDocBody;

BbPersistenceManager bbPm = PersistenceServiceFactory.getInstance().getDbPersistenceManager();
Container bbContainer = bbPm.getContainer();
ContentDbLoader courseDocumentLoader = (ContentDbLoader) bbPm.getLoader( ContentDbLoader.TYPE );	
Id courseId = bbPm.generateId(Course.DATA_TYPE,request.getParameter("course_id"));
Id parentId = bbPm.generateId(CourseDocument.DATA_TYPE,request.getParameter("content_id")); 

if (action.equals("create"))
 {
	 labelForAction = "Add";
 }
 else if (action.equals("modify"))
 {
	Id contentId = new PkId( bbContainer, CourseDocument.DATA_TYPE, request.getParameter("content_id") );
	Content courseDoc = courseDocumentLoader.loadById( contentId );
	isTracked = courseDoc.getIsTracked();
	isAvailable = courseDoc.getIsAvailable();
	startDateCal = courseDoc.getStartDate();
  	endDateCal = courseDoc.getEndDate();
    title = courseDoc.getTitle();
	if(startDateCal!=null) startDate = startDateCal.getTime();
  	if(endDateCal!=null) endDate = endDateCal.getTime();
	labelForAction = "Modify";
	
 }
 else
 {	 
	 labelForAction = "";
	 return;
 }

%>
<bbNG:pageHeader >
<bbNG:breadcrumbBar isContent="true" >
  <bbNG:breadcrumb>Add Tweak</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="<%=thisPluginImageUrlPath %>" title="Add Tweak"></bbNG:pageTitleBar>	
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
String isAvailableChk0 = "";
String isAvailableChk1 = "";
String isTrackChk0 = "";
String isTrackChk1 = "";
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

<bbNG:form action="create_proc.jsp" method="post" NAME="addModify" ID="addModify" onSubmit="return validateForm(document.forms.addModify)">
	<bbNG:dataCollection showSubmitButtons="true">
	<input type=hidden name=content_id value="<%=request.getParameter("content_id")%>">
	<input type=hidden name=course_id value="<%=request.getParameter("course_id")%>">
	<input type=hidden name=action value="<%=action%>">
	<input type=hidden name=title value="<%=title%>">
	<bbNG:step title="Script Options">
		
		<bbNG:dataElement isRequired='true' label="Tweak Type">
		<bbNG:jsBlock>
		<script language="javascript" type="text/javascript">
			jQuery(function($) { 
				jQuery("#addModify input:submit").click(function(e){   
					if ($("#addModify li.required:first input:checked").length == 0) {
						alert("Please select Tweak type and press Add button");
						e.preventDefault();
					}
				});
			 <% 
			 	for (int i=0; i < tweakItems.size(); i++) { 
				  if (tweakItems.get(i)[3].equals("true")) { %>
				$("#<%=tweakItems.get(i)[7]%>").click(function(){$("#usage_instruction").text("<%=tweakItems.get(i)[5]%>").show();inlineFormatInstructions();});
 		  	 <%   } 
				} %>
				jQuery("fieldset.tweak_fieldset").parents("li").find(".label:contains(\"Tweak Type\")").css("float", "none").end().find(".field:first").css("width", "95%");
				var maxheight = 0;
				jQuery(".tweak_fieldset").each(function(){ if (jQuery(this).height() > maxheight) { maxheight = jQuery(this).height();} }).height(maxheight);
			});
			function inlineFormatInstructions() {
				jQuery("#usage_instruction").html(jQuery("#usage_instruction").html().replace(/&lt;br[\/]?&gt;/g, "<br/>").replace(/'/g, "\""));
			}
        </script>
        </bbNG:jsBlock>
  		<fieldset class="tweak_fieldset"  >
		 <span><strong>Structure</strong></span>
		 	<% for (int i=0; i < tweakItems.size(); i++) { 
			  if (tweakItems.get(i)[3].equals("true")) {
		 		if (tweakItems.get(i)[1].equals("Structure")){ %>
		 		<input type="radio"  name="tweak_script" id="<%=tweakItems.get(i)[7]%>" value="<%=tweakItems.get(i)[7]%>"><label for="<%=tweakItems.get(i)[7]%>" class="tweak_fieldset"><%=tweakItems.get(i)[0]%></label><br>
  		  <%    }
			  } 
			} %>
		</fieldset>
		<fieldset class="tweak_fieldset">
			  <span><strong>Presentation</strong></span>
			  <% for (int i=0; i < tweakItems.size(); i++) { 
				  if (tweakItems.get(i)[3].equals("true")) {
			 		if (tweakItems.get(i)[1].equals("Presentation")){ %>
			 		<input type="radio" name="tweak_script" id="<%=tweakItems.get(i)[7]%>" value="<%=tweakItems.get(i)[7]%>"><label for="<%=tweakItems.get(i)[7]%>" class="tweak_fieldset"><%=tweakItems.get(i)[0]%></label><br>
  		  <%    }
			  } 
			} %>
		</fieldset>
		<fieldset class="tweak_fieldset" >
		 	<span><strong>Learning Activities</strong></span>
		 	<% for (int i=0; i < tweakItems.size(); i++) { 
		 		if (tweakItems.get(i)[3].equals("true")) {
		 			if (tweakItems.get(i)[1].equals("Learning Activities")){ %>
		 			<input type="radio" name="tweak_script" id="<%=tweakItems.get(i)[7]%>" value="<%=tweakItems.get(i)[7]%>");"><label for="<%=tweakItems.get(i)[7]%>" class="tweak_fieldset"><%=tweakItems.get(i)[0]%></label><br>
  		  <%    }
			  } 
			} %>
		</fieldset>
		<fieldset class="tweak_fieldset">
			  <span><strong>Tools</strong></span>
			  <% for (int i=0; i < tweakItems.size(); i++) { 
				  if (tweakItems.get(i)[3].equals("true")) {
			 		if (tweakItems.get(i)[1].equals("Tools")){ %>
			 		<input type="radio" name="tweak_script" id="<%=tweakItems.get(i)[7]%>" value="<%=tweakItems.get(i)[7]%>"><label for="<%=tweakItems.get(i)[7]%>" class="tweak_fieldset"><%=tweakItems.get(i)[0]%></label><br>
  		  <%    }
			  } 
			} %>
		</fieldset>			
		</bbNG:dataElement> 
		 <bbNG:dataElement label="Usage Instructions">
		 	<div id="usage_instruction"></div>
		</bbNG:dataElement>
		<bbNG:dataElement>
		 	<input name="usage" id="usage" type="Hidden" />
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
			<bbNG:dateRangePicker baseFieldName="bbDateTimePicker" showTime="true"></bbNG:dateRangePicker>
		</bbNG:dataElement>
		
	</bbNG:step>
	
	<bbNG:stepSubmit 
    	title="Add Tweak"  
    	cancelUrl='<%=PlugInUtil.getEditableContentReturnURL(parentId,courseId)%>' >
    	<bbNG:stepSubmitButton label="Add" primary="true"/>
    </bbNG:stepSubmit>
	
	</bbNG:dataCollection>
</bbNG:form>

</bbNG:learningSystemPage>