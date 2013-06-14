<%@ include file="/includes/doctype.jspf" %> 
<%@	page language="java"            
                import="java.text.*,
				java.util.*,
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
				org.w3c.dom.Document,
				org.w3c.dom.NodeList,
				org.w3c.dom.Node,
				org.w3c.dom.Element,
				org.apache.xerces.parsers.DOMParser,
				java.io.*,
				java.io.File,
				java.io.IOException,
				java.io.FileWriter,
				org.apache.commons.io.FileUtils,
				javax.servlet.http.HttpServletRequest,
				javax.servlet.ServletInputStream,
				org.xml.sax.InputSource,
				javax.xml.transform.*,
				java.text.DateFormat,
				java.util.Date,
				java.util.Calendar,
				java.text.SimpleDateFormat,
				javax.xml.transform.dom.DOMSource,
				javax.xml.transform.stream.StreamResult"
		pageEncoding="UTF-8"
		errorPage="/error.jsp"
	
%>

<%@ taglib uri="/bbNG" prefix="bbNG"%>
<%@ include file="/admin/genConfigPath.jsp"%>

<bbNG:genericPage authentication="Y"  ctxId="ctx" bodyClass='bbDefault' >
<%
if (!PlugInUtil.authorizeForSystemAdmin(request, response))
  return;

String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";
String InsructionRep ="";
Date today = Calendar.getInstance().getTime();
SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd-hh.mm.ss");
String folderName = formatter.format(today);
String backupConfigFilePath = b2AbsoluteFilePath("/config/tweak_packages_backup"  + folderName + ".xml");

//create copy just in case called   tweak_packages_backup.xml
File source = new File(configFilePath);
File target = new File(backupConfigFilePath);
File targetDir = new File(System.getProperty("java.io.tmpdir"));
try
{
// Using FileUtils.copyFile() method to copy a file.
 //System.out.println("Copying " + source + " file to " + target);
FileUtils.copyFile(source, target);

// To copy a file to a specified folder we can use the
// FileUtils.copyFileToDirectory() method.
//System.out.println("Copying " + source + " file to " + targetDir);
FileUtils.copyFileToDirectory(source, targetDir);
} catch (IOException e)
{
// Errors will be reported here if any error occures during copying
// the file
e.printStackTrace();
 }
String xmlString = request.getParameter("xml_source");
boolean saveSettingFile = true;

//checking if file is in right format - valid XML
%>
<%@ include file="manageXML_check.jsp"%>

<%
//saving file

if (saveSettingFile){
try
{
String thisFile = new String(configFilePath);
OutputStreamWriter oos = new OutputStreamWriter (new FileOutputStream(thisFile));
oos.write (xmlString);
oos.close();
oos = null;
thisFile=null;
}
catch (IOException ioe)
{
System.out.println("IO error: " + ioe);
}

%>
<bbNG:pageHeader>
<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >
<bbNG:breadcrumb href="config.jsp" >Tweak Properties</bbNG:breadcrumb>>
<bbNG:breadcrumb>Backup, Restore and Preview the current package settings file</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Backup, Restore and Preview the current package settings file"></bbNG:pageTitleBar>	
</bbNG:pageHeader>

 <bbNG:receipt type="SUCCESS" title="Tweak Settings file Saved" recallUrl="manageXML.jsp" iconUrl="../images/tweakbb-icon2_big.gif">
 
 Tweak Settings File  has been successfully uploaded  to the system.

 
</bbNG:receipt>
<% } else { out.print("Your code is not valid XML.Please go back and try again.");}%>

</bbNG:genericPage>
