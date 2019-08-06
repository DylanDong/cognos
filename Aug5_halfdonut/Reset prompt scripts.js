<script>

var paulScripts ={}

  , oCR = cognos.Report.getReport("_THIS_");



paulScripts.clearPrompts = function(){

  var ctrls = oCR.prompt.getControls()

    , len = ctrls.length;



  for(var i=0;i<len;++i){

    ctrls[i].clearValues();

  }

};



function getMethods(myObject)

{

  var funcs=[]

  for(var name in myObject)

  {

    funcs.push(name)

  }

  return  funcs.join(', ');

};



paulScripts.getSource = function()

{

    var targ;

    if (!e) var e = window.event;

    if(!e) return false;

    if (e.target) targ = e.target;

    else if (e.srcElement) targ = e.srcElement;

    if (targ.nodeType == 3) // defeat Safari bug

      targ = targ.parentNode;

    return targ;

};



paulScripts.getControl = function(promptName) {

  return oCR.prompt.getControlByName(promptName);

};



paulScripts.resetPrompt= function(promptName,defaultValue){

  if(!defaultValue) {

    paulScripts.getControl(promptName).clearValues();

  }

  else if(defaultValue=='clearDate') {

    document.getElementById('txtDate' + paulScripts.getControl(promptName)._id_).value='';

  }

  else {  

    paulScripts.getControl(promptName).setValues(defaultValue);

  }

}



function stopEvent(e) {



  if(!e) var e = window.event;

  

  //e.cancelBubble is supported by IE -

  // this will kill the bubbling process.

  e.cancelBubble = true;

  e.returnValue = false;



  //e.stopPropagation works only in Firefox.

  if ( e.stopPropagation ) e.stopPropagation();

  if ( e.preventDefault ) e.preventDefault();



  return false;

}



/* paulScripts.resetPrompts

 * Paul Mendelson - 2014-03-30

 * This will take an array containing JSON describing the default values for each 

 * prompt. passing false will resolve to clearing the prompt. This uses the the

 * standard Prompt API JSON, so [use:stuff] or [startDate:2012-02-01] etc.

 */

paulScripts.resetPrompts = function(promptValues){

  var promptLen = promptValues.length;



  for (var i=0;i<promptLen;++i){

    paulScripts.resetPrompt(promptValues[i].name,promptValues[i].defaults)

  }

}





// simple date libraries

// please don't use these. There are plenty of really really awesome date libraries. I recommend XDate.

paulScripts.date={};

paulScripts.date.yesterday = function(){

  var td = new Date()

}



paulScripts.date.getSunday=function () {

  var td = new Date()

    , dw = td.getDay();

  return new Date(td.setDate(td.getDate() - dw));

};



paulScripts.date.getSaturday=function () {

  var td = new Date()

    , dw = td.getDay();

  return new Date(td.setDate(td.getDate() + (6-dw)));

};



Date.prototype.iso8601= function() {         

  var yyyy = this.getFullYear().toString()

  , mm = (this.getMonth()+1).toString()

  , dd = this.getDate().toString();             

   return yyyy + '-' + (mm.length==2?mm:'0'+mm) + '-' + (dd.length==2?dd:'0'+dd);

};  



</script>



<input type="button" onclick="paulScripts.resetPrompts(

  [

    {'name':'singleText','defaults':[ {'use' : 'Default text for the singleText'} ]}

    , {'name':'multiText','defaults':

       [{'use' : 'Default 1 for the multiText'} 

      , {'use' : 'Default 2 for the multiText'} 

      , {'use' : 'Default 3 for the multiText'} ]}

    , {'name':'singleValue','defaults':false}

    , {'name':'multiValue','defaults':paulScripts.getControl('multiValueDefaults').getValues()}

    , {'name':'singleDate','defaults':'clearDate'}

    , {'name':'dateRange','defaults':[

        {'start': 

          {'use':paulScripts.date.getSunday().iso8601()}

        ,'end':

         {'use': paulScripts.date.getSaturday().iso8601()}

        }

       ]}

    , {'name':'multiDateRange','defaults':

       [

        {'start': 

          {'use':paulScripts.date.getSunday().iso8601()}

        ,'end':

         {'use': paulScripts.date.getSaturday().iso8601()}

        }

        ,{'end':

         {'use': paulScripts.date.getSaturday().iso8601()}

        }

        ,{'start': 

          {'use':paulScripts.date.getSunday().iso8601()}

        }

       ]

}

  ]

);" value="Reset Prompts" />



<input type="button" onclick="paulScripts.clearPrompts()" value="Clear Prompts"/>