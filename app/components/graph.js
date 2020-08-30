import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import * as go from "gojs";

export default class GraphComponent extends Component {
  @tracked iconName = "check-circle";
  $ = go.GraphObject.make;
  // constructor() {
  //   super(...arguments);
  //   console.log("here", this.args.test);

  //   // this.args.test
  //   //   .toArray()
  //   //   .forEach((element) => console.log(element).toJSON());

  //   console.log(this.goJsData());

  // }

  get goJsData() {
    return this.args.test;
  }

  @action
  setupChart() {
    var $ = this.$;
    this.goJsData.map((elem) => console.log(elem.toJSON()));
    var myDiagram = $(go.Diagram, "myDiagramDiv", {
      // enable Ctrl-Z to undo and Ctrl-Y to redo
      "clickCreatingTool.archetypeNodeData": { text: "Node", color: "white" },
      "undoManager.isEnabled": true,
    });

    var nodeDataArray = [
      { key: 1, text: "Alpha", color: "lightblue" },
      { key: 2, text: "Beta", color: "orange" },
      { key: 3, text: "Gamma", color: "lightgreen" },
      { key: 4, text: "Delta", color: "pink" },
      { key: 5, text: "Epsilon", color: "red" },
    ];
    var linkDataArray = [
      { from: 1, to: 2, color: "blue", text: "alpha-link" },
      { from: 2, to: 3, color: "yellow", text: "beta-link" },
      { from: 3, to: 4, color: "green", text: "gamma-link" },
      { from: 4, to: 5, color: "purple", text: "delta-link" },
      { from: 5, to: 1, color: "purple", text: "epsilon-link" },
    ];
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    var self = this;
    var partContextMenu = $(
      "ContextMenu",
      this.makeButton(
        "Font Change",
        function (e, obj) {
          self.changeTextSize(obj, 2);
        },
        function (o) {
          return o.diagram.commandHandler.canCutSelection();
        }
      ),
      this.makeButton(
        "Delete",
        function (e, obj) {
          e.diagram.commandHandler.deleteSelection();
        },
        function (o) {
          return o.diagram.commandHandler.canDeleteSelection();
        }
      )
    );

    myDiagram.nodeTemplate = $(
      go.Node,
      "Auto",
      { selectionObjectName: "NODE-TEXT" },
      { locationSpot: go.Spot.Center },
      $(
        go.Shape,
        "RoundedRectangle",
        {
          fill: "white", // the default fill, if there is no data bound value
          portId: "",
          cursor: "pointer", // the Shape is the port, not the whole Node
          // allow all kinds of links from and to this port
          fromLinkable: true,
          fromLinkableSelfNode: true,
          fromLinkableDuplicates: true,
          toLinkable: true,
          toLinkableSelfNode: true,
          toLinkableDuplicates: true,
        },
        new go.Binding("fill", "color")
      ),
      $(
        go.TextBlock,
        {
          name: "NODE-TEXT",
          font: "bold 10px sans-serif",
          stroke: "#333",
          margin: 8, // make some extra space for the shape around the text
          isMultiline: false, // don't allow newlines in text
          editable: true, // allow in-place editing by user
        },
        new go.Binding("font", "font").makeTwoWay(),
        new go.Binding("text", "text").makeTwoWay()
      ), // the label shows the node data's text
      {
        // this context menu Adornment is shared by all nodes
        contextMenu: partContextMenu,
      }
    );

    myDiagram.linkTemplate = $(
      go.Link,
      { selectionObjectName: "LINK-TEXT" },
      { relinkableFrom: true, relinkableTo: true }, // allow the user to relink existing links
      $(go.Shape, { strokeWidth: 2 }, new go.Binding("stroke", "color")),
      $(
        go.Shape,
        { toArrow: "Standard", stroke: null },
        new go.Binding("fill", "color")
      ),
      $(
        go.TextBlock,
        { name: "LINK-TEXT" }, // this is a Link label
        new go.Binding("text", "text")
      ),
      {
        // the same context menu Adornment is shared by all links
        contextMenu: partContextMenu,
      }
    );
  }

  makeButton(text, action, visiblePredicate) {
    return this.$(
      "ContextMenuButton",
      this.$(go.TextBlock, text),
      { click: action },
      // don't bother with binding GraphObject.visible if there's no predicate
      visiblePredicate
        ? new go.Binding("visible", "", function (o, e) {
            return o.diagram ? visiblePredicate(o, e) : false;
          }).ofObject()
        : {}
    );
  }

  changeTextSize(obj, factor) {
    var adorn = obj.part;
    adorn.diagram.startTransaction("Change Text Size");
    var object;

    var link = adorn.adornedPart.findObject("LINK-TEXT");
    var node = adorn.adornedPart.findObject("NODE-TEXT");

    if (node) {
      var node = adorn.adornedPart;
      object = node;
    } else if (link) {
      var link = adorn.adornedPart;
      object = link;
      factor = 1 / 2;
    }
    object.scale *= factor;
    adorn.diagram.commitTransaction("Change Text Size");
    //adorn.diagram.requestUpdate();
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
