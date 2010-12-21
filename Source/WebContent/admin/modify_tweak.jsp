<%@ page language="java" import="java.util.*,
                blackboard.platform.plugin.*,
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
				blackboard.platform.*,
              	au.edu.qut.b2.data.custom.*,
				au.edu.qut.b2.data.utilities.*,
				au.edu.qut.b2.tweak.TweakItemComparator,
				javax.xml.parsers.DocumentBuilderFactory,
				javax.xml.parsers.DocumentBuilder,
				org.w3c.dom.*,
				java.io.*,
				javax.xml.transform.*,
				javax.xml.transform.dom.DOMSource,
				javax.xml.transform.stream.StreamResult,
				org.xml.sax.SAXException"
				
                errorPage="/error.jsp"%>
	
<%@ taglib uri="/bbUI" prefix="bbUI"%>
<%@ taglib uri="/bbData" prefix="bbData"%>
<%@ taglib uri="/bbNG" prefix="bbNG"%>
<bbNG:genericPage authentication="Y"  ctxId="ctx" bodyClass='bbDefault' >
<bbNG:cssBlock>
	<link type="text/css" href="/styles/adminTweak.css" rel="stylesheet">
</bbNG:cssBlock>
<%
if (!PlugInUtil.authorizeForSystemAdmin(request, response))
  return;

String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";
%>
<%@ include file ="/files/XMLData.jsp"%>
 
<bbNG:pageHeader>
<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >
<bbNG:breadcrumb href="config.jsp" >Tweak Properties</bbNG:breadcrumb>
<bbNG:breadcrumb href="manage.jsp" >Manage Tweak Packages</bbNG:breadcrumb>
<bbNG:breadcrumb>Modify Tweak Package</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Modify Tweak Package"></bbNG:pageTitleBar>	
</bbNG:pageHeader>
<bbNG:jsFile href="tweak_validation.js"/>
<%
String thisTweakTitle = "";
String thisTweakType = "";
String thisTweakVisible = "";
String thisTweakAvailable = "";
String thisTweakBrowser = "";
String thisTweakInstruction = "";
String thisTweakEmbed = "";

String thisTweakID = request.getParameter("TweakID");

for (int i=0; i < tweakItems.size(); i++) { 
 	if (tweakItems.get(i)[7].equals(thisTweakID)){ 
 		
 		//out.print("hooray.. I have found it" + tweakItems.get(i)[7] + "<br>");
 		thisTweakTitle = tweakItems.get(i)[0];
 		thisTweakType = tweakItems.get(i)[1];
 		thisTweakVisible = tweakItems.get(i)[2];
 		thisTweakAvailable = tweakItems.get(i)[3];
 		thisTweakBrowser = tweakItems.get(i)[4];
 		thisTweakInstruction = tweakItems.get(i)[5];
 		thisTweakEmbed = tweakItems.get(i)[6];
 		
	}
 	else { 
 		//out.print("Tweak Package has not been found with this ID ");
 		
 	
 	}
} 

%>
<form action="modifyTweak_proc.jsp" method="post" name="modifyTweakPackage" id="modifyTweakPackage" onsubmit="javascript:return validateTweak(this);">
	<bbNG:dataCollection showSubmitButtons="true"> 
	<input type=hidden name=content_id value="<%=request.getParameter("content_id")%>">
	<bbNG:step title="Enter the Title of the Tweak Package" >
  		<bbNG:dataElement label="Title">
			<input type="text" name="title" CLASS="usagetitle" value="<%=thisTweakTitle%>">
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:step title="Enter the ID of the Tweak Package">
  		<bbNG:dataElement label="ID (read only)">
			<input type="text" name="id" CLASS="usagetitle" value="<%=thisTweakID%>" READONLY="yes">
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:step title="Enter the Instructions for Use">
  		<bbNG:dataElement label="Instructions">
			<textarea ROWS="4" COLS="67" WRAP="soft" name="instructions" CLASS="usagetext"><%=thisTweakInstruction%></textarea><br>
            Use &lt;br/&gt; for line breaks. All other HTML will display to user for instructions.<br/>
            Use single quote characters instead of double quote. (all single quotes will display as double quotes in instructions)
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:step title="Enter the Embed Code">
  		<bbNG:dataElement label="Code">
  			<textarea ROWS="4" COLS="67" WRAP="soft" name="code" CLASS="usagetext"><%=thisTweakEmbed%></textarea><br>
			example:<br /> 
			js: 'scripts/hider.js'<br/><br/>
			For multiple js, css and image files, separate with ",":<br/>
			js: 'scripts/hider.js', 'scripts/file2.js',<br/>
			css: 'styles/file.css',<br/>
	  		image: 'images/image.jpg'<br />
		</bbNG:dataElement>
	</bbNG:step>
	
	<bbNG:step title="Select Package Type">
  		<bbNG:dataElement label="Type">
  			<select name="type" size="1">
				<option <%if(thisTweakType.equals("Structure")){%>SELECTED <%} %> >Structure</option>
				<option <%if(thisTweakType.equals("Learning Activities")){%>SELECTED <%} %> >Learning Activities</option>
				<option <%if(thisTweakType.equals("Tools")){%>SELECTED <%} %> >Tools</option>
				<option <%if(thisTweakType.equals("Presentation")){%>SELECTED <%} %> >Presentation</option>
			</select>
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:step title="Availability Option">
		<bbNG:dataElement label="Make the package available">
		<input type="radio" name="tweak_avail" id="tweak_avail_yes" value="true" <%if(thisTweakAvailable.equals("true")){%>CHECKED <%} %>><label for="tweak_avail" class="tweak_fieldset">YES</label>
		<input type="radio" name="tweak_avail" id="tweak_avail_no" value="false" <%if(thisTweakAvailable.equals("false")){%>CHECKED <%} %>><label for="tweak_avail" class="tweak_fieldset">NO</label>
		<!--- this part just pass hidden value for View Option.. currently not used --->
		<input type="hidden" name="tweak_hide" id="tweak_hide" value="true">
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:step title="Browsers infomation">
		<bbNG:dataElement label="Provide list of browsers <br> including version <br> have been tested with this package">
			<textarea ROWS="4" COLS="67" WRAP="soft" name="description" id="description" CLASS="usagetext"><%=thisTweakBrowser%> </textarea>
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:stepSubmit cancelUrl="manage.jsp"/>
	</bbNG:dataCollection>
</form>


</bbNG:genericPage>
