<%@ include file="/includes/doctype.jspf" %> 
<%@	page language="java"            
                import="java.util.*,
				java.util.regex.*,
				java.io.*,
				blackboard.data.*,
				blackboard.data.user.*,
				blackboard.data.course.*,
				blackboard.persist.*,
				blackboard.persist.user.*,
				blackboard.persist.course.*,
				blackboard.platform.plugin.*,
				blackboard.platform.*"
		pageEncoding="UTF-8"
	
%>

<%@ taglib uri="/bbNG" prefix="bbNG"%>

<%
if (!PlugInUtil.authorizeForCourse(request, response))
  return;

String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
String thisPluginImageUrlPath = thisPluginUriStem + "images/becareful.png";
%>

<bbNG:learningSystemPage ctxId="ctx" authentication="Y">
<bbNG:pageHeader>
	<bbNG:pageTitleBar iconUrl="<%=thisPluginImageUrlPath %>">Tweak</bbNG:pageTitleBar>
	<br>
	<div ALIGN="right" STYLE="font-size:9">REDUNDANT FILE</div>
</bbNG:pageHeader>

<bbNG:breadcrumbBar  environment="COURSE" handle="course_tools_area">	
 	<bbUI:breadcrumb>TWEAK</bbUI:breadcrumb>
</bbNG:breadcrumbBar>
<br>
</bbNG:learningSystemPage>