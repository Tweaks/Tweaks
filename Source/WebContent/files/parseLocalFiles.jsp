<%@ page import="java.io.*,
				java.net.*"%>
<%
String unparsedURL = "";
String outputText  = "";

// process URL and load if safe or display error message
String myServerName = request.getServerName();
String myDomainRoot = myServerName.substring(myServerName.indexOf("."));
if (request.getParameter("url") != null)
{
	unparsedURL = request.getParameter("url");
	URL parsedURL = new URL(unparsedURL);
	// process if requested url is in server path domain
	if (parsedURL.getHost().indexOf(myDomainRoot) > 0) {
		URLConnection lc = parsedURL.openConnection();
		try {
			BufferedReader in = new BufferedReader( new InputStreamReader( lc.getInputStream()));
			String inputLine;
			StringBuffer sb = new StringBuffer();
			while ((inputLine = in.readLine()) != null) 
			sb.append(inputLine);
			outputText = sb.toString();
			in.close();
		} catch (Exception e) {
			outputText = "Error loading external site: <a href=\""+unparsedURL+"\" target=\"_blank\">"+unparsedURL+"</a>. Please check the link is available.";
		}
	} else {
		outputText = "External site: <a href=\""+unparsedURL+"\" target=\"_blank\">"+unparsedURL+"</a> not loaded. Only sites from "+myDomainRoot.substring(1)+" sub-domains can be loaded for security reasons.<br/>External sites can be loaded using an inline <a href=\"http://www.w3schools.com/tags/tag_iframe.asp\" target=\"_blank\">IFRAME</a> tag and then applying the Load IFRAME as Content Tweak.";
	}
} else {
	outputText = "No site URL provided: check if external link named \"Site Link\" provided.";
}
%>
<%@ page contentType="text/html; charset=UTF-8" %>
<base href="<%=unparsedURL%>"/>
<%=outputText%>