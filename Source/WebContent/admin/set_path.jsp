<%@ page import="java.util.*,
                blackboard.platform.plugin.*,
                java.util.regex.*,
                java.io.*,
				java.io.BufferedReader,
				java.io.FileReader,
				java.io.File,
				java.io.FileWriter,
				java.io.FileNotFoundException,
				java.io.IOException,
				java.io.PrintWriter,
				java.net.*"
				
	errorPage="/error.jsp"%>
	
<%@ taglib uri="/bbUI" prefix="bbUI"%>
<%@ taglib uri="/bbData" prefix="bbData"%>
<%@ taglib uri="/bbNG" prefix="bbNG"%>


<bbNG:genericPage authentication="Y"  ctxId="ctx" bodyClass='bbDefault' >
<%
if (!PlugInUtil.authorizeForSystemAdmin(request, response))
  return;

String thisPluginUriStem = PlugInUtil.getUriStem("qut", "tweakbb");
String thisPluginImageUrlPath = thisPluginUriStem + "images/tweakbb-icon2.gif";

String JSfilePath = "/usr/local/blackboard/content/vi/bb_bb60/plugins/qut-tweakbb/webapp/jquery.tweakSetup.js";
String jsLocation ="";
String jsHelp ="";
String jsPattern ="";

try {
    BufferedReader in = new BufferedReader(new FileReader(JSfilePath));
    String str;
    while ((str = in.readLine()) != null) {
    	//search for js files location path
    	String patternStr1 = "tweak_path = \"(.*?)\"";
        Pattern pattern1 = Pattern.compile(patternStr1);
        
        //search for js help files
        String patternStr2 = "tweak_live_help = \"(.*?)\"";
        Pattern pattern2 = Pattern.compile(patternStr2);
        //search for pattern file
		String patternStr3 = "tweak_bb_active_url_pattern = \"(.*?)\"";
        Pattern pattern3 = Pattern.compile(patternStr3);
        
        Matcher matcher1 = pattern1.matcher(str);
        boolean matchFound1 = matcher1.find();    
		if (matchFound1) {
			String match1 = matcher1.group();
			jsLocation =  matcher1.group(1).trim();
            //out.print ("<hr>" + "<strong>" + jsLocation + "</strong>");
		}
		
		Matcher matcher2 = pattern2.matcher(str);
        boolean matchFound2 = matcher2.find();    
		if (matchFound2) {
			String match2 = matcher2.group();
			jsHelp =  matcher2.group(1).trim();
            //out.print ("<hr>" + "<strong>" + jsHelp + "</strong>");
		}
		Matcher matcher3 = pattern3.matcher(str);
        boolean matchFound3 = matcher3.find();    
		if (matchFound3) {
			String match3 = matcher3.group();
			jsPattern =  matcher3.group(1).trim();
            //out.print ("<hr>" + "<strong>" + jsPattern + "</strong>");
		}
    }
    in.close();
} catch (IOException e) {
}
%>
<bbNG:pageHeader>
<bbNG:breadcrumbBar environment="SYS_ADMIN" navItem="admin_plugin_manage" >
<bbNG:breadcrumb href="config.jsp" >Tweak Properties</bbNG:breadcrumb>>
<bbNG:breadcrumb>Set path to Tweak packages</bbNG:breadcrumb>
</bbNG:breadcrumbBar>
<bbNG:pageTitleBar iconUrl="../images/tweakbb-icon2_big.gif" title="Set path to Tweak packages"></bbNG:pageTitleBar>	
</bbNG:pageHeader>
<bbNG:jsFile href="tweak_validation.js"/>
<bbNG:cssBlock>
	<link type="text/css" href="admin.css" rel="stylesheet">
</bbNG:cssBlock>



<form action="set_path_proc.jsp" method="post" name="updateLocation" onsubmit="javascript:return validatePath(this);">
<bbNG:dataCollection showSubmitButtons="true"> 
<bbNG:step title="Path">
<bbNG:dataElement label="Path to Tweak Package Files. Change this if you wish to host your Tweak Packages in a different server location."> 
	<textarea ROWS="1" COLS="67" WRAP="soft" name="jsLocation" CLASS="usagetext" id="jsLocation"><%=jsLocation%></textarea>
	<input name="jsLocation_cur" id="jsLocation_cur" type="Hidden" value="<%=jsLocation%>" />
</bbNG:dataElement>  
</bbNG:step>

<%--Code comment: use css instead of spacing to make entries consistent eg. <style type="text/css">span.label { display: block; width:180px; }</style> --%>
<bbNG:step title="Help" >
<bbNG:dataElement label="Live Help Location"> 
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<textarea ROWS="3" COLS="107" WRAP="soft" name="jsHelp" CLASS="usagetext" id="jsHelp"><%=jsHelp%></textarea>
	<input name="jsHelp_cur" id="jsHelp_cur" type="Hidden" value="<%=jsHelp%>" />
</bbNG:dataElement> 
</bbNG:step>

<bbNG:step title="Edit Mode URL Pattern" >
<bbNG:dataElement label="Tweak looks for this string in the page URL to determine EDIT MODE (Off). Used to set javascript variable: tweak_bb_display_view">
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<textarea ROWS="1" COLS="67" WRAP="soft" name="jsPattern" CLASS="usagetext" id="jsPattern"><%=jsPattern%></textarea>
	<input name="jsPattern_cur" id="jsPattern_cur" type="Hidden" value="<%=jsPattern%>" /> 
</bbNG:dataElement> 
</bbNG:step>
<bbNG:stepSubmit cancelUrl="config.jsp"/>
</bbNG:dataCollection>
</form>

</bbNG:genericPage>