// A set of functions to handle actions from the GUI
// Licensed under the GPLv3
// https://www.gnu.org/licenses/gpl-3.0.en.html
// Copyright Ed Haslam 2017

idCount = 0;
lineIdCount = 0;
currMove = null; /* keeps track of which node is being dragged */
selectedNode = null;
selectedLink = null;
clickX = -1;
clickY = -1;
hasMoved = false;

// adds a node
addNode = function(e) {
    var id = (idCount++)+'';
	drawNode(id,'node','nodesGroup');
    addNodeModel(id);
}

// starts the dragging operation
startDrag = function(e) {
	currMove = e.parentNode;
	document.getElementById('stage').addEventListener('mousemove',drag);
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// maintains drag operations for nodes
drag = function(e) {
    hasMoved = true;
    
	// move node
	var dragStage = document.getElementById('dragStage');
	currMove.setAttribute('x',e.clientX-dragStage.getAttribute('x'));
	currMove.setAttribute('y',e.clientY-dragStage.getAttribute('y'));
	
	// update the line
    var links = getLinksFromNodeModel(currMove.id);
    if (links.length != 0) {
        for(var otherNodeId in links) {
        	if (links.hasOwnProperty(otherNodeId)) {
		        var otherNode = document.getElementById(otherNodeId);
		        var linkId = links[otherNodeId];
		        var link = document.getElementById(linkId)
		        			.getElementsByClassName('link')[0];
		        if (isFlowFromModel(currMove.id,linkId)) {
		            updateLine(link,currMove,otherNode)
		        } else {
		            updateLine(link,otherNode,currMove)
		        }
	        }
        }
    }
};

// stops the dragging operation, or if just a click, expand node
stopDrag = function() {
	document.getElementById('stage').removeEventListener('mousemove',drag);
    
    // if a click has occurred
    if (!hasMoved && currMove!=null && selectedNode==null) {
        expandNode(currMove);
    }
        
    hasMoved = false;
}

// starts the panning operation
startBgDrag = function() {
	document.getElementById('stage').addEventListener('mousemove',bgDrag);
}

// ends the panning operation
stopBgDrag = function() {
	document.getElementById('stage').removeEventListener('mousemove',bgDrag);
	clickX = -1;
	clickY = -1;
}

// maintains the panning operation
bgDrag = function(e) {
	var stage = document.getElementById('dragStage');
	
	// reset click coords if first fn call
	if (clickX == -1) {
		clickX = e.clientX;
		clickY = e.clientY;
	}
	
	// get current coordinates
	var x = parseInt(stage.getAttribute('x'));
	var y = parseInt(stage.getAttribute('y'));

	stage.setAttribute('x',x+e.clientX-clickX);
	stage.setAttribute('y',y+e.clientY-clickY);
	
	// change click coords
	clickX = e.clientX;
	clickY = e.clientY;
}

// called when a node is selected. Changes the colour of a node, and if there is already one selected,
// draws a line between the nodes
selectNode = function(node) {
    var nodeOuter = node.parentNode;
    
    // if a link is selected deselect it
	if (selectedLink != null) {
		deselectLinkGUI(selectedLink);
		selectedLink = null;
	}	
    // if the same node has been selected, deselect the node
	if (selectedNode == nodeOuter) {
        deselectNodeGUI(node);
		selectedNode = null;
        
    // if no node has been selected, select this current node
	} else if (selectedNode == null) {
        selectNodeGUI(node);
		selectedNode = nodeOuter;
    
    // if there are two selected nodes, and they are not already linked
    // then link them
	} else if (!isNodesAreLinkedModel(selectedNode.id,nodeOuter.id)) {
		var firstNode = selectedNode;
		var secondNode = nodeOuter;
		
		
		// add line to GUI
		var id = 'l'+(++lineIdCount);
		var line = drawNode(id,'lineOuter','linesGroup').getElementsByClassName('link')[0];
		
		// change marker ID and make the line use that marker
		line.parentNode.getElementsByClassName('marker')[0].setAttribute('id','triangle'+id);
		line.setAttribute('marker-mid','url(#triangle'+id+')');
		
		// move line
		updateLine(line,firstNode,secondNode);
		
		// deselect
		deselectNodeGUI(firstNode);
		selectedNode = null;
		
		// update the rows in the table
		updateRowsTable(secondNode,firstNode);		
		
		// alter model
		addLinkModel(id,firstNode.id,secondNode.id);
	}
}

// updates rows in the table in the node
updateRowsTable = function(node,newNode) {
	links = getLinksFromNodeModel(node);
	
	// for each existing link, we need to add a new row
	//links.forEach(function
	
}

// selects a link for removal, etc
selectLink = function(link) {
	
	// if a node is already selected
	if (selectedNode != null) {
		selectLinkGUI(link);
		selectedNode = null;
	}
	
	// if a link is already selected, deselect
	if(selectedLink!= null) {
		deselectLinkGUI(link);
        selectedLink = null;
	} else {
        // change colour of link and select it
        selectedLink = link.parentNode;
        selectLinkGUI(link);
    }
}

// deletes a node or line
deleteNode = function() {
	// if it is a node
	if (selectedNode != null){
		var links = getLinksFromNodeModel(selectedNode.id);
		removeNodeModel(selectedNode.id);
        
        // remove the links from GUI
        for (var key in links) {
        	if(links.hasOwnProperty(key)) {
        		removeLink(document.getElementById(links[key]));
    		}
        }
        
		// remove the node from GUI
		removeNode(selectedNode.id);
		
		selectedNode = null;
	}
			
	// if it is a line
	if (selectedLink != null) {
		removeLinkModel(selectedLink.id);
        
		// remove line from GUI
		removeLink(selectedLink);
        
		selectedLink = null;
	}
	
}

// opens a node and displays conditional probabilities
expandNode = function(node) {
    setToPercent(node,30);
    
    // first, we need to fade out the widgets not visible in expanded mode
    Array.from(node.getElementsByClassName('rectSmall')).forEach(function(elem) {
		$(elem).fadeOut();
    });
    
    // 
    
    // then we need to expand the node to the size of the table
    // have to make sure to centre the node at all times
    
    // now we can fade in the probability table
}
