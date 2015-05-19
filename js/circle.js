function circle (circleNumber) {

	/**

	Give me the div id you want made into a circle and I'll do it.

	*/

	var pronouncementContainerHeight;
	var contentHeight;

	// Identify the pronouncement by number
	var pronouncementContainer = "#pronouncementContainer" + circleNumber;
	//var content = "#content" + circleNumber;
	var content = $(pronouncementContainer).children(".content");

	// Set the height variables
	pronouncementContainerHeight = $(pronouncementContainer).width();
	contentHeight = $(content).height();

	//	Apply the height variables
	$(pronouncementContainer).height( pronouncementContainerHeight );
	// Center it
	//$(pronouncementContainer).css('padding-top', ((pronouncementContainerHeight-contentHeight)/2));

}

function circleAsset () {
	/**
     * I just set the asset circle heights. They're all the same.
     */

	//var assetHeight;

	// Set the height variables
	//assetHeight = $('.asset').width();

	//	Apply the height variables
	//$('.asset').height( assetHeight );

}

function lineDimensions (circle1, circle2) {

	/**
     * Give me two circles, I'll figure out the line properties.
     */

	var lineID = "#" + circle1 + "-" + circle2;
	var circle1 = "#" + circle1;
	var circle2 = "#" + circle2;
	var node1 = $(circle1).children(".node");
	var node2 = $(circle2).children(".node");

	var circle1BootstrapOffset = 0; //+$(circle1).css("margin-left").replace("px", "");
	var circle2BootstrapOffset = 0; //+$(circle2).css("margin-left").replace("px", "");

	var node1Position = $(node1).offset();
	var node2Position = $(node2).offset();

	var x1 = circle1BootstrapOffset + node1Position.left + ($(node1).width() / 2);
	var y1 = node1Position.top + ($(node1).height() / 2);
	var x2 = circle2BootstrapOffset + node2Position.left + ($(node2).width() / 2);
	var y2 = node2Position.top + ($(node2).height() / 2);

	return {
		lineID: lineID,
		x1: x1,
		y1: y1,
		x2: x2,
		y2: y2
	};

}

function lineDimensions2 (node1, node2, uniqueID) {

	/**

	Give me two node objects, I'll figure out the line properties.

	*/

	var lineID = uniqueID;

	var node1Position = $(node1).offset();
	var node2Position = $(node2).offset();

	var x1 = node1Position.left + ($(node1).width() / 2);
	var y1 = node1Position.top + ($(node1).height() / 2);
	var x2 = node2Position.left + ($(node2).width() / 2);
	var y2 = node2Position.top + ($(node2).height() / 2);

	return {
		lineID: lineID,
		x1: x1,
		y1: y1,
		x2: x2,
		y2: y2
	};

}


function connector (svgns, lineProperties, color) {

	var line = document.createElementNS(svgns, 'line');
	line.setAttributeNS(null, 'x1', lineProperties.x1);
	line.setAttributeNS(null, 'y1', lineProperties.y1);
	line.setAttributeNS(null, 'x2', lineProperties.x2);
	line.setAttributeNS(null, 'y2', lineProperties.y2);
	line.setAttributeNS(null, 'stroke-width', 1);
	line.setAttributeNS(null, 'stroke', color);
	line.setAttributeNS(null, 'id', lineProperties.lineID);
	document.getElementById('line-container').appendChild(line);

}

function sequentialConnector (i) {

	/**

	Give me a number, and I'll connect two "pronouncements" sequentially

	*/

	var circle1 = "pronouncementContainer" + i;
	var circle2 = "pronouncementContainer" + (i+1);

	return lineDimensions(circle1, circle2);
}

function classConnector (svgns, className) {

	/**
     * Give me a className and I'll connect every unique id within that class
	 */

	var numberOfPronouncementsPerClass = allClasses[className].length;

	for (i=0; i < numberOfPronouncementsPerClass-1; i++) {
		connector(svgns,
                  lineDimensions(allClasses[className][i], allClasses[className][i+1]),
                  color[className][0]);
	}

}

function classConnectorRefresher (svgns, className) {

	/**
     * Give me a className and I'll re-connect every unique id within that class
     * using existing lines.
	 */

	var numberOfPronouncementsPerClass = allClasses[className].length;
	var lineID = "";
	var lineProperties = [];
	var circle1, circle2, line;

	for (i=0; i < numberOfPronouncementsPerClass-1; i++) {

		circle1 = allClasses[className][i];
		circle2 = allClasses[className][i+1];

		lineID = "#" + circle1 + "-" + circle2;
		lineProperties = lineDimensions(circle1, circle2);

		networkRefresher (svgns, lineProperties);
	}

}


function nodeConclusionLines (svgns, connectorOrRefresher) {

    /**
     * Pass me a workspace & I'll connect or refresh all the nodes to their
     * section's conclusions.
     *
     * Workspaces are static, so I'll create a unique ID so the lines can be
     * refrenced later.
     */

    var nodeConclusion;
    var nodesInSection;
	var lineProperties = [];
	var uniqueID;

    // For each section in the document
    $("section").each(function(sectionNumber) {

        // Find the total # of nodes, and the conclusion node
        nodesInSection = $(this).find(".node");
        nodeConclusion = $(".nodeConclusion", this);

        for (var j=0; j<nodesInSection.length;  j++) {
        	uniqueID = sectionNumber + "." + j;

            // Create the line that will link THIS node & the SECTION'S conclusion
            lineProperties = lineDimensions2(nodesInSection.eq(j), nodeConclusion, uniqueID);
            // Pass it to the function that actually draws these lines
            connectorOrRefresher(svgns, lineProperties, "#aaaaaa");
        }
    });
}

function colorByClass (className) {

	/**
	 * Give me a className and I'll color it properly
	 */

	$(className).css({'border-color': color[className][0]});
	$(className).css({'color': color[className][2]});
}

function networkRefresher (svgns, lineProperties, defaultColor) {

	var line = document.getElementById(lineProperties.lineID);
	line.setAttribute('x1', lineProperties.x1);
	line.setAttribute('y1', lineProperties.y1);
	line.setAttribute('x2', lineProperties.x2);
	line.setAttribute('y2', lineProperties.y2);

}

function drawScreen (svgns, numberOfPronouncements) {

	var sequentialColorLink = "black";

	// Turn every div'd "pronouncement" into a circle
	for (i=1; i < numberOfPronouncements+1; i++) {
		circle(i);
	}

	// Connect every unique "id" within a "class" via a line
	// Color of the line determined by the color of the class
	// Color of the circle's border determined by the color of the class

	for (key in allClasses) {
		classConnector(svgns, key);
		colorByClass(key);
	}

    // Connect every SECTION'S "nodes" with the SECTION'S "conclusion."
    nodeConclusionLines(svgns, connector);

	circleAsset();
}

function parseNetwork (className) {

	var classIDArray = [];
	var i=0;

	$(className).each(function () {
		// If the div has an 'id'
		if ($(this).attr('id')) {
			classIDArray[i] = $(this).attr('id');
			i++;
		}
	});

	return classIDArray;

}