import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import * as go from "gojs";

export default class GraphComponent extends Component {
  @tracked iconName = "check-circle";
  init() {
    this._super(...arguments);
    var $ = go.GraphObject.make;
    var myDiagram = $(go.Diagram, "myDiagramDiv", {
      // enable Ctrl-Z to undo and Ctrl-Y to redo
      "undoManager.isEnabled": true,
    });

    var myModel = $(go.Model);
    // for each object in this Array, the Diagram creates a Node to represent it
    myModel.nodeDataArray = [
      { key: "Alpha" },
      { key: "Beta" },
      { key: "Gamma" },
    ];
    myDiagram.model = myModel;
  }

  @action
  changeIcon() {
    if (this.iconName == "check-circle") {
      this.iconName = "sync-alt";
    } else {
      this.iconName = "check-circle";
    }
  }
}
