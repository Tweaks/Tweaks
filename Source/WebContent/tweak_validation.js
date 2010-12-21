// JavaScript Document
function validateTweak(form) {
	if (IsEmpty(form.title))
	{
		alert("Please enter text in Title field");
		form.title.focus();
		return false;
	}
	if (IsEmpty(form.id))
	{
		alert("Please enter text in ID field");
		form.id.focus();
		return false;
	}
	if (IsEmpty(form.instructions))
	{
		alert("Please enter text in Instructions field");
		form.instructions.focus();
		return false;
	}
	if (IsEmpty(form.code))
	{
		alert("Please enter text in Code field");
		form.code.focus();
		return false;
	}
	if (IsEmpty(form.jsLocation))
	{
		alert("Please enter text in JavaScript Files Location field");
		form.jsLocation.focus();
		return false;
	}
return true;
}

function validatePath(form){
	if (IsEmpty(form.jsLocation))
	{
		alert("Please enter value in JavaScript Files Location field");
		form.jsLocation.focus();
		return false;
	}
return true;
}

function IsEmpty(aTextField) {
   if ((aTextField.value.length==0) ||
   (aTextField.value==null)) {
      return true;
   }
   else { return false; }
}	



	//if(document.getElementById("title").value==""){
		//
	//document.addTweakPackage.title.focus();
	
	//}