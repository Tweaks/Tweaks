<%@ include file="/includes/doctype.jspf" %> 
<%@ page import="java.text.*,
				java.util.regex.*,
				blackboard.base.FormattedText,
				blackboard.base.*,
				blackboard.data.*,
				blackboard.data.user.*,
				blackboard.data.content.*,
				blackboard.data.course.*,
				blackboard.db.*,
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
				java.io.*,
				java.sql.*,
				java.util.*,
				javax.xml.transform.*,
				javax.xml.transform.dom.DOMSource,
				javax.xml.transform.stream.StreamResult,
				org.apache.commons.io.FileUtils,
				org.xml.sax.SAXException,
				au.edu.qut.b2.tweak.TweakItemComparator,
				blackboard.platform.persistence.PersistenceServiceFactory"

	errorPage="/error.jsp"%>
	
<%@ taglib uri="/bbNG" prefix="bbNG"%>

<bbNG:genericPage authentication="Y"  ctxId="ctx" bodyClass='bbDefault' >
<%
if (!PlugInUtil.authorizeForSystemAdmin(request, response))
  return;

String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";
%>
<%@ include file="/admin/genConfigPath.jsp"%>
<%@ include file="/files/XMLData.jsp"%>
<bbNG:jsFile href="jquery.js"/>
<bbNG:jsFile href="jquery.tweakSetup.js"/>
<bbNG:jsFile href="jquery.tweakAdmin.js"/>

<bbNG:pageHeader>
<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >
<bbNG:breadcrumb href="config.jsp" >Tweak Properties</bbNG:breadcrumb>
<bbNG:breadcrumb>Manage Tweak Packages</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Manage Tweak Packages"></bbNG:pageTitleBar>	
</bbNG:pageHeader>


<form name="manageTweak">
<table>
<tr style="background: #dadada;">
	<td><strong>Tweak Package Name</strong></td>
	<td><strong>Tweak Package Type</strong></td>
	<td><strong>Availability</strong></td>
	<!--  <td><strong>Display Option</strong></td> -->
	<td><strong>Modify</strong></td>
	<td><strong>Remove</strong></td>
</tr>
<% for (int i=0; i < tweakItems.size(); i++) {%> 
	<tr>
	<td><strong><%=tweakItems.get(i)[0]%></strong></td>
	<td><strong><%=tweakItems.get(i)[1]%></strong></td>
	<td>
		<select name="tweak_avail" class="tweak_avail" size="1" id="<%=tweakItems.get(i)[7]%>">
			<option value="1" <%if(tweakItems.get(i)[3].equals("true")){%>SELECTED <%} %> >Available</option>
			<option value="0" <%if(tweakItems.get(i)[3].equals("false")){%>SELECTED <%} %> >Inactive</option>
			
		</select>
	</td>
	<!--
	<td>
		<select name="tweak_disp" class="tweak_disp" size="1" id="<%=tweakItems.get(i)[7]%>">
			<option value="1" <%if(tweakItems.get(i)[2].equals("true")){%>SELECTED <%} %> >Available</option>
			<option value="0" <%if(tweakItems.get(i)[2].equals("false")){%>SELECTED <%} %> >Inactive</option>
		</select>
	</td>
	-->
	<td>
		<% String modTweakID  = "modify_tweak.jsp?TweakID="+tweakItems.get(i)[7];%>
		<bbNG:button id="Modify" label="Modify"  url="<%=modTweakID%>" />
	</td>
	<td>
		<% String delTweakID  = "javascript:removeTweak('"+tweakItems.get(i)[7]+"')";%> 
		<bbNG:button id="delete" label="Delete"  url="<%=delTweakID%>" />
	</td> 		
  	</tr>	  
<% } %>
</table>
</form>

<bbNG:okButton  url="config.jsp" />

</bbNG:genericPage>