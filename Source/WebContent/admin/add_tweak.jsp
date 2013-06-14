<%@ include file="/includes/doctype.jspf" %> 
<%@ page import="java.util.*,
                blackboard.platform.plugin.*,
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
				javax.xml.parsers.DocumentBuilderFactory,
				javax.xml.parsers.DocumentBuilder,
				org.w3c.dom.*,
				au.edu.qut.b2.tweak.TweakItemComparator,
				java.io.*;"
				
	errorPage="/error.jsp"%>
	
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
<%@ include file="/admin/genConfigPath.jsp"%>
<%@ include file="/files/XMLData.jsp"%>

<bbNG:pageHeader>
<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >
<bbNG:breadcrumb href="config.jsp" >Tweak Properties</bbNG:breadcrumb>>
<bbNG:breadcrumb>Add Tweak Package</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Add Tweak Package"></bbNG:pageTitleBar>	
</bbNG:pageHeader>

<bbNG:jsFile href="tweak_validation.js"/>
<bbNG:jsFile href="livevalidation_standalone.js"/>


<form action="addTweak_proc.jsp" method="post" name="addTweakPackage" onsubmit="javascript:return validateTweak(this);">
	<bbNG:dataCollection showSubmitButtons="true"> 
	<bbNG:step title="Enter the Title of the Tweak Package">
  		<bbNG:dataElement label="Title">
			<input type="text" name="title" CLASS="usagetitle" id="title">
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:step title="Enter the ID of the Tweak Package">
  		 <bbNG:dataElement label="ID"> 
			  <p>This will check existing ID's automatically: 
			      <input type="text" id="id" name="id" />
			      <bbNG:jsBlock>
				  <script type="text/javascript">
		            var id = new LiveValidation('id');
		            id.add(Validate.Exclusion, { failureMessage: ' this ID already exists', within: [ <%=tweakIDList%> ] } );
		          </script>  
		          </bbNG:jsBlock>
			  </p>
		</bbNG:dataElement> 
	</bbNG:step>
	<bbNG:step title="Enter the Instructions for Use">
  		<bbNG:dataElement label="Instructions">
			<textarea ROWS="4" COLS="67" WRAP="soft" name="instructions" CLASS="usagetext"></textarea><br>
      <p>Notes when creating Instructions:</p>
      <p>-  Use valid HTML markup.</p>
      <p>-  To give copy/pastable HTML examples, use escaped text.  A website like <a href="http://www.htmlescape.net/htmlescape_tool.html">htmlescape.net</a> may come in handy.</p>
      <p>-  CSS can be added to styles/tweakAdmin.css (inline works too)</p>
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:step title="Enter the Embed Code" >
  		<bbNG:dataElement label="Code">
  			<textarea ROWS="4" COLS="67" WRAP="soft" name="code" CLASS="usagetext"></textarea><br>
			example:<br /> 
			js: 'scripts/hider.js'<br/><br/>
			For multiple js, css and image files, separate with ",":<br/>
			js: ['scripts/hider.js', 'scripts/file2.js'],<br/>
			css: 'styles/file.css',<br/>
	  		image: 'images/image.jpg'<br />
		</bbNG:dataElement>
	</bbNG:step>
	
	<bbNG:step title="Select Package Type" >
  		<bbNG:dataElement label="Type">
  			<select name="type" size="1">
				<option>Structure</option>
				<option>Learning Activities</option>
				<option>Tools</option>
				<option>Presentation</option>
			</select>
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:step title="Availability Option" >
		<bbNG:dataElement label="Make the package available">
		<input type="radio" name="tweak_avail" id="tweak_avail" value="true"><label for="tweak_avail" class="tweak_fieldset">YES</label>
		<input type="radio" name="tweak_avail" id="tweak_avail" value="false" CHECKED><label for="tweak_avail" class="tweak_fieldset">NO</label>
		<!--- this part just pass hidden value for View Option.. currently not used --->
		<input type="hidden" name="tweak_hide" id="tweak_hide" value="true">
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:step title="Browsers infomation">
		<bbNG:dataElement label="Provide list of browsers <br> including version <br> have been tested with this package">
			<textarea ROWS="4" COLS="67" WRAP="soft" name="description" id="description" CLASS="usagetext"></textarea>
		</bbNG:dataElement>
	</bbNG:step>
	<bbNG:stepSubmit cancelUrl="config.jsp" />
	</bbNG:dataCollection>
</form>
</bbNG:genericPage>