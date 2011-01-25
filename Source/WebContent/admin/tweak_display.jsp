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
<%@ taglib uri="/bbUI" prefix="bbUI"%>
<%@ taglib uri="/bbData" prefix="bbData"%>
<%@ include file="/admin/genConfigPath.jsp"%>

<bbData:context id="ctx">

<%
if (!PlugInUtil.authorizeForSystemAdmin(request, response))
  return;

String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";
String thisTweakID = "";
String disp_value ="false";
if ((request.getParameter("TweakID") != null)||(request.getParameter("TweakID") != "")) {
	 thisTweakID = request.getParameter("TweakID");
} 

if ((request.getParameter("disp_value") != null)||(request.getParameter("disp_value") != "")) {
	if (request.getParameter("disp_value").equals("1")){
		disp_value = "true";
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
			if (childName=="visible"){
				packageChild.setTextContent(disp_value);
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
<bbUI:docTemplate title="Tweak Package Display Option" >
<bbUI:breadcrumbBar handle="admin_plugin_manage">
<bbUI:breadcrumb href="../admin/config.jsp">Tweak Properties</bbUI:breadcrumb>
<bbUI:breadcrumb>Tweak Package Display Option</bbUI:breadcrumb>
</bbUI:breadcrumbBar>
<bbUI:titleBar iconUrl="../images/tweakbb-icon2_big.gif">Display Option Updated</bbUI:titleBar>
 <bbUI:receipt type="SUCCESS" title="Tweak Package Updated" recallUrl="manage.jsp">
 
Display Option of Tweak Package (Type:<strong><%=thisTweakID%></strong>) has been updated successfully.
 <br>
 

</bbUI:receipt><br>
</bbUI:docTemplate>

</bbData:context>