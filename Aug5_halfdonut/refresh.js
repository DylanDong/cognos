<script>
function clearRefresh() {

var oCR = cognos.Report.getReport("_THIS_");

var vDMN = oCR.prompt.getControlByName("Data Model Name");
var vTN = oCR.prompt.getControlByName("Target Name");

vDMN.clearValues();
vTN.clearValues();

oCR.sendRequest (cognos.Report.Action.REPROMPT);

} </script>

<button style="" class="clsPromptButton" onmouseover="this.className = 'clsPromptButtonOver'" onmouseout="this.className = 'clsPromptButton'"
onClick="clearRefresh()">Clear</button>