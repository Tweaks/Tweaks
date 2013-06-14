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
				org.xml.sax.SAXException,
				javax.xml.xpath.XPath,
				javax.xml.xpath.XPathConstants,
				javax.xml.xpath.XPathFactory,
				javax.xml.parsers.DocumentBuilderFactory,
				org.xml.sax.InputSource"
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
String thisTweakID = "";
String avail_value ="false";
if ((request.getParameter("TweakID") != null)||(request.getParameter("TweakID") != "")) {
	 thisTweakID = request.getParameter("TweakID");
} 

if ((request.getParameter("avail_value") != null)||(request.getParameter("avail_value") != "")) {
	if (request.getParameter("avail_value").equals("1")){
		avail_value = "true";
	} //else {avail_value="false";}
	 
} 

DocumentBuilderFactory dbf2 = DocumentBuilderFactory.newInstance();
DocumentBuilder db2 = dbf2.newDocumentBuilder();
Document doc = db2.parse(configFilePath);
NodeList nTweak= doc.getElementsByTagName("package");
int totalPackages =nTweak.getLength();

for (int s = 0; s < totalPackages; s++){
	Node tableNode = nTweak.item(s);
	if (tableNode.getAttributes().getNamedItem("id").getNodeValue().equals(thisTweakID)){
		NodeList childList = tableNode.getChildNodes();
		int childLength = tableNode.getChildNodes().getLength();
		for (int i=0; i < childLength; i++){
			Node packageChild = childList.item(i);
			String childName= packageChild.getNodeName();
			if (childName=="available"){
				packageChild.setTextContent(avail_value);
			}
		}
	}
}
doc.normalize();
Transformer transformer = TransformerFactory.newInstance().newTransformer(); 
transformer.setOutputProperty(OutputKeys.INDENT, "yes");
DOMSource source = new DOMSource(doc); 
transformer.transform(source, new StreamResult(new FileOutputStream(configFilePath)));

//out.print("tweak id  " +  thisTweakID +"<hr>");
//out.print("avail_value  " +  avail_value +"<hr>");
%>
<bbNG:pageHeader>
<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >
<bbNG:breadcrumb href="config.jsp" >Tweak Properties</bbNG:breadcrumb>
<bbNG:breadcrumb>Tweak Package Availability</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Availability Updated"></bbNG:pageTitleBar>	
</bbNG:pageHeader>
<bbNG:receipt type="SUCCESS" title="Tweak Package Updated" recallUrl="manage.jsp" iconUrl="../images/tweakbb-icon2_big.gif">
 Availability of Tweak Package (Type:<strong><%=thisTweakID%> </strong>) has been updated successfully.
</bbNG:receipt>

</bbNG:genericPage>