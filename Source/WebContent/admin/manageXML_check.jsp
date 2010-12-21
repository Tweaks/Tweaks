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
<%
try
{
//String xmlString = request.getParameter("xml_source");
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
DocumentBuilder builder = factory.newDocumentBuilder();
builder.parse(new InputSource(new StringReader(xmlString)));
//saveSettingFile = false;
}
catch (Exception ioe)
{
	saveSettingFile = false;
	//out.print("Your code is not valid XML.Please go back and try again.");
	
}
%>
