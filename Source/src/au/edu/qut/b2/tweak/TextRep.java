package au.edu.qut.b2.tweak;
import java.io.*;
import java.util.StringTokenizer;

public class TextRep  
{
	// the main function
	public static void TweakPathSet(String[] args)
	{
		if(args.length!=2&&args.length!=3)
		{
			// invalid number of arguments specified at command line
			System.out.println("Usage(s):\n");
			System.out.println("  1.  java TextRep file_to_process \"search_for_word\" \"replace_with_word\"");	
			System.out.println("  2.  java TextRep file_to_process file_of_words_to_search_replace");	
			return;
		}
		try
		{
			// make 32k buffer for output
			StringBuffer strOutput = new StringBuffer(32768);
			// read input file into a byte array
			byte[] pInput = ReadFile(args[0]);
			// make a backup copy
			WriteFile(args[0]+".backup.copy",pInput);
			String strInput = new String(pInput);
			if(args.length==3)
			{
				// check if words are empty
				if(args[1].equals("")||args[2].equals(""))
				{
					System.out.println("Cannot process empty words");
					return;
				}
				System.out.println("Replacing \""+args[1]+"\" with \""+args[2]+"\" in file: "+args[0]);
				// find all instances of args[1] and replace it with args[2]
				int nPos = 0;
				while(true)
				{
					int nIndex = strInput.indexOf(args[1],nPos);
					// if args[1] can no longer be found, then copy the rest of the input
					if(nIndex<0)
					{
						strOutput.append(strInput.substring(nPos));
						break;
					}
					// otherwise, replace it with args[2] and continue
					else
					{
						strOutput.append(strInput.substring(nPos,nIndex));
						strOutput.append(args[2]);
						nPos = nIndex+args[1].length();
					}
				}
				strInput = strOutput.toString();
			}
			else if(args.length==2)
			{
				System.out.println("Processing file: "+args[0]);
				// create a string tokenizer with file args[1]
				StringTokenizer tokens = new StringTokenizer(new String(ReadFile(args[1])),"\r\n");
				// check to see of the tokenizer has even number of tokens
				int nCount = tokens.countTokens();
				if(nCount<1||nCount%2!=0)
				{
					System.out.println("Invalid number of non-empty lines in file: "+args[1]);
					return;
				}
				// for each pair of string tokens, replace the first one with the next one
				nCount = nCount/2;
				for(int i=0;i<nCount;i++)
				{
					// string to search in the input
					String strSearch = tokens.nextToken();
					// string used to replace the previous one
					String strReplace = tokens.nextToken();
					// check if words are empty
					if(strSearch.equals("")||strReplace.equals(""))
					{
						System.out.println("Cannot process empty words");
						return;
					}
					// replace each instance of strSearch with strReplace
					System.out.println("Replacing \""+strSearch+"\" with \""+strReplace+"\"");
					int nPos = 0;
					while(true)
					{
						int nIndex = strInput.indexOf(strSearch,nPos);
						// if strSearch can no longer be found, then copy the rest of the input
						if(nIndex<0)
						{
							strOutput.append(strInput.substring(nPos));
							break;
						}
						// otherwise, replace it with strReplace and continue
						else
						{
							strOutput.append(strInput.substring(nPos,nIndex));
							strOutput.append(strReplace);
							nPos = nIndex+strSearch.length();
						}
					}
					// continue to process the next pair of string tokens
					strInput = strOutput.toString();
					strOutput = new StringBuffer(32768);
				}
			}
			// write the output string to file
			WriteFile(args[0],strInput.getBytes());
		}
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
	}

	// helper function to read a file into a byte array
	static public final byte[] ReadFile(String strFile) throws IOException
	{
		int nSize = 32768;
		// open the input file stream
		BufferedInputStream inStream = new BufferedInputStream(new FileInputStream(strFile),nSize);
		byte[] pBuffer = new byte[nSize];
		int nPos = 0;
		// read bytes into a buffer
		nPos += inStream.read(pBuffer,nPos,nSize-nPos);
		// while the buffer is filled, double the buffer size and read more
		while(nPos==nSize)
		{
			byte[] pTemp = pBuffer;
			nSize *= 2;
			pBuffer = new byte[nSize];
			System.arraycopy(pTemp,0,pBuffer,0,nPos);
			nPos += inStream.read(pBuffer,nPos,nSize-nPos);
		}
		// close the input stream
		inStream.close();
		if(nPos==0)
		{
			return "".getBytes();
		}
		// return data read into the buffer as a byte array
		byte[] pData = new byte[nPos];
		System.arraycopy(pBuffer,0,pData,0,nPos);
		return pData;
	}

	// helper function to write a byte array into a file
	static public final void WriteFile(String strFile, byte[] pData) throws IOException
	{
		BufferedOutputStream outStream = new BufferedOutputStream(new FileOutputStream(strFile),32768);		
		if(pData.length>0) outStream.write(pData,0,pData.length);
		outStream.close();
	}
}
