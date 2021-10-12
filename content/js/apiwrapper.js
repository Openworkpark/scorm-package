/*******************************************************************************
**
** FileName: APIWrapper.js
**
*******************************************************************************/

/*******************************************************************************
**
** Concurrent Technologies Corporation (CTC) grants you ("Licensee") a non-
** exclusive, royalty free, license to use, modify and redistribute this
** software in source and binary code form, provided that i) this copyright
** notice and license appear on all copies of the software; and ii) Licensee does
** not utilize the software in a manner which is disparaging to CTC.
**
** This software is provided "AS IS," without a warranty of any kind.  ALL
** EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING ANY
** IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-
** INFRINGEMENT, ARE HEREBY EXCLUDED.  CTC AND ITS LICENSORS SHALL NOT BE LIABLE
** FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
** DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO EVENT WILL CTC  OR ITS
** LICENSORS BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT,
** INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER
** CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, ARISING OUT OF THE USE OF
** OR INABILITY TO USE SOFTWARE, EVEN IF CTC  HAS BEEN ADVISED OF THE POSSIBILITY
** OF SUCH DAMAGES.
**
*******************************************************************************/

/*******************************************************************************
** This file is part of the ADL Sample API Implementation intended to provide
** an elementary example of the concepts presented in the ADL Sharable
** Content Object Reference Model (SCORM).
**
** The purpose in wrapping the calls to the API is to (1) provide a
** consistent means of finding the LMS API implementation within the window
** hierarchy and (2) to validate that the data being exchanged via the
** API conforms to the defined CMI data types.
**
** This is just one possible example for implementing the API guidelines for
** runtime communication between an LMS and executable content components.
** There are several other possible implementations.
**
** Usage: Executable course content can call the API Wrapper
**      functions as follows:
**
**    javascript:
**          var result = doLMSInitialize();
**          if (result != true)
**          {
**             // handle error
**          }
**
**    authorware
**          result := ReadURL("javascript:doLMSInitialize()", 100)
**
*******************************************************************************/

var _Debug = false;  // set this to false to turn debugging off
                     // and get rid of those annoying alert boxes.

// Define exception/error codes
var _NoError = 0;
var _GeneralException = 101;
var _ServerBusy = 102;
var _InvalidArgumentError = 201;
var _ElementCannotHaveChildren = 202;
var _ElementIsNotAnArray = 203;
var _NotInitialized = 301;
var _NotImplementedError = 401;
var _InvalidSetValue = 402;
var _ElementIsReadOnly = 403;
var _ElementIsWriteOnly = 404;
var _IncorrectDataType = 405;


// local variable definitions
var apiHandle = null;
var API = null;
var findAPITries = 0;

var debug = false;  // set this to false to turn debugging off

var output = window.console; // output can be set to any object that has a log(string) function
                             // such as: var output = { log: function(str){alert(str);} };

// Define exception/error codes
var _NoError = {"code":"0","string":"No Error","diagnostic":"No Error"};;
var _GeneralException = {"code":"101","string":"General Exception","diagnostic":"General Exception"};
var _AlreadyInitialized = {"code":"103","string":"Already Initialized","diagnostic":"Already Initialized"};

var initialized = false;

// local variable definitions
var apiHandle = null;


/*******************************************************************************
**
** Function: doLMSInitialize()
** Inputs:  None
** Return:  CMIBoolean true if the initialization was successful, or
**          CMIBoolean false if the initialization failed.
**
** Description:
** Initialize communication with LMS by calling the LMSInitialize
** function which will be implemented by the LMS.
**
*******************************************************************************/
function doLMSInitialize()
{
   if (initialized) return "true";
   
   var api = getAPIHandle();
   if (api == null)
   {
      message("Unable to locate the LMS's API Implementation.\nInitialize was not successful.");
      return "false";
   }

   var result = api.Initialize("");

   if (result.toString() != "true")
   {
      var err = ErrorHandler();
      message("Initialize failed with error code: " + err.code);
   }
   else
   {
      initialized = true;
   }

   return result.toString();
}

/*******************************************************************************
**
** Function doLMSFinish()
** Inputs:  None
** Return:  CMIBoolean true if successful
**          CMIBoolean false if failed.
**
** Description:
** Close communication with LMS by calling the LMSFinish
** function which will be implemented by the LMS
**
*******************************************************************************/
function doLMSFinish()
{  
   if (! initialized) return "true";
   
   var api = getAPIHandle();
   if (api == null)
   {
      message("Unable to locate the LMS's API Implementation.\nTerminate was not successful.");
      return "false";
   }
   else
   {
      // call the Terminate function that should be implemented by the API
      var result = api.Terminate("");
      if (result.toString() != "true")
      {
         var err = ErrorHandler();
         message("Terminate failed with error code: " + err.code);
      }
   }
   
   initialized = false;

   return result.toString();
}

/*******************************************************************************
**
** Function doLMSGetValue(name)
** Inputs:  name - string representing the cmi data model defined category or
**             element (e.g. cmi.core.student_id)
** Return:  The value presently assigned by the LMS to the cmi data model
**       element defined by the element or category identified by the name
**       input value.
**
** Description:
** Wraps the call to the LMS LMSGetValue method
**
*******************************************************************************/
function doLMSGetValue(name)
{
   var api = getAPIHandle();
   var result = "";
   if (api == null)
   {
      message("Unable to locate the LMS's API Implementation.\nGetValue was not successful.");
   }
   else if (!initialized && ! api.Initialize())
   {
      var err = ErrorHandler();
      message("GetValue failed - Could not initialize communication with the LMS - error code: " + err.code);
   }
   else
   {
      result = api.GetValue(name);
      
      var error = ErrorHandler();
      if (error.code != _NoError.code)
      {
         // an error was encountered so display the error description
         message("GetValue("+name+") failed. \n"+ error.code + ": " + error.string);
         result = "";
      }
   }
   return result.toString();
}

/*******************************************************************************
**
** Function doLMSSetValue(name, value)
** Inputs:  name -string representing the data model defined category or element
**          value -the value that the named element or category will be assigned
** Return:  CMIBoolean true if successful
**          CMIBoolean false if failed.
**
** Description:
** Wraps the call to the LMS LMSSetValue function
**
*******************************************************************************/
function doLMSSetValue(name, value)
{
   var api = getAPIHandle();
   var result = "false";
   if (api == null)
   {
      message("Unable to locate the LMS's API Implementation.\nSetValue was not successful.");
   }
   else if (!initialized && !api.Initialize())
   {
      var error = ErrorHandler();
      message("SetValue failed - Could not initialize communication with the LMS - error code: " + error.code);
   }
   else
   {
      result = api.SetValue(name, value);
      if (result.toString() != "true")
      {
         var err = ErrorHandler();
         message("SetValue("+name+", "+value+") failed. \n"+ err.code + ": " + err.string);
      }
   }

   return result.toString();
}

/*******************************************************************************
**
** Function doLMSCommit()
** Inputs:  None
** Return:  None
**
** Description:
** Call the LMSCommit function
**
*******************************************************************************/
function doLMSCommit()
{
   var api = getAPIHandle();
   var result = "false";
   if (api == null)
   {
      message("Unable to locate the LMS's API Implementation.\nCommit was not successful.");
   }
   else if (!initialized && ! api.Initialize())
   {
      var error = ErrorHandler();
      message("Commit failed - Could not initialize communication with the LMS - error code: " + error.code);
   }
   else
   {
      result = api.Commit("");
      if (result != "true")
      {
         var err = ErrorHandler();
         message("Commit failed - error code: " + err.code);
      }
   }

   return result.toString();
}

/*******************************************************************************
**
** Function doLMSGetLastError()
** Inputs:  None
** Return:  The error code that was set by the last LMS function call
**
** Description:
** Call the LMSGetLastError function
**
*******************************************************************************/
function doLMSGetLastError()
{
   var api = getAPIHandle();
   if (api == null)
   {
      message("Unable to locate the LMS's API Implementation.\nGetLastError was not successful.");
      //since we can't get the error code from the LMS, return a general error
      return _GeneralException.code;
   }

   return api.GetLastError().toString();
}

/*******************************************************************************
**
** Function doLMSGetErrorString(errorCode)
** Inputs:  errorCode - Error Code
** Return:  The textual description that corresponds to the input error code
**
** Description:
** Call the LMSGetErrorString function
**
********************************************************************************/
function doLMSGetErrorString(errorCode)
{
   var api = getAPIHandle();
   if (api == null)
   {
      message("Unable to locate the LMS's API Implementation.\nGetErrorString was not successful.");
      return _GeneralException.string;
   }

   return api.GetErrorString(errorCode).toString();
}

/*******************************************************************************
**
** Function doLMSGetDiagnostic(errorCode)
** Inputs:  errorCode - Error Code(integer format), or null
** Return:  The vendor specific textual description that corresponds to the
**          input error code
**
** Description:
** Call the LMSGetDiagnostic function
**
*******************************************************************************/
function doLMSGetDiagnostic(errorCode)
{
   var api = getAPIHandle();
   if (api == null)
   {
      message("Unable to locate the LMS's API Implementation.\nGetDiagnostic was not successful.");
      return "Unable to locate the LMS's API Implementation. GetDiagnostic was not successful.";
   }

   return api.GetDiagnostic(errorCode).toString();
}

/*******************************************************************************
**
** Function LMSIsInitialized()
** Inputs:  none
** Return:  true if the LMS API is currently initialized, otherwise false
**
** Description:
** Determines if the LMS API is currently initialized or not.
**
*******************************************************************************/
function LMSIsInitialized()
{
   // there is no direct method for determining if the LMS API is initialized
   // for example an LMSIsInitialized function defined on the API so we'll try
   // a simple LMSGetValue and trap for the LMS Not Initialized Error

   var api = getAPIHandle();
   if (api == null)
   {
      //alert("Unable to locate the LMS's API Implementation.\nLMSIsInitialized() failed.");
      return false;
   }
   else
   {
      var value = api.LMSGetValue("cmi.learner_name");
      var errCode = api.LMSGetLastError().toString();
      if (errCode == _NotInitialized)
      {
         return false;
      }
      else
      {
         return true;
      }
   }
}

/*******************************************************************************
**
** Function ErrorHandler()
** Inputs:  None
** Return:  The current value of the LMS Error Code
**
** Description:
** Determines if an error was encountered by the previous API call
** and if so, displays a message to the user.  If the error code
** has associated text it is also displayed.
**
*******************************************************************************/
function ErrorHandler()
{
   var error = {"code":_NoError.code, "string":_NoError.string, "diagnostic":_NoError.diagnostic};
   var api = getAPIHandle();
   if (api == null)
   {
      message("Unable to locate the LMS's API Implementation.\nCannot determine LMS error code.");
      error.code = _GeneralException.code;
      error.string = _GeneralException.string;
      error.diagnostic = "Unable to locate the LMS's API Implementation. Cannot determine LMS error code.";
      return error;
   }

   // check for errors caused by or from the LMS
   error.code = api.GetLastError().toString();
   if (error.code != _NoError.code)
   {
      // an error was encountered so display the error description
      error.string = api.GetErrorString(error.code);
      error.diagnostic = api.GetDiagnostic("");
   }

   return error;
}

/******************************************************************************
**
** Function getAPIHandle()
** Inputs:  None
** Return:  value contained by APIHandle
**
** Description:
** Returns the handle to API object if it was previously set,
** otherwise it returns null
**
*******************************************************************************/
function getAPIHandle()
{
   if (apiHandle == null)
   {
      apiHandle = getAPI();
   }

   return apiHandle;
}


/*******************************************************************************
**
** Function findAPI(win)
** Inputs:  win - a Window Object
** Return:  If an API object is found, it's returned, otherwise null is returned
**
** Description:
** This function looks for an object named API in parent and opener windows
**
*******************************************************************************/
function findAPI(win)
{
   var findAPITries = 0;
   while ((win.API_1484_11 == null) && (win.parent != null) && (win.parent != win))
   {
      findAPITries++;
      
      if (findAPITries > 500) 
      {
         message("Error finding API -- too deeply nested.");
         return null;
      }
      
      win = win.parent;

   }
   return win.API_1484_11;
}



/*******************************************************************************
**
** Function getAPI()
** Inputs:  none
** Return:  If an API object is found, it's returned, otherwise null is returned
**
** Description:
** This function looks for an object named API, first in the current window's
** frame hierarchy and then, if necessary, in the current window's opener window
** hierarchy (if there is an opener window).
**
*******************************************************************************/
function getAPI()
{
   var theAPI = findAPI(window);
   if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined"))
   {
      theAPI = findAPI(window.opener);
   }
   if (theAPI == null)
   {
      message("Unable to find an API adapter");
   }
   return theAPI
}

/*******************************************************************************
**
** Function findObjective(objId)
** Inputs:  objId - the id of the objective
** Return:  the index where this objective is located 
**
** Description:
** This function looks for the objective within the objective array and returns 
** the index where it was found or it will create the objective for you and return 
** the new index.
**
*******************************************************************************/
function findObjective(objId) 
{
    var num = doGetValue("cmi.objectives._count");
    var objIndex = -1;

    for (var i=0; i < num; ++i) {
        if (doGetValue("cmi.objectives." + i + ".id") == objId) {
            objIndex = i;
            break;
        }
    }

    if (objIndex == -1) {
        message("Objective " + objId + " not found.");
        objIndex = num;
        message("Creating new objective at index " + objIndex);
        doSetValue("cmi.objectives." + objIndex + ".id", objId);
    }
    return objIndex;
}

/*******************************************************************************
** NOTE: This is a SCORM 2004 4th Edition feature.
*
** Function findDataStore(id)
** Inputs:  id - the id of the data store
** Return:  the index where this data store is located or -1 if the id wasn't found
**
** Description:
** This function looks for the data store within the data array and returns 
** the index where it was found or returns -1 to indicate the id wasn't found 
** in the collection.
**
** Usage:
** var dsIndex = findDataStore("myds");
** if (dsIndex > -1)
** {
**    doSetValue("adl.data." + dsIndex + ".store", "save this info...");
** }
** else
** {
**    var appending_data = doGetValue("cmi.suspend_data");
**    doSetValue("cmi.suspend_data", appending_data + "myds:save this info");
** }
*******************************************************************************/
function findDataStore(id) 
{
    var num = doGetValue("adl.data._count");
    var index = -1;
    
    // if the get value was not null and is a number 
    // in other words, we got an index in the adl.data array
    if (num != null && ! isNaN(num))
    { 
       for (var i=0; i < num; ++i) 
       {
           if (doGetValue("adl.data." + i + ".id") == id) 
           {
               index = i;
               break;
           }
       }
   
       if (index == -1) 
       {
           message("Data store " + id + " not found.");
       }
    }
    
    return index;
}

/*******************************************************************************
**
** Function message(str)
** Inputs:  String - message you want to send to the designated output
** Return:  none
** Depends on: boolean debug to indicate if output is wanted
**             object output to handle the messages. must implement a function 
**             log(string)
**
** Description:
** This function outputs messages to a specified output. You can define your own 
** output object. It will just need to implement a log(string) function. This 
** interface was used so that the output could be assigned the window.console object.
*******************************************************************************/
function message(str)
{
   if(debug)
   {
      output.log(str);
   }
}


