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
				java.io.IOException,
				org.apache.commons.io.FileUtils"
				
	errorPage="/error.jsp"%>
	
<%@ taglib uri="/bbUI" prefix="bbUI"%>
<%@ taglib uri="/bbData" prefix="bbData"%>
<%@ taglib uri="/bbNG" prefix="bbNG"%>


<bbNG:genericPage authentication="Y"  ctxId="ctx" bodyClass='bbDefault' >
<%
if (!PlugInUtil.authorizeForSystemAdmin(request, response))
  return;

String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";

String JSfilePath = "/usr/local/blackboard/content/vi/bb_bb60/plugins/qut-tweakbb/webapp/jquery.tweakSetup.js";
String jsLocation ="";
String jsHelp ="";
String jsPattern ="";

%>
<bbNG:jsFile href="jquery.js"/>
<bbNG:jsFile href="jquery.tweakSetup.js"/>
<bbNG:jsFile href="jquery.tweakAdmin.js"/>


<bbNG:pageHeader>
<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >
<bbNG:breadcrumb href="config.jsp" >Tweak Properties</bbNG:breadcrumb>
<bbNG:breadcrumb>Backup, Restore and Preview the current package settings file</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Backup, Restore and Preview the current package settings file"></bbNG:pageTitleBar>	
</bbNG:pageHeader>
<bbNG:jsFile href="tweak_validation.js"/>
<form name="XMLForm"   method="post" action="manageXML_save.jsp"  >
<bbNG:dataCollection showSubmitButtons="false">
<%-- Preview link --%>
<bbNG:step title="Preview">
	<bbUI:caretList>
	<bbUI:caret title="Preview"
				href="tweak_packages_preview.jsp">
				Click to preview the current package settings file.
	</bbUI:caret>
	</bbUI:caretList>
</bbNG:step>

<%-- import packages --%>
<bbNG:step title="Backup settings file">
	<bbUI:caretList>
	<bbUI:caret title="Backup settings file"
				href="tweak_packages.xml">
				Right click link and 'save as' to download settings file.
	</bbUI:caret>
	</bbUI:caretList>
</bbNG:step>
<%-- import packages --%>
<bbNG:step title="Restore settings file">
	<bbUI:caretList>
	<bbUI:caret title="Restore settings file"
				href="manageXML_proc.jsp">
				Click to restore package settings from a backup settings file.
	</bbUI:caret>
	</bbUI:caretList>
</bbNG:step>

</bbNG:dataCollection>
</form>
</bbNG:genericPage>
