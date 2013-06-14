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
				au.edu.qut.b2.tweak.TextRep,
				org.w3c.dom.*,
				java.io.*,
				java.io.BufferedReader,
				java.io.FileReader,
				java.io.File,
				java.io.FileWriter,
				java.io.FileNotFoundException,
				java.io.IOException,
				java.io.PrintWriter,
				java.net.*;"
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
String JSfilePath = b2AbsoluteFilePath("/webapp/jquery.tweakSetup.js");

String jsLocationStart ="tweak_path = \"";

String jsHelpStart ="tweak_live_help = \"";
String jsPatternStart ="tweak_bb_active_url_pattern = \"";

String[] inputPath1 = {JSfilePath, jsLocationStart + request.getParameter("jsLocation_cur"),jsLocationStart + request.getParameter("jsLocation")};
TextRep.TweakPathSet(inputPath1);

String[] inputPath2 = {JSfilePath,jsHelpStart + request.getParameter("jsHelp_cur"),jsHelpStart + request.getParameter("jsHelp")};
TextRep.TweakPathSet(inputPath2);

String[] inputPath3 = {JSfilePath,jsPatternStart + request.getParameter("jsPattern_cur"), jsPatternStart + request.getParameter("jsPattern")};
TextRep.TweakPathSet(inputPath3);


%>



<bbNG:pageHeader>

<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >

<bbNG:breadcrumb href="config.jsp" >Tweak Properties</bbNG:breadcrumb>

<bbNG:breadcrumb>Set path to Tweak packages</bbNG:breadcrumb>

</bbNG:breadcrumbBar>

<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Set path to Tweak packages"></bbNG:pageTitleBar>	

</bbNG:pageHeader>




 <bbNG:receipt type="SUCCESS" title="Tweak Updated" recallUrl="config.jsp" iconUrl="../images/tweakbb-icon2_big.gif">
	Path to Tweak Script has been  updated to (Type:<strong> <%=request.getParameter("jsLocation")%></strong>). <br>
	Location of  Tweak Live Help has been  updated to (Type:<strong> <%=request.getParameter("jsHelp")%></strong>). <br>
	Tweak Pattern file has been  updated to (Type:<strong> <%=request.getParameter("jsPattern")%></strong>). <br>
 </br>
</bbNG:receipt>
</bbNG:genericPage>
