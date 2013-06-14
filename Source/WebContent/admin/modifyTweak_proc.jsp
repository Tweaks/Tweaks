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
				au.edu.qut.b2.tweak.TweakItemComparator,
				org.xml.sax.InputSource"
		pageEncoding="UTF-8"
		errorPage="/error.jsp"
	
%>



<%@ taglib prefix="bbNG" uri="/bbNG" %>

<%@ include file="/admin/genConfigPath.jsp"%>

<bbNG:genericPage authentication="Y"  ctxId="ctx" bodyClass='bbDefault' >

<%
if (!PlugInUtil.authorizeForSystemAdmin(request, response))
  return;

String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";
String InsructionRep ="";

DocumentBuilderFactory dbf2 = DocumentBuilderFactory.newInstance();
DocumentBuilder db2 = dbf2.newDocumentBuilder();
Document doc = db2.parse(configFilePath);
int intToMod = 0;


//out.print("<br>  something happening...");
NodeList nTweak= doc.getElementsByTagName("package");
int totalPackages =nTweak.getLength();
for (int s = 0; s < totalPackages; s++){
	Node tableNode = nTweak.item(s);
	if (tableNode.getAttributes().getNamedItem("id").getNodeValue().equals(request.getParameter("id"))){
		intToMod = s;
		//out.print( "<br> I have found " + request.getParameter("id") + "<br> intToMod =" + intToMod);
		NodeList childList = tableNode.getChildNodes();
		int childLength = tableNode.getChildNodes().getLength();
		for (int i=0; i < childLength; i++){
			Node packageChild = childList.item(i);
			String childName= packageChild.getNodeName();
			if (childName=="title"){
				//out.println("child name : " + childName + "..." + packageChild.getNodeValue() + "<br>");
				packageChild.setTextContent(request.getParameter("title"));
			}
			if (childName=="type"){
				//out.println("child name : " + childName + "..." + packageChild.getNodeValue() + "<br>");
				packageChild.setTextContent(request.getParameter("type"));
			}
			if (childName=="visible"){
				//out.println("child name : " + childName + "..." + packageChild.getNodeValue() + "<br>");
				packageChild.setTextContent(request.getParameter("tweak_hide"));
			}
			if (childName=="available"){
				//out.println("child name : " + childName + "..." + packageChild.getNodeValue() + "<br>");
				packageChild.setTextContent(request.getParameter("tweak_avail"));
			}
			
			if (childName=="description"){
				//out.println("child name : " + childName + "..." + packageChild.getNodeValue() + "<br>");
				if (request.getParameter("description").length() != 0) {
					packageChild.setTextContent(request.getParameter("description"));
				} else {packageChild.setTextContent("Browser(s) tested:");}
				//packageChild.setTextContent(request.getParameter("description"));
			}
			if (childName=="instruction"){
				//out.println("child name : " + childName + "..." + packageChild.getNodeValue() + "<br>");
        
        InsructionRep = request.getParameter("instructions");
        InsructionRep = InsructionRep.replaceAll("\\r\\n", "");
        InsructionRep = InsructionRep.replaceAll("\\n", "");
        InsructionRep = InsructionRep.replaceAll("\"","\'");
				packageChild.setTextContent(InsructionRep);
        
			}
			if (childName=="embed"){
					intToMod =s;
			}	
				
		}
		CDATASection cdata = doc.createCDATASection(request.getParameter("code"));
		Element tw_element =(Element)doc.getElementsByTagName("embed").item(intToMod);
		tw_element.replaceChild(cdata,tw_element.getFirstChild());
		//delete Embed code node (CData)
		//out.print ("mod integer is :" + intToMod + "<hr>");
		
		//Element tw_element =(Element)doc.getElementsByTagName("embed").item(intToMod);
		//tw_element.getParentNode().removeChild(tw_element);
		
		
		// and create a new CData node with the same name
		
		// Element embed_new = doc.createElement("embed");
		//CDATASection cdata = doc.createCDATASection(request.getParameter("code"));
		//embed_new.appendChild(cdata);
		//Node parentForEmabed = nTweak.item(intToMod);
		//parentForEmabed.appendChild(embed_new); 
	}
}
Transformer transformer = TransformerFactory.newInstance().newTransformer(); 
transformer.setOutputProperty(OutputKeys.INDENT, "yes");
//initialize StreamResult with File object to save to file 
//treamResult result = new StreamResult(new StringWriter()); 
DOMSource source = new DOMSource(doc); 
transformer.transform(source, new StreamResult(new FileOutputStream(configFilePath)));
%>

<bbNG:pageHeader>
<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >
<bbNG:breadcrumb href="config.jsp" >Tweak Properties</bbNG:breadcrumb>
<bbNG:breadcrumb href="manage.jsp" >Manage Tweak Packages</bbNG:breadcrumb>
<bbNG:breadcrumb>Modify Tweak Package</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Modify Tweak Package"></bbNG:pageTitleBar>	
</bbNG:pageHeader>

 <bbNG:receipt type="SUCCESS" title="Tweak Updated" recallUrl="manage.jsp" iconUrl="../images/tweakbb-icon2_big.gif">
 
 Tweak Package (Type:<strong> <%=request.getParameter("title")%></strong>) has been updated successfully.
 <br>
 <!-- 
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
</TABLE> 
-->
 
</bbNG:receipt><br>

</bbNG:genericPage>
