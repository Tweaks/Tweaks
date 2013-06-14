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
				org.xml.sax.SAXException,
				au.edu.qut.b2.tweak.TweakItemComparator,
				blackboard.platform.persistence.PersistenceServiceFactory,
				java.io.File,
				java.io.IOException"
				
	errorPage="/error.jsp"%>
	
<%@ taglib uri="/bbNG" prefix="bbNG"%>


<bbNG:genericPage authentication="Y"  ctxId="ctx" bodyClass='bbDefault' >
<%
if (!PlugInUtil.authorizeForSystemAdmin(request, response))
  return;

String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";

// Check function of file
%>
<bbNG:pageHeader>
<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >
<bbNG:breadcrumb href="config.jsp" >Tweak Properties</bbNG:breadcrumb>>
<bbNG:breadcrumb>Backup, Restore and Preview the current package settings file</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Backup, Restore and Preview the current package settings file."></bbNG:pageTitleBar>	
</bbNG:pageHeader>
<bbNG:jsFile href="jquery.js"/>
<bbNG:jsBlock>
	<script language="javascript" type="text/javascript">
		jQuery(function($) {
			jQuery("form input:submit").click(function(e){ jQuery("form textarea").val(j("form textarea").val().replace("&#13;", "")); });
		});
	</script>
</bbNG:jsBlock>
<form name="XMLForm"   method="post" action="manageXML_save.jsp"  >
<bbNG:dataCollection showSubmitButtons="true">
<bbNG:step title="Restore">
	Copy and paste the contents of the settings file you wish to restore to the text area below:<br>
	<textarea NAME="xml_source" ID="xml_source" COLS="200" ROWS="30"></textarea>
</bbNG:step>
<bbNG:stepSubmit />
</bbNG:dataCollection>
</form>
</bbNG:genericPage>

