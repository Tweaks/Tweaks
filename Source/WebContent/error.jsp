<%@ include file="/includes/doctype.jspf" %> 
<%@ taglib uri="/bbNG" prefix="bbNG"%>
<%@ page import="java.io.PrintWriter"%>
<%@ page isErrorPage = "true" %>
<%
	String strException = exception.getMessage();
%>
<bbNG:receipt type="FAIL" title="Error">
<%=strException%>
<p>
<pre>
<%
	// now display a stack trace of the exception
  PrintWriter pw = new PrintWriter( out );
  exception.printStackTrace( pw );
%>
</pre>
</bbNG:receipt><br>