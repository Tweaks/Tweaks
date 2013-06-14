<%@ include file="/includes/doctype.jspf" %> 
<%@ page import="java.util.*,
                blackboard.platform.plugin.*,
				java.io.File,
				java.io.IOException,
				org.apache.commons.io.FileUtils
                "
				
	errorPage="/error.jsp"%>
	
<%@ taglib uri="/bbNG" prefix="bbNG"%>
<bbNG:genericPage authentication="Y"  ctxId="ctx" bodyClass='bbDefault' >
<%
if (!PlugInUtil.authorizeForSystemAdmin(request, response))
  return;

String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";

%>

<bbNG:pageHeader>
<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >
<bbNG:breadcrumb href="config.jsp" >Tweak Properties</bbNG:breadcrumb>
<bbNG:breadcrumb>Tweak Package Preview</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Tweak Properties"></bbNG:pageTitleBar>	
</bbNG:pageHeader>
<bbNG:jsFile href="XMLDisplay.js"/>
<bbNG:cssBlock>
	<link type="text/css" href="../styles/XMLDisplay.css" rel="stylesheet">
</bbNG:cssBlock>
<div id="XMLHolder"> </div>
<bbNG:jsBlock>
<script>LoadXML('XMLHolder','tweak_packages.xml');</script>

</bbNG:jsBlock>

<bbNG:okButton  url="javascript:history.go(-1)" />
</bbNG:genericPage>


