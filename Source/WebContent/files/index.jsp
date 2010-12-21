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
<%@ taglib uri="/bbUI" prefix="bbUI"%>
<%@ taglib uri="/bbData" prefix="bbData"%>

<%
if (!PlugInUtil.authorizeForCourse(request, response))
  return;

String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
String thisPluginImageUrlPath = thisPluginUriStem + "images/tweak_fuzz-sm.jpg";
%>

<bbData:context id="ctx">
<bbUI:docTemplateHead title="Tweak">
	
</bbUI:docTemplateHead>
<bbUI:docTemplateBody>
	<bbUI:breadcrumbBar  environment="COURSE" handle="course_tools_area">	
	 	<bbUI:breadcrumb>TWEAK</bbUI:breadcrumb>
	</bbUI:breadcrumbBar>
	<br>
	<bbUI:titleBar iconUrl="<%=thisPluginImageUrlPath %>">Tweak
	<br>
	<div ALIGN="right" STYLE="font-size:9">Check NT: REDUNDANT FILE?</div>
	</bbUI:titleBar>
</bbUI:docTemplateBody>
</bbData:context>