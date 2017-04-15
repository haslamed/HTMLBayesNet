// A shared set of SVG animation tricks
// Licensed under the GPLv3
// https://www.gnu.org/licenses/gpl-3.0.en.html
// Copyright Ed Haslam 2017

// places the relevant sprite on the stage
function drawNode(id,refId,groupID) {
	// place new node
	var newNode = document.getElementById(refId).cloneNode(true);
	newNode.setAttribute('id',id);
	newNode.setAttribute('x','10');
	newNode.setAttribute('y','10');
	document.getElementById(groupID).appendChild(newNode);
	
	return newNode;
}

function removeNode(id) {
	var elem = document.getElementById(id);
	elem.parentNode.removeChild(elem);
}

function removeLink(link) {
	link.parentNode.removeChild(link);
}

// updates the position of a line
function updateLine(line,fromNode,toNode){
	// get new coordinates for line
	var fromX = parseInt(fromNode.getAttribute('x'))+50;
	var fromY = parseInt(fromNode.getAttribute('y'))+25;
	var toX = parseInt(toNode.getAttribute('x'))+50;
	var toY = parseInt(toNode.getAttribute('y'))+25;
	var path = "M "+fromX+" "+fromY+" L "+(toX>fromX?(toX-fromX)/2+fromX:(fromX-toX)/2+toX)
					 +" "+(toY>fromY?(toY-fromY)/2+fromY:(fromY-toY)/2+toY)+" "+toX+" "+toY;

	// update line
	line.setAttribute('d',path);
	
	// update clickable line
	line.parentNode.getElementsByClassName('clickLine')[0].setAttribute('d',path);
}

// changes the colour change position in the node
function setToPercent(node,percent) {
    node.getElementsByClassName('progressBar')[0].setAttribute('width',percent+'%');
}

// sets a link to graphically appear selected
function selectLinkGUI(link) {
    link.parentNode.setAttribute('stroke','red');
    link.parentNode.setAttribute('fill','red');
}

// sets a node to graphically appear selected
function selectNodeGUI(node) {
    node.setAttribute('fill','white');
}

// sets a link to graphically appear deselected
function deselectLinkGUI(link) {
    link.parentNode.setAttribute('stroke','black');
    link.parentNode.setAttribute('fill','black');
}

// sets a node to graphically appear deselected
function deselectNodeGUI(node) {
    node.getElementsByClassName('add')[0].setAttribute('fill','red');
}

// adds a new row to the probability table
function addNewRowGUI(node,label) {
	var table = node.getElementById('probTable');
	
	// create new row
	var row = table.firstChild.cloneNode(true);
	
	// set a new label
	row.firstChild.innerHTML = label;
	
	// add to the table
	table.appendChild(row);
	
}
