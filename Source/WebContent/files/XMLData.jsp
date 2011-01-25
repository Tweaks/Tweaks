<% 
DocumentBuilderFactory dbf2 = DocumentBuilderFactory.newInstance();
DocumentBuilder db2 = dbf2.newDocumentBuilder();
Document doc2 = db2.parse(configFilePath);
doc2.getDocumentElement().normalize();

ArrayList<String[]> tweakItems = new ArrayList<String[]>();

NodeList nTweak= doc2.getElementsByTagName("package");
int totalPackages =nTweak.getLength();
String tweakIDList ="";
for (int s = 0; s < totalPackages; s++){
	Node tableNode = nTweak.item(s);
	if(tableNode.getNodeType() == Node.ELEMENT_NODE){
		
		String[] twItem = new String[8];
		Element tableElement = (Element)tableNode;
		
		
		
		NodeList nodeList = tableElement.getElementsByTagName("title");
		Element element = (Element)nodeList.item(0);
		NodeList textList = element.getChildNodes();
		twItem[0] = ((Node)textList.item(0)).getNodeValue().trim();
		//out.print(twItem[0]+ "    ");
		
		nodeList = tableElement.getElementsByTagName("type");
        element = (Element)nodeList.item(0);
        textList = element.getChildNodes();
        twItem[1] = ((Node)textList.item(0)).getNodeValue().trim(); 
        //out.print(twItem[1]+ "    ");
        
        nodeList = tableElement.getElementsByTagName("visible");
        element = (Element)nodeList.item(0);
        textList = element.getChildNodes();
        twItem[2] = ((Node)textList.item(0)).getNodeValue().trim(); 
        //out.print(twItem[2]+ "    ");
        
        nodeList = tableElement.getElementsByTagName("available");
        element = (Element)nodeList.item(0);
        textList = element.getChildNodes();
        twItem[3] = ((Node)textList.item(0)).getNodeValue().trim();
        //out.print(twItem[3]+ "    ");
        
        nodeList = tableElement.getElementsByTagName("description");
        element = (Element)nodeList.item(0);
        textList = element.getChildNodes();
        twItem[4] = ((Node)textList.item(0)).getNodeValue().trim();
        //out.print(twItem[4]+ "    <br>");
        
        nodeList = tableElement.getElementsByTagName("instruction");
        element = (Element)nodeList.item(0);
        textList = element.getChildNodes();
        twItem[5] = ((Node)textList.item(0)).getNodeValue().trim();
        //out.print(twItem[5]+ "    <br>");
        
        nodeList = tableElement.getElementsByTagName("embed");
        element = (Element)nodeList.item(0);
        textList = element.getChildNodes();
        twItem[6] = ((Node)textList.item(0)).getNodeValue().trim();
        
        element = (Element)nodeList.item(0);
        twItem[7] = tableNode.getAttributes().getNamedItem("id").getNodeValue().trim();
        tweakIDList = tweakIDList + "'" + tableNode.getAttributes().getNamedItem("id").getNodeValue().trim() + "',";
        //out.print(twItem[6]+ "    <br>");
        
        
        tweakItems.add(twItem);
		//}
        
    }	
}



Collections.sort(tweakItems, new TweakItemComparator());

%>
