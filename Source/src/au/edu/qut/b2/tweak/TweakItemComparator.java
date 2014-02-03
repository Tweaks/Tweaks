package au.edu.qut.b2.tweak;


import java.util.Comparator; 



@SuppressWarnings("rawtypes")
public class TweakItemComparator implements Comparator {
	
	public int compare(Object strgArrayA, Object strgArrayB){ 

		
		String[] stringArrayA = (String[])strgArrayA;
		String[] stringArrayB = (String[])strgArrayB;
			
		if (stringArrayA != null && stringArrayA.length > 0 && stringArrayB != null && stringArrayB.length > 0){ 
			String strgA = stringArrayA[0]; 
			String strgB = stringArrayB[0]; 

			return strgA.compareToIgnoreCase(strgB); 

		}else{ 
			return 0;   
		} 
	
	}
	
	
}
