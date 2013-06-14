<%@ include file="/includes/doctype.jspf" %>  
<%@	page language="java"            
                import="java.text.*,
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
				java.io.*,
				javax.xml.transform.*,
				javax.xml.transform.dom.DOMSource,
				javax.xml.transform.stream.StreamResult,
				org.xml.sax.SAXException"
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
//String BrowserString= "";

DocumentBuilderFactory dbf2 = DocumentBuilderFactory.newInstance();
DocumentBuilder db2 = dbf2.newDocumentBuilder();
Document doc = db2.parse(configFilePath);

Element packages = doc.getDocumentElement();
Element packageT = doc.createElement("package");
packageT.setAttribute("id",request.getParameter("id"));

Element title = doc.createElement("title");
title.setTextContent(request.getParameter("title"));
packageT.appendChild(title);

Element type = doc.createElement("type");
type.setTextContent(request.getParameter("type"));
packageT.appendChild(type);

Element tweak_hide = doc.createElement("visible");
tweak_hide.setTextContent(request.getParameter("tweak_hide"));
packageT.appendChild(tweak_hide);

Element tweak_avail = doc.createElement("available");
tweak_avail.setTextContent(request.getParameter("tweak_avail"));
packageT.appendChild(tweak_avail);



Element description = doc.createElement("description");
if (request.getParameter("description").length() != 0) {
	description.setTextContent(request.getParameter("description"));
} else {description.setTextContent("Browser(s) tested:");}
packageT.appendChild(description);

Element instructions = doc.createElement("instruction");
InsructionRep = request.getParameter("instructions").trim();
InsructionRep = InsructionRep.replaceAll("\"","\'");
InsructionRep = InsructionRep.replaceAll("\n","");
instructions.setTextContent(InsructionRep);
packageT.appendChild(instructions);
Element embed = doc.createElement("embed");
CDATASection cdata = doc.createCDATASection(request.getParameter("code"));
embed.appendChild(cdata);

packageT.appendChild(embed);
packages.appendChild(packageT);

Transformer transformer = TransformerFactory.newInstance().newTransformer(); 
transformer.setOutputProperty(OutputKeys.INDENT, "yes");

//initialize StreamResult with File object to save to file 
StreamResult result = new StreamResult(new StringWriter()); 
DOMSource source = new DOMSource(doc); 
transformer.transform(source, new StreamResult(new FileOutputStream(configFilePath)));


%>


<bbNG:pageHeader>
<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >
<bbNG:breadcrumb href="config.jsp" >Tweak Properties</bbNG:breadcrumb>
<bbNG:breadcrumb>Add Tweak Package</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Add Tweak Package"></bbNG:pageTitleBar>	
</bbNG:pageHeader>

 <bbNG:receipt type="SUCCESS" title="Tweak Added" recallUrl="manage.jsp" iconUrl="../images/tweakbb-icon2_big.gif">
 
 Tweak Package (Type:<strong> <%=request.getParameter("title")%></strong>) Added successfully to the system.
 <br>
 <EM>With following parameters:</EM><br>
 <hr>
<TABLE BORDER="1">
<TR>
	<TD>Title</TD>
	<TD><%=request.getParameter("title")%></TD>
</TR>
<TR>
	<TD>ID</TD>
	<TD><%=request.getParameter("id")%></TD>
</TR>
<TR>
	<TD>Visible</TD>
	<TD><%=request.getParameter("tweak_hide")%></TD>
</TR>
<TR>
	<TD>Available</TD>
	<TD><%=request.getParameter("tweak_avail")%></TD>
</TR>
<TR>
	<TD>Instructions</TD>
	<TD><%=request.getParameter("instructions")%></TD>
</TR>
<TR>
	<TD>Browser Info</TD>
	<TD><%=request.getParameter("description")%></TD>
</TR>
</TABLE>
 
</bbNG:receipt>


</bbNG:genericPage>