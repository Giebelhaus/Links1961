// AJAX FUNCTIONS

var _ms_XMLHttpRequest_ActiveX = ""; // Holds type of ActiveX to instantiate
var _ajax;                           // Reference to a global XMLHTTPRequest object for some of the samples
var _status_area;                    // will point to the area to write status messages to

BASE_URL = "."

if (!window.Node || !window.Node.ELEMENT_NODE) {
    var Node = {
		ELEMENT_NODE: 1
		,ATTRIBUTE_NODE: 2
		,TEXT_NODE: 3
		,CDATA_SECTION_NODE: 4
		,ENTITY_REFERENCE_NODE: 5
		,ENTITY_NODE: 6
		,PROCESSING_INSTRUCTION_NODE: 7
		,COMMENT_NODE: 8
		,DOCUMENT_NODE: 9
		,DOCUMENT_TYPE_NODE: 10
		,DOCUMENT_FRAGMENT_NODE: 11
		,NOTATION_NODE: 12
	};
}

function getTextFromXML( oNode, deep ) {
    var s = "";
    var nodes = oNode.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.nodeType == Node.TEXT_NODE) {
            s += node.data;
        } else if (
			deep == true
			&& (
				node.nodeType == Node.ELEMENT_NODE
				|| node.nodeType == Node.DOCUMENT_NODE
				|| node.nodeType == Node.DOCUMENT_FRAGMENT_NODE
			)
		) {
            s += getTextFromXML(node, true);
        }
    }
    return s;
}

// the escape() method in Javascript is deprecated -- should use encodeURIComponent if available
function encode( uri ) {
    if (encodeURIComponent) {
        return encodeURIComponent(uri);
    }
    if (escape) {
        return escape(uri);
    }
}

function decode( uri ) {
    uri = uri.replace(/\+/g, ' ');
    if (decodeURIComponent) {
        return decodeURIComponent(uri);
    }
    if (unescape) {
        return unescape(uri);
    }
    return uri;
}

function executeReturn( AJAX ) {
	if (AJAX.readyState == 4) {
		if (AJAX.status == 200) {
			if ( AJAX.responseText ) {
				eval(AJAX.responseText);
			}
		}
	}
}

function AJAXRequest( method, url, data, process, async, dosend ) {
    // self = this; creates a pointer to the current function
    // the pointer will be used to create a "closure". A closure
    // allows a subordinate function to contain an object reference to the
    // calling function. We can't just use "this" because in our anonymous
    // function later, "this" will refer to the object that calls the function 
    // during runtime, not the AJAXRequest function that is declaring the function
	var self = this;
	// check the dom to see if this is IE or not
	if (window.XMLHttpRequest) {
		// Not IE
		self.AJAX = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		// IE: Instantiate the latest MS ActiveX Objects
		if (_ms_XMLHttpRequest_ActiveX) {
			self.AJAX = new ActiveXObject(_ms_XMLHttpRequest_ActiveX);
		} else {
			// loops through the various versions of XMLHTTP to ensure we're using the latest
			var versions = ["Msxml2.XMLHTTP.7.0", "Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
			for (var i = 0; i < versions.length ; i++) {
				try {
					// try to create the object
					// if it doesn't work, we'll try again
					// if it does work, we'll save a reference to the proper one to speed up future instantiations
					self.AJAX = new ActiveXObject(versions[i]);
					if (self.AJAX) {
						_ms_XMLHttpRequest_ActiveX = versions[i];
						break;
					}
				}
				catch (objException) {
					// trap; try next one
				};
			}
		}
	}
	// if no callback process is specified, then assing a default which executes the code returned by the server
	if (typeof process == 'undefined' || process == null) {
		process = executeReturn;
	}
	self.process = process;
	// create an anonymous function to log state changes
	self.AJAX.onreadystatechange = function( ) {
		if (self.AJAX.ReadyState == 4 || self.AJAX.readyState == 4) {
			self.process(self.AJAX);
		}
	}
	// if no method specified, then default to POST
	if (!method) {
		method = "POST";
	}
	method = method.toUpperCase();
	if (typeof async == 'undefined' || async == null) {
		async = true;
	}
	self.AJAX.open(method, url, async);
	// return self.AJAX;
	if (method == "POST") {
		// self.AJAX.setRequestHeader("Connection", "close");
		self.AJAX.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		self.AJAX.setRequestHeader("Method", "POST " + url + "HTTP/1.1");
	}
	// if dosend is true or undefined, send the request
	// only fails is dosend is false
	// you'd do this to set special request headers
	if ( dosend || typeof dosend == 'undefined' ) {
		if ( !data ) data = "";
		self.AJAX.send(data);
	}
	return self.AJAX;
}



// STRING FUNCTIONS

function repeat_string(s,times) {
	var r = "";
	for (var i = 0; i < times; i++) {
		r += s;
	}
	return r;
}

function replaceAll(myString, oldChar, newChar, all) {
	if (typeof all == 'undefined') all = true;
	if (myString == "") return myString;
	var i = myString.indexOf(oldChar);
    while (i != -1) {
    	myString = myString.substring(0,i) + newChar + myString.substr(i + oldChar.length);
		if (!all) break;
		i = myString.indexOf(oldChar);
    }
    return myString;
}

function removeAll(myString, oldChar) {
	return replaceAll(myString, oldChar, "");
}

function Len(myString) {
	return myString.length;
}

function Left(myString, charCount) {
	// if (myString.length < charCount) return -1;
	return myString.substr(0,charCount);
}

function Right(myString, charCount) {
	// if (myString.length < charCount) return -1;
	return myString.substr(myString.length-charCount,myString.length);
}

function Trim(myString) {
	while (myString.charAt(0) == " " || escape(myString.charAt(0)) == "%0A" || escape(myString.charAt(0)) == "%0D" || escape(myString.charAt(0)) == "%09") {
		myString=myString.substring(1);
	}
	while (myString.charAt(myString.length-1) == " " || escape(myString.charAt(myString.length-1)) == "%0A" || escape(myString.charAt(myString.length-1)) == "%0D") {
		myString=myString.substring(0,myString.length-1);
	}
	return myString;
}

function getParameter(URL, Parameter) {
	if (URL.indexOf("?" + Parameter + "=") == -1 && URL.indexOf("&" + Parameter + "=") == -1) {
		return false;
	} else {
		var parameterPos = (URL.indexOf("?" + Parameter + "=") > URL.indexOf("&" + Parameter + "="))?URL.indexOf("?" + Parameter + "="):URL.indexOf("&" + Parameter + "=");
		parameterPos += 2 + Parameter.length;
		var parameterValue = URL.substr(parameterPos);
		if (parameterValue.indexOf("&") != -1) {
			parameterValue=parameterValue.substring(0,parameterValue.indexOf("&"));
		}
		return parameterValue;
	}
}

function isNumeric(thisString) {
	for (var d=0; d<thisString.length; d++) {
		if (thisString.charCodeAt(d) < 48 || thisString.charCodeAt(d) > 57) {
			if (thisString.charCodeAt(d) != 46 && thisString.charCodeAt(d) != 45) {
				return false;
			}
		}
	}
	if (charCount(thisString, ".") > 1 || charCount(thisString, "-") > 1 || (charCount(thisString, "-") == 1 && thisString.indexOf("-") != 0)) {
		return false;
	} else {
		return true;
	}
}

function containsNumeric(thisString) {
	var containsNumeric=false;
	var containsCharacter=false;
	for (var d=0; d<thisString.length; d++) {
		if (thisString.charCodeAt(d) > 47 && thisString.charCodeAt(d) < 58) {
			containsNumeric=true;
		}
	}
	return containsNumeric;
}

function NumberFormat(thisString,thisFormat) {
	thisString += "";
	thisFormat += "";
	if (!isNumeric(removeAlphas(thisString)) || !isNumeric(removeAlphas(thisFormat))) return -1;
	thisString = removeAlphas(thisString);
	// Remove leading 0
	if (Left(thisString, 2) == "0.") {
		thisString = Right(thisString,Len(thisString)-1);
	}
	// Add extras "9"s to the Format, as necessary
	for (var xxx=charCount(ListGetAt(thisFormat,1,"."),"9"); xxx < Len(ListGetAt(removeAll(removeAll(thisString,","),"-"),1,".")); xxx++) {
		thisFormat=ListSetAt(thisFormat,1,ListGetAt(thisFormat,1,".")+"9",".");
	}
	// Remove extra "9"s from the Format, as necessary
	format9Count = charCount(ListGetAt(thisFormat,1,"."),"9");
	for (var xxx=Len(ListGetAt(removeAll(removeAll(thisString,","),"-"),1,".")); xxx < format9Count; xxx++) {
		pos=Find(thisFormat,"9",charCount(ListGetAt(thisFormat,1,"."),"9"));
		thisFormat=ListSetAt(thisFormat,1,Left(ListGetAt(thisFormat,1,"."),pos-1)+Right(ListGetAt(thisFormat,1,"."),Len(ListGetAt(thisFormat,1,"."))-pos),".");
	}
	// Round if necessary
	if (ListLen(thisFormat,".") > 1 && charCount(ListGetAt(thisFormat,2,"."),"9") > 0) {
		thisString=Math.round(thisString*Math.pow(10,charCount(ListGetAt(thisFormat,2,"."),"9")))/Math.pow(10,charCount(ListGetAt(thisFormat,2,"."),"9"))+"";
	}
	// Remove leading from rounding
	if (Left(thisString, 2) == "0.") {
		thisString = Right(thisString,Len(thisString)-1)
	}
	if (Find(thisFormat,".",1) > 0 && Find(thisString,".",1) < 1) {
		// format has decimal but string does not
		thisString+=".";
		for (var www = 1; www <= Len(ListGetAt(thisFormat,ListLen(thisFormat,"."),".")); www++) {
			thisString+="0";
		}
	} else if (Find(thisFormat,".",1) < 1) {
		// format does not have a decimal
		thisString=Math.round(thisString)+"";
	} else if (Find(thisFormat,".",1) > 0 && Find(thisString,".",1) > 0) {
		// they both have a decimal
		for (var www=Len(ListGetAt(thisString,2,".")); www<charCount(ListGetAt(thisFormat,2,"."),"9"); www++) {
			thisString+="0";
		}
	}
	// Make negative if necessary
	if (Left(thisString,1) == "-") {
		thisFormat="-"+thisFormat;
	}
	// create Output String
	thisString = removeAll(removeAll(removeAll(thisString,","),"."),"-");	//so that we only have digits
	var outputString = "";
	while (thisFormat != "" && Find(thisFormat,"9",1)) {
		outputString+=Left(thisFormat,Find(thisFormat,"9",1)-1)+Left(thisString,1);
		thisFormat=Right(thisFormat,Len(thisFormat)-Find(thisFormat,"9",1));
		thisString=Right(thisString,Len(thisString)-1);
	}
	outputString+=thisFormat;
	return outputString;
}

function containsAlpha(thisString) {
	var containsAlpha=false;
	for (var d=0; d<thisString.length; d++) {
		if (thisString.charCodeAt(d) > 64 && thisString.charCodeAt(d) < 123) {
			containsAlpha=true;
		}
	}
	return containsAlpha;
}

function charCount(thisString, targetChar) {
	var count=0;
	for (var d=0; d<thisString.length; d++) {
		if (thisString.charAt(d) == targetChar) {
			count++
		}
	}
	return count;
}

function Find(thisString, targetSubString, instance) {
	// instance is the nth instance of thisString inside targetSubString
	if (instance == undefined) instance = 1;
	var newString = thisString;
	var charCount = 0;
	while (instance > 0) {
		if (newString.indexOf(targetSubString) != -1) {
			charCount += newString.indexOf(targetSubString) + 1;
			newString = newString.substr(newString.indexOf(targetSubString)+1);
			instance--;
		} else {
			return -1;
		}
	}
	return charCount;
}

function Reverse(myString) {
	var newString="";
	for (var d = 0; d<myString.length; d++) {
		newString=myString.substr(d,1)+newString;
	}
	return newString;
}

function URLEncodedFormat(myString) {
	var newString = myString;
	newString = replaceAll(newString, "%", "%25");
	newString = replaceAll(newString, " ", "%20");
	newString = replaceAll(newString, "&", "%26");
	newString = replaceAll(newString, "?", "%3F");
	newString = replaceAll(newString, ".", "%2E");
	newString = replaceAll(newString, "!", "%21");
	newString = replaceAll(newString, "#", "%23");
	newString = replaceAll(newString, "@", "%40");
	newString = replaceAll(newString, "$", "%24");
	newString = replaceAll(newString, "+", "%2B");
	newString = replaceAll(newString, "[", "%5B");
	newString = replaceAll(newString, "]", "%5D");
	newString = replaceAll(newString, "{", "%7B");
	newString = replaceAll(newString, "}", "%7D");
	newString = replaceAll(newString, ";", "%3B");
	newString = replaceAll(newString, ":", "%3A");
	newString = replaceAll(newString, "'", "%27");
	newString = replaceAll(newString, ",", "%2C");
	newString = replaceAll(newString, "<", "%3C");
	newString = replaceAll(newString, ">", "%3E");
	newString = replaceAll(newString, "/", "%2F");
	newString = replaceAll(newString, '"', '%22');
	return newString;
}

function removeAlphas(tempNumber) {
	var tempLH="";
	var tempRH=tempNumber;
	for (var a=0; a<tempNumber.length; a++) {
		if (isNumeric(Left(tempRH,1)))
			tempLH+=Left(tempRH,1);
		if (tempRH.length > 1)
			tempRH=Right(tempRH, tempRH.length-1);
	}
	return tempLH;
}

function percentFormat(thisNumber) {
	var tempNumber = removeAlphas(thisNumber);
	if (Trim(tempNumber) == "")
		return 0;
	// if (tempNumber > 100)
	//	return 100;
	// else
		return tempNumber;
}

function MoneyFormat(thisNumber,commas) {
	if (commas == undefined) commas = false;
	var tempNumber = thisNumber.toString();
	if (thisNumber != "var") {
		tempNumber = tempNumber.replace(/[^\d.]/g,'');
		if (charCount(tempNumber,".") > 1) {
			// if there is a 2nd ".", remove it and everything past it.
			tempNumber = Left(tempNumber,Find(tempNumber,".",2)-1);
		}
		while (Left(tempNumber,1) == "0") {
			tempNumber = Right(tempNumber,Len(tempNumber)-1);
		}
		if (Left(tempNumber,1) == ".") {
			tempNumber = "0" + tempNumber;
		}
		if (Trim(tempNumber) == "") {
			return "0.00";
		}
		var InDecPlaces = 0;
		if (Find(tempNumber, ".", 1) == -1) {
			// check for no decimal
			tempNumber+=".";
		} else {
			// check for too many digits
			InDecPlaces = Len(tempNumber)-Find(tempNumber, ".", 1);
			if (InDecPlaces > 2) {
				tempNumber = Left(tempNumber, Find(tempNumber, ".", 1)+3);
				if (parseInt(Right(tempNumber,1)) > 4) {
					tempNumber *= 1;
					tempNumber += parseFloat(1*.01);
				}
				tempNumber = tempNumber + "";
				tempNumber = Left(tempNumber, Find(tempNumber, ".", 1)+2);
			}	
		}
		InDecPlaces = Len(tempNumber) - Find(tempNumber, ".", 1);
		for (var d = 0; d < (2-InDecPlaces); d++) {
			tempNumber += "0";
		}
		if (Len(tempNumber) > 6) {
			tempRH=Right(tempNumber, 3);
			tempLH=Left(tempNumber, Len(tempNumber)-3);
			while (Len(replaceAll(tempLH,"-","")) > 3) {
				tempRH=Right(tempLH, 3) + tempRH;
				if (Len(replaceAll(tempLH,"-","")) > 3) {
					tempRH="," + tempRH;
					tempLH=Left(tempLH, Len(tempLH)-3);
				} else {
					tempLH="";
				}
			}
			tempNumber=tempLH+tempRH;	
		}
	}
	if (!commas) tempNumber = tempNumber.replace(/,/g,'');
	return tempNumber;
}

function addLoadEvent(func) {	
	var oldonload = window.onload;
	if (typeof window.onload != "function") {
    	window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) oldonload();
			func();
		}
	}
}

function alert_wrap(string) {
	var s = string + " ";
	var t = "";
	var i = i0 = 0;
	var m = 60;
	while (i >= 0) {
		i0 = i;
		if (s.length - i0 <= m) {
			t += s.substring(i0);
			i = -1;
		} else {
			i = s.indexOf("\n",i0);
			if (i >= 0 && i - i0 <= m + 10) {
				t += s.substring(i0,i+2);
				i = i+2;
			} else {
				i = s.indexOf(" ",i0+m);
				if (i >= 0) {
					t += s.substring(i0,i) + "\n";
					i = i+1;
				}
			}
		}
	}
	alert(t);
}

function english_list(array) {
	if (typeof array != "object") array = listToArray(array);
	var s = "";
	for (var i = 0; i < array.length; i++) {
		if (i == array.length - 1 && array.length > 1) {
			s += " and ";
		} else if (i > 0) {
			s += ", ";
		}
		s += array[i];
	}
	return s;
}



// LIST FUNCTIONS

function ListLen(List,Delimiter) {
	if (typeof Delimiter == 'undefined') Delimiter = ',';
	if (List == "") {
		return 0;
	} else {
		var CommaCount = 1;
		var newList = List;
		while (newList.indexOf(Delimiter) != -1) {
			CommaCount++;
			newList = newList.substring(newList.indexOf(Delimiter)+1);
		}
		return CommaCount;
	}
}

function ListGetAt(List,Index,Delimiter) {
	if (typeof Delimiter == 'undefined') Delimiter = ',';
	if (Index > ListLen(List,Delimiter)) {
		return "";
	} else {
		var newList = List;
		// remove leading text
		for (var count = 1; count < Index; count++) {
			newList = newList.substring(newList.indexOf(Delimiter)+1);
		}
		// remove trailing text
		if (newList.indexOf(Delimiter) != -1) {
			newList = newList.substring(0,newList.indexOf(Delimiter));
		}
		return newList;
	}
}

function ListFirst(List,Delimiter) {
	if (typeof Delimiter == 'undefined') Delimiter = ',';
	return ListGetAt(List,1,Delimiter);
}

function ListLast(List,Delimiter) {
	if (typeof Delimiter == 'undefined') Delimiter = ',';
	return ListGetAt(List,ListLen(List,Delimiter),Delimiter);
}

function ListSetAt(List,Index,Element,Delimiter) {
	if (typeof Delimiter == 'undefined') Delimiter = ',';
	if (Index <= ListLen(List,Delimiter)) {
		if (ListLen(List,Delimiter) < 1) {
			return -1;
		} else {
			List = Delimiter + List + Delimiter;
			var BeforeSet = List.substring(0,Find(List,Delimiter,Index)-1);
			var AfterSet = List.substr(Find(List,Delimiter,Index+1)-1);
			var newList = BeforeSet + Delimiter + Element + AfterSet;
			newList = newList.substring(1,newList.length-1);
			if (newList.substring(newList.length,1) == Delimiter) {
				newList = newList.substring(0,newList.length-1);
			}
			return newList;
		}
	} else {
		return -1;
	}
}

function ListInsertAt(List,Index,Element,Delimiter) {
	if (typeof Delimiter == 'undefined') Delimiter = ',';
	if (List == "") return Element;
	if (Index > ListLen(List)) return ListAppend(List,Element,Delimiter);
	if (Index < 1) Index = 1;
	var newList = "";
	for (var i = 1; i < Index; i++) {
		newList = ListAppend(newList,ListGetAt(List,i,Delimiter),Delimiter);
	}
	newList = ListAppend(newList,Element,Delimiter);
	for (var i = Index; i <= ListLen(List); i++) {
		newList = ListAppend(newList,ListGetAt(List,i,Delimiter),Delimiter);
	}
	return newList;
}

function ListAppend(List,Element,Delimiter) {
	if (typeof Delimiter == 'undefined') Delimiter = ',';
	if (ListLen(List,Delimiter) > 0) {
		List += Delimiter;
	}
	return List + Element;
}

function ListDeleteAt(List,Index,Delimiter) {
	if (typeof Delimiter == 'undefined') Delimiter = ',';
	if (Index <= ListLen(List,Delimiter)) {
		if (ListLen(List,Delimiter) < 1) {
			return -1;
		} else {
			List = Delimiter + List + Delimiter;
			if (ListLen(List,Delimiter) == 3) {
				List += Delimiter;
			}
			var BeforeDelete = List.substring(0,Find(List,Delimiter,Index)-1);
			var AfterDelete = List.substr(Find(List,Delimiter,Index+1)-1);
			var newList = BeforeDelete + AfterDelete;
			newList = newList.substring(1,newList.length-1);
			if (newList.substring(newList.length,1) == Delimiter) {
				newList = newList.substring(0,newList.length-1);
			}
			return newList;
		}
	} else {
		return -1;
	}
}

function ListRest(List,Delimiter) {
	if (typeof Delimiter == 'undefined') Delimiter = ',';
	return ListDeleteAt(List,1,Delimiter);
}

function ListFind(List,FindMe,Delimiter) {
	if (typeof Delimiter == 'undefined') Delimiter = ',';
	try {
		for (var d = 1; d <= ListLen(List,Delimiter); d++) {
			if (ListGetAt(List,d,Delimiter).toString().toLowerCase() == FindMe.toString().toLowerCase()) {
				return d;
			}
		}
	}
	catch(err) {
		alert(err.description);
		alert(List);
		alert(FindMe);
	}
	return 0;
}



// DATE FUNCTIONS

function now_() { 
	return ( new Date().getTime() );
}

function y2k(number) { 
	return (number < 1000) ? number + 1900 : number;
}

function changeDays(MonthObject,DayObject) {
	var selectedValue = DayObject.selectedIndex;
	var tempDate = new Date(2000,MonthObject.selectedIndex-(MonthObject.length-12),27);
	var DaysInMonth = 27;
	while (tempDate.getMonth() == MonthObject.selectedIndex-(MonthObject.length-12)) {
		DaysInMonth++;
		tempDate=new Date(2000,MonthObject.selectedIndex-(MonthObject.length-12),DaysInMonth+1);
	}
	if (DaysInMonth==28) {
		DaysInMonth=29;
	}
	if (selectedValue > DaysInMonth) {
		selectedValue = DaysInMonth;
	}
	for (var i=31; i > 1; i--) {
		DayObject.options[i]=null;
	}
	for (var i=1; i < 31; i++) {
		DayObject.options[i]=null;
	}
	var tempOption=new Option();
	for (var i = 1 + (1-(MonthObject.length-12)); i <= DaysInMonth; i++) {
		tempOption=new Option(i,i);
		eval("DayObject.options[i-(1-(MonthObject.length-12))]=tempOption")
		if (i == selectedValue) {
			DayObject.options[i-(1-(MonthObject.length-12))].selected = true;
		}
	}
}

function changeDays2(MonthObject,DayObject,YearObject) {
	var selectedValue = DayObject.selectedIndex;
	var tempDate = new Date(YearObject[YearObject.selectedIndex].value,MonthObject.selectedIndex-(MonthObject.length-12),27);
	var DaysInMonth = 27;
	while(tempDate.getMonth() == MonthObject.selectedIndex-(MonthObject.length-12)) {
		DaysInMonth++;
		tempDate=new Date(YearObject[YearObject.selectedIndex].value,MonthObject.selectedIndex-(MonthObject.length-12),DaysInMonth+1);
	}
	// if (DaysInMonth==28)
	//	DaysInMonth=29;
	if (selectedValue > DaysInMonth)
		selectedValue = DaysInMonth;
	for (var i=31; i > 1; i--) {
		DayObject.options[i]=null;
	}
	for (var i=1; i < 31; i++) {
		DayObject.options[i]=null;
	}
	var tempOption=new Option();
	for (var i=1+(1-(MonthObject.length-12)); i <= DaysInMonth; i++) {
		tempOption=new Option(i,i);
		eval("DayObject.options[i-(1-(MonthObject.length-12))]=tempOption")
		if (i==selectedValue) {
			DayObject.options[i-(1-(MonthObject.length-12))].selected=true
		}
	}
}

function startToday(Form,WhichDate) {
	var thisMonth=new Date().getMonth()+1;
	var thisDay=new Date().getDate();
	var thisYear=new Date().getFullYear();
	for (var i=1; i <= 12; i++) {
		if (i==thisMonth)
			eval("Form."+WhichDate+"Month.options[i].selected=true")
		}
	for (var i=1; i < 32; i++) {
		if (i==thisDay)
			eval("Form."+WhichDate+"Day.options[i].selected=true")
		}
    eval("Form."+WhichDate+"Year.value=thisYear")
	// Form.OnStudyYear.value=thisYear;
}

function startToday2(frmObj) {
	var thisMonth=new Date().getMonth()+1;
	var thisDay=new Date().getDate();
	var thisYear=new Date().getYear();	 	
	frmObj.value=thisMonth+"/"+thisDay+"/"+thisYear;
}

function isSQLDate (month,day,year) {
	if (year < 1753 || month > 12) {
		return false;
	} else {
		return isDate(month,day,year);
	}
}

function isDate (month,day,year) {
	// checks if date passed is valid
	// will accept dates in following format:
	// isDate(dd,mm,ccyy), or
	// isDate(dd,mm) - which defaults to the current year, or
	// isDate(dd) - which defaults to the current month and year.
	// Note, if passed the month must be between 1 and 12, and the
	// year in ccyy format.
	var today = new Date();
	year = ((!year) ? y2k(today.getYear()):year);
	month = ((!month) ? today.getMonth():month-1);
	if (!day) return false
	var test = new Date(year,month,day);
	return ( y2k(test.getYear()) == year && month == test.getMonth() && day == test.getDate() );
}

function validateDate(month,day,year) {
	if (year.length != 4 || month.length == 0 || year.length == 0 || day.length == 0 || month > 12)
		return false;
	// Check for valid date and that it's SQL compatible (1/1/1753 or greater)
	return isSQLDate(month,day,year);
}

function validateStringDate(stringDate) {
	if ((stringDate.match(/\//g)||[]).length > 2)
		return false;
	var stringYear=Right(stringDate, 4);
	var stringMonth=Left(stringDate,Find(stringDate,"/",1)-1);
	var stringDay=stringDate.substr(Find(stringDate,"/",1),Find(stringDate,"/",2)-Find(stringDate,"/",1)-1);
	if (stringMonth > 12)
		return false;
	else
		return validateDate(stringMonth,stringDay,stringYear);
}

function dateCompare(firstDate, secondDate) {
	// Returns -1 if firstDate is smaller than secondDate, 0 if they are equal, 1 if firstDate is greater than secondDate
	var firstYear = Right(firstDate, 4);
	var firstMonth = Left(firstDate,Find(firstDate,"/",1)-1)-1;
	var firstDay = firstDate.substr(Find(firstDate,"/",1),Find(firstDate,"/",2)-Find(firstDate,"/",1)-1);
	var secondYear = Right(secondDate, 4);
	var secondMonth = Left(secondDate,Find(secondDate,"/",1)-1)-1;
	var secondDay = secondDate.substr(Find(secondDate,"/",1),Find(secondDate,"/",2)-Find(secondDate,"/",1)-1);
	Date1 = new Date(firstYear,firstMonth,firstDay);
	Date2 = new Date(secondYear,secondMonth,secondDay);
	if (Date1.getYear() < Date2.getYear()) {
		return -1;
	} else if (Date1.getYear() > Date2.getYear()) {
		return 1;
	} else {
		if (Date1.getMonth() < Date2.getMonth()) {
			return -1;
		} else if (Date1.getMonth() > Date2.getMonth()) {
			return 1;
		} else {
			if (Date1.getDate() < Date2.getDate()) {
				return -1;
			} else if (Date1.getDate() > Date2.getDate()) {
				return 1;
			} else {
				return 0;
			}
		}
	}
}

function DaysInMonth(thisMonth, thisYear) {
	var DayCount=28;
	var tempDate=new Date(thisYear,thisMonth-1,DayCount);
	while(tempDate.getMonth() == thisMonth-1) {
		DayCount++;
		tempDate=new Date(thisYear,thisMonth-1,DayCount);
	}
	return DayCount-1;
}

function blankDate(Form,WhichDate) {
    eval("Form."+WhichDate+"Month.options[0].selected=true");
    eval("Form."+WhichDate+"Day.options[0].selected=true");
    eval("Form."+WhichDate+"Year.value=''")
}



// form fun

function mikeForm(form,IDs,fields,struct,first,prefix) {
	if (typeof IDs != "object") IDs = listToArray(IDs);
	if (typeof fields != "object") fields = listToArray(fields);
	if (prefix == undefined) prefix = "";
	for (var i = 0; i < IDs.length; i++) {
		var ID = IDs[i];
		if (first && !struct[ID]) struct[ID] = {};
		for (var j = 0; j < fields.length; j++) {
			var field = fields[j];
			var o = form[field+"_"+prefix+ID];
			if (o && !(!first && !struct[ID][field])) {
				var o_type = (o.type) ? o.type : o[0].type;
				if (o_type == "select-one") {
					if (first) struct[ID][field] = getSelect(o); else setSelect(o,struct[ID][field]);
				} else if (ListFind("hidden,text,textarea",o_type)) {
					if (first) struct[ID][field] = o.value; else o.value = struct[ID][field].toString();
				} else {
					if (first) struct[ID][field] = getRadioCheck(o); else setRadioCheck(o,struct[ID][field]);
				}
			}
		}
	}
}

function bi(obj) {
	return document.getElementById(obj);
}

function arrayUpDown(array,cur,dir,lookup) {
	if (!cur && lookup) cur = arrayPos(array,cur);
	if (cur < 0 || cur >= array.length) return;
	var me = array[cur];
	array.splice(cur,1);
	if (dir == -1) {
		if (cur == 0) {
			array.push(me);
		} else {
			array.splice(cur-1,0,me);
		}
	} else {
		if (cur == array.length) {
			array.splice(0,0,me);
		} else {
			if (cur == array.length - 1) {
				array.push(me);
			} else {
				array.splice(cur+1,0,me);
			}
		}
	}
}

function arraySplice(array,cur,niu,lookup) {
	if (lookup != undefined) cur = arrayPos(array,cur);
	if (niu < 0 || niu >= array.length) return;
	array.splice(niu,0,array[cur]);
	array.splice(cur+(niu<cur)?1:0,1);
}

function getRadioCheck(obj) {
	var ret = [];
	if (obj) {
		var len = obj.length;
		if (len == undefined) {
			if (obj.checked) {
				ret.push(obj.value);
			}
		} else {
			for (var i = 0; i < len; i++) {
				if (obj[i].checked) {
					ret.push(obj[i].value);
				}
			}
		}
	}
	return ret;
}

function setRadioCheck(obj,newValue,onoff) {
	if (typeof onoff == 'undefined') onoff = true;
	if (obj) {
		if (typeof newValue != "object") newValue = listToArray(newValue);
		var len = obj.length;
		for (var a = 0; a < newValue.length; a++) {
			if (len == undefined) {
				obj.checked = (obj.value == newValue[a].toString());
			} else {
				for (var i = 0; i < len; i++) {
					if (obj[i].value == newValue[a].toString()) {
						obj[i].checked = onoff;
						break;
					}
				}
			}
		}
	}
}

function getSelect(obj) {
	return obj[obj.selectedIndex].value;
}

function setSelect(obj,newValue) {
	for (var i = 0; i < obj.length; i++) {
		if (obj[i].value.toString().toLowerCase() == newValue.toString().toLowerCase()) {
			obj.selectedIndex = i;
			break;
		}
	}
}

function checkbox_checkAll(formObj,truefalse) {
 	if (formObj) {
		if (!formObj.length) {
			formObj.checked = truefalse;
		} else {
			for (var i = 0; i < formObj.length; i++)
				formObj[i].checked = truefalse;
		}
	}
}

function checkbox_countChecks(formObj) {
 	if (formObj) {
		if (!formObj.length) {
			return (formObj.checked) ? 1 : 0;
		} else {
		 	var checkCount = 0;
			for (var i = 0; i < formObj.length; i++) {
				if (formObj[i].checked) {
					checkCount++;
				}
			}
			return checkCount;
		}
	} else {
		return -1;
	}
}

function arrayPos(array,findMe) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].toString().toLowerCase() == findMe.toString().toLowerCase()) {
			return i;
		}
	}
	return -1;
}

function listToArray(list) {
	var array = [];
	list = list.toString();
	for (var i = 1; i <= ListLen(list); i++) {
		array.push(ListGetAt(list,i));
	}
	return array;
}

function validateCreditCard(cardNumber,cardType) {
	// if (cardNumber.charAt(0) == '*') return true;
	var isValid = false;
	isValid = !/[^\d -]/.test(cardNumber);
	if (isValid) {
		var cardNumbersOnly = cardNumber.replace(/[ -]/g,"");
		var cardNumberLength = cardNumbersOnly.length;
		var lengthIsValid = false;
		var prefixIsValid = false;
		var prefixRegExp;
		switch (cardType) {
			case "Visa":
				lengthIsValid = (cardNumberLength == 16 || cardNumberLength == 13);
				prefixRegExp = /^4/;
				break;
			case "MasterCard":
				lengthIsValid = (cardNumberLength == 16);
				prefixRegExp = /^5[1-5]/;
				break;
			case "Discover":
				lengthIsValid = (cardNumberLength == 16);
				prefixRegExp = /^6011/;
				break;
			case "AmEx":
				lengthIsValid = (cardNumberLength == 15);
				prefixRegExp = /^3(4|7)/;
				break;
			default:
				return false;
		}
		prefixIsValid = prefixRegExp.test(cardNumbersOnly);
		isValid = prefixIsValid && lengthIsValid;
	}
	if (isValid) {
		var numberProduct;
		var numberProductDigitIndex;
		var checkSumTotal = 0;
		for (digitCounter = cardNumberLength - 1; digitCounter >= 0; digitCounter--) {
			checkSumTotal += parseInt (cardNumbersOnly.charAt(digitCounter));
			digitCounter--;
			numberProduct = String((cardNumbersOnly.charAt(digitCounter) * 2));
			for (var i = 0; i < numberProduct.length; i++) {
				checkSumTotal += parseInt(numberProduct.charAt(i));
			}
		}
		isValid = (checkSumTotal % 10 == 0);
	}
	return isValid;
}

function validateEmail(str,warn) {
	if (window.RegExp) {
		var reg1str = "(@.*@)|(\\.\\.)|(@\\.)|(\\.@)|(^\\.)";
		var reg2str = "^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,5}|[0-9]{1,3})(\\]?)$";
		var reg1 = new RegExp(reg1str);
		var reg2 = new RegExp(reg2str);
		if (!reg1.test(str) && reg2.test(str)) {
			return true;
		}
	} else {
		if (str.indexOf("@") >= 0 && str.indexOf(".") >= 0) {
			return true;
		}
	}
	if (warn == true) {
		alert("Invalid email address:" + str);
	}
	return false;
}

function email_fix(email) {
	if (email.indexOf('@') >= 0) {
		email = email.replace(/ /g,"").replace(/@+/g,"@");
		var left_bracket = email.indexOf('<');
		if (left_bracket >= 0) {
			var right_bracket = email.indexOf('>',left_bracket);
			if (right_bracket >= 0) {
				email = email.substring(left_bracket+1,right_bracket)
			}
		}
	}
	return email;
}

var errString, errCount, focusObj, expires_soon_warning = 0;
function dentedBadge(form1,curr_year_month = 0) {
	errString = "";
	errCount = 1;
	focusObj = 0;
	if ( curr_year_month > 0 && form1.ccexpy && form1.ccexpy.selectedIndex > 0 && form1.ccexpm && form1.ccexpm.selectedIndex > 0 ) {
		var form_year_month = ( parseInt(form1.ccexpy.value) * 12 ) + parseInt(form1.ccexpm.value);
		var diff_year_month = form_year_month - curr_year_month;
		if ( diff_year_month <= 0 ) {
			alert("Your Credit Card Expiration date is in the past. Please update the current Month and Year.");
			return 0;
		}
		if ( diff_year_month <= 12 && expires_soon_warning == 0 ) {
			alert("Your Credit Card Expiration date is within a year of now. Please double check the Month and Year, and update if necessary.");
			expires_soon_warning = 1;
			return 0;
		}
	}
	return 1;
}

function badPoFo() {
	alert_wrap("The following errors occurred:\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + errString);
	if (typeof(focusObj) == "object" && focusObj) {
		setTimeout(function() {
			focusObj.focus();
			focusObj.focus(); // gotta do it twice
		},200);
	}
}

function resize_iframe(my_id, my_height) {
	$("#"+my_id).css("height", my_height + 25 + "px");
}



// textarea maxlength

// var ns6 = document.getElementById && !document.all?1:0;

function doKeyPress(obj,evt) {
	var maxLength = obj.getAttribute("maxlength");
	var e = window.event ? event.keyCode : evt.which;
	if (e == 32 || e == 13 || e > 47) {
		if (maxLength && (obj.value.length > maxLength-1)) {
			if (window.event) {
				window.event.returnValue = null;
			} else {
				evt.cancelDefault;
				return false;
			}
        }
    }
}

function doTAPaste(myObj) {
	setTimeout("preCheckMaxLength('"+myObj.name+"')",1);
}

function preCheckMaxLength(myObjName) {
	checkMaxLength(document.getElementsByName(myObjName)[0]);
}

function initTextareaMaxLengths() {
	var TAs = document.getElementsByTagName("textarea");
	for (var a = 0; a < TAs.length; a++) {
		var TA = TAs.item(a);
		// Must have a name and maxlength for this to work, and not already have a counter
		if (TA && TA.getAttribute("maxlength") && TA.getAttribute("maxlength") > 0 && TA.getAttribute("name") && !bi(TA.name+"_limit")) {
			TA.onkeyup= function(){checkMaxLength(this)};
			TA.onpaste= function(){doTAPaste(this)};
			TA.onkeypress= function(){doKeyPress(this)};
			if (!TA.getAttribute("echomaxlength") || (TA.getAttribute("echomaxlength") && TA.getAttribute("echomaxlength").toLowerCase() == "true")) {
				var br1 = document.createElement("div"); //("br");
				insertAfter(br1,TA);
				var limit = document.createElement("span");
				limit.setAttribute("id",TA.name+"_limit");
				limit.innerHTML = "Limit: " + TA.getAttribute("maxlength") + " Characters";
				insertAfter(limit,br1);
			}
			if (!TA.getAttribute("countmaxlength") || (TA.getAttribute("countmaxlength") && TA.getAttribute("countmaxlength").toLowerCase() == "true")) {
				var used = document.createElement("span");
				used.innerHTML = " &nbsp;&nbsp Used: ";
				if (typeof limit === "object")
					insertAfter(used,limit);
				else
					insertAfter(used,TA);
				var used_ = document.createElement("span");
				used_.setAttribute("id",TA.name+"_used");
				used_.innerHTML = "--";
				insertAfter(used_,used);

				var remaining = document.createElement("span");
				remaining.innerHTML = " &nbsp;&nbsp Remaining: ";
				insertAfter(remaining,used_);
				var remaining_ = document.createElement("span");
				remaining_.setAttribute("id",TA.name+"_remaining");
				remaining_.innerHTML = "--";
				insertAfter(remaining_,remaining);

				var br2 = document.createElement("div"); //("br");
				insertAfter(br2,remaining_);
				var br3 = document.createElement("div"); //("br");
				insertAfter(br3,br2);
			}
			checkMaxLength(TA);
		}
	}	
}

function checkMaxLength(callObj) {
	var maxLength = callObj.getAttribute("maxlength");
	if (maxLength && callObj.value.length > maxLength) {
		callObj.value = callObj.value.substr(0,maxLength);
	}
	bi(callObj.name + "_used").innerHTML = callObj.value.length;
	bi(callObj.name + "_remaining").innerHTML = maxLength - callObj.value.length;
}

function insertAfter(newElement,existingElement) {
	var parent = existingElement.parentNode;
	if (parent.lastchild == existingElement) {
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement,existingElement.nextSibling);
	}
}

// window.onload = initTextareaMaxLengths;

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function createNewWindow(myURL) {
	newWindow = window.open(myURL,"","resizable=no,location=no,status=no,scrollbars=no,toolbar=no,menubar=no,width=650,height=350");
}
function toggle_show_hide(elementId) {
	var el = bi(elementId);
	el.style.display = (el.style.display == 'none') ? 'block' : 'none';
}
