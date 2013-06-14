<%@ include file="/includes/doctype.jspf" %> 
<%@ page import="java.util.*,
                blackboard.platform.plugin.*
                "
				
	errorPage="/error.jsp"%>
	
<%@ taglib uri="/bbNG" prefix="bbNG"%>
<%@ taglib uri="/bbUI" prefix="bbUI"%>



<bbNG:genericPage authentication="Y"  ctxId="ctx" bodyClass='bbDefault' >
<%
if (!PlugInUtil.authorizeForSystemAdmin(request, response))
  return;

String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";
%>
<bbNG:pageHeader>
<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >
<bbNG:breadcrumb>Tweak Properties</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Tweak Properties"></bbNG:pageTitleBar>	
</bbNG:pageHeader>


<bbUI:caretList>
	<bbUI:caret title="Manage Tweak Packages"
				href="../admin/manage.jsp">
				Modify and remove Tweak Packages
	</bbUI:caret>
	<bbUI:caret title="Add Tweak Package"
				href="../admin/add_tweak.jsp">
				Add a Tweak Package
	</bbUI:caret>
	<bbUI:caret title="Set location"
				href="../admin/set_path.jsp">
				Set path to Tweak Packages
	</bbUI:caret>
	
	<bbUI:caret title="Backup/Restore Package Settings"
				href="../admin/manageXML.jsp">
				Backup, Restore and Preview the current package settings file.
	</bbUI:caret>
</bbUI:caretList>
<bbNG:okButton  url="javascript:history.go(-1)" />
</bbNG:genericPage>
