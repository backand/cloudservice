(function () {

angular.module('common.directives')
  .directive('bkndFlowChart', function () {
    return {
      restrict: 'E',
      templateUrl: "common/directives/flowchart/flowchart.html",
      replace: true,
      scope: {
        chart: "=chart",
        onUpdate: '&',
        showModelControls: '=',
        onIconClick: '&',
        editField: '&',
        selectedNode: '='
      },
      controller: FlowchartCtrl,
      controllerAs: 'flowchartCtrl',
      bindToController: true,
      link: function (scope) {
        if (scope.flowchartCtrl.selectedNode) {
          var node = scope.flowchartCtrl.chartViewModel.findNode(scope.flowchartCtrl.selectedNode);
          if (node) {
            scope.flowchartCtrl.chartViewModel.handleNodeClicked(node);
          }
        }
      }
    };
  });

function FlowchartCtrl () {

  var self = this;

	var deleteKeyCode = 46;
	var ctrlKeyCode = 17;
	var ctrlDown = false;
	var aKeyCode = 65;
	var escKeyCode = 27;
	var nextNodeID = 10;

  self.updateChart = function () {
    if (self.chartViewModel.data !== self.chart) {
      angular.copy(self.chartViewModel.data, self.chart);
      self.onUpdate();
    }
  };

	self.keyDown = function (evt) {

		if (evt.keyCode === ctrlKeyCode) {

			ctrlDown = true;
			evt.stopPropagation();
			evt.preventDefault();
		}
	};

	self.keyUp = function (evt) {

		if (evt.keyCode === deleteKeyCode) {
			self.chartViewModel.deleteSelected();
		}

		if (evt.keyCode == aKeyCode && ctrlDown) {
			self.chartViewModel.selectAll();
		}

		if (evt.keyCode == escKeyCode) {
			self.chartViewModel.deselectAll();
		}

		if (evt.keyCode === ctrlKeyCode) {
			ctrlDown = false;

			evt.stopPropagation();
			evt.preventDefault();
		}
	};

	self.addNewNode = function () {

		var nodeName = prompt("Enter a node name:", "New node");
		if (!nodeName) {
			return;
		}

    //TODO: fix new node model
		var newNodeDataModel = {
			name: nodeName,
			id: nextNodeID++,
			x: 0,
			y: 0,
			inputConnectors: [
				{
					name: "X"
				},
				{
					name: "Y"
				},
				{
					name: "Z"
				}
			],
			outputConnectors: [
				{
					name: "1"
				},
				{
					name: "2"
				},
				{
					name: "3"
				}
			]
		};

		self.chartViewModel.addNode(newNodeDataModel);
	};

	self.addNewInputConnector = function () {
		var connectorName = prompt("Enter a connector name:", "New connector");
		if (!connectorName) {
			return;
		}

		var selectedNodes = self.chartViewModel.getSelectedNodes();
		for (var i = 0; i < selectedNodes.length; ++i) {
			var node = selectedNodes[i];
			node.addInputConnector({
				name: connectorName
			});
		}
	};

	self.addNewOutputConnector = function () {
		var connectorName = prompt("Enter a connector name:", "New connector");
		if (!connectorName) {
			return;
		}

		var selectedNodes = self.chartViewModel.getSelectedNodes();
		for (var i = 0; i < selectedNodes.length; ++i) {
			var node = selectedNodes[i];
			node.addOutputConnector({
				name: connectorName
			});
		}
	};

	self.deleteSelected = function () {
		self.chartViewModel.deleteSelected();
	};

	self.chartViewModel = new flowchart.ChartViewModel(self.chart);
}

})();
