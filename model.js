// Holds the internal representation of the bayesian net
// Functions should be called when changes in the GUI are
// made
// Current model assumes all variables are binary
// Licensed under the GPLv3
// https://www.gnu.org/licenses/gpl-3.0.en.html
// Copyright Ed Haslam 2017

var nodes = {};
var links = {}; // {uid:[node1Uid,node2]}

// prototype for node
nodeType = function(uid) {
    this.uid = ""+uid;
    this.links = {};
    this.label = "";
    this.evidence = null;
    this.probTable = ['dummy',0]; // structure: if a number, is a leaf probability
                              // if not a number, first uid is true uid, other
                              // is false
}

// adds a node to the model
addNodeModel = function(uid) {
    nodes[uid] = new nodeType(uid);
    links[uid] = [];
}

// adds a link to the model - node1Uid is the node
// that the flow comes from
addLinkModel = function(uid, node1Uid,node2Uid) {
    nodes[node1Uid].links[node2Uid] = uid;
    nodes[node2Uid].links[node1Uid] = uid;
    links[uid] = [node1Uid,node2Uid];
    
    // expand probability table
    addToProbTableModel(node2Uid,node1Uid);
}

// removes a node from the model
removeNodeModel = function(uid) {
    // remove all links of the node
    $.each(nodes[uid].links, function(otherNode,val){
        delete nodes[otherNode].links[uid];
        delete links[val];
    });
    
    // remove node
    delete nodes[uid];
}

// removes a link from the model
removeLinkModel = function(uid) {
    var node1 = links[uid][0];
    var node2 = links[uid][1];
    
    delete nodes[node1].links[node2];
    delete nodes[node2].links[node1];
    delete links[uid];
}

// updates the node label
updateNodeLabelModel = function(uid,text) {
    nodes[uid].label = text;
}

// updates a conditional probability
// given should be a node uid
// givenStates should be the priors of the given state:
// {uidPrior:true/false,}
// if there isn't enough information to update the table, 
// a false boolean will be returned
updateCondProbModel = function(value,given,givenStates) {
	getLeafTableModel(nodes[given].probTable,givenStates)[1] = value;
}

// sets evidence on a node
setEvidenceModel = function(uid,state) {
    
}

// requests a probability for a particular node
getProbabilityModel = function(uid) {
    
}

// gets the links associated with a node
// returns a dict of {nodeLinkTo:linkID}
getLinksFromNodeModel = function(uid) {
    return nodes[uid].links;
}

// gets the nodes associated with a link
getNodesFromLinkModel = function(uid) {
    
}

// returns true if two nodes are already linked
isNodesAreLinkedModel = function(uid1,uid2) {
	return nodes[uid1].links.hasOwnProperty(uid2);
}

// returns true if the link provided flows from the node provided
isFlowFromModel = function(nodeUid,linkUid) {
    if (links[linkUid][0]==nodeUid)
    	return true;
	return false;
}

/* ------- Internal functions, should not be called externally ------- */

// gets a leaf node of a probability table
getLeafTableModel = function(table,givenStates) {
	// if this state is true
	if(givenStates[table[0][0]]) {
		// if we are at the root node, return
		if(typeof table[0][1] != "list")
			return table[0];
	} else if(givenStates[table[1][0]]) {
		// if we are at the root node, return
		if(typeof table[0][1] != "list")
			return table[0];
	// otherwise not enough parameters were given
	} else {
		throw new ProbTableException
					('Not enough parameters for lookup',givenStates,table);
	}
}

// first uid is the node that the flow goes to, second is from
addToProbTableModel = function(toUid, fromUid) {
    recurseProbTableModel(nodes[toUid].probTable,fromUid);
}

// recurses down the probability table tree, and adds new branches at the
// root
recurseProbTableModel = function(branch,uid) {
    // if we're at a leaf, add some new branches
    if(typeof branch[1] != "list") {
        branch[1] = [[uid,0],[uid,0]];
    // if at an internal node, recurse down tree
    } else {
        recurseProbTableModel(branch[1][0],uid);
        recurseProbTableModel(branch[1][1],uid);
    }
}

// Exception for working with probability tables
ProbTableException = function(message,givenStates,table) {
	this.message = message;
	this.givenStates = givenStates;
	this.table = table;
}
