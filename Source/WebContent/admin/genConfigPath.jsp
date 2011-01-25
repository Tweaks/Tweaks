<%!
// interim solution to cross platform access to config files
public String b2AbsoluteFilePath(String relativePath) {
	String filePath = "";
	PlugInManager pm = blackboard.platform.plugin.PlugInManagerFactory.getInstance();
	PlugIn tweak = pm.getPlugIn("qut", "tweakbb");
	File pluginDir = pm.getPlugInDir(tweak);
	File tweakPackagesFile = new File(pluginDir, relativePath);
	filePath = tweakPackagesFile.getPath();
	return filePath;
}
%>
<%
// default path
String configFilePath = b2AbsoluteFilePath("/webapp/admin/tweak_packages.xml");
%>