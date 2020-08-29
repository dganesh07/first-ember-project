import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import * as go from "gojs";

export default class GraphComponent extends Component {
  @tracked iconName = "check-circle";
  $ = go.GraphObject.make;

  @action
  setupChart() {
    var $ = this.$;
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
    this.testFunc();

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
        // this tooltip Adornment is shared by all nodes
        toolTip: $(
          "ToolTip",
          $(
            go.TextBlock,
            { margin: 4 }, // the tooltip shows the result of calling nodeInfo(data)
            new go.Binding("text", "", this.nodeInfo)
          )
        ),
        // this context menu Adornment is shared by all nodes
        contextMenu: partContextMenu,
      }
    );

    myDiagram.linkTemplate = $(
      go.Link,
      { selectionObjectName: "LINK-TEXT" },
      { toShortLength: 3, relinkableFrom: true, relinkableTo: true }, // allow the user to relink existing links
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
        // this tooltip Adornment is shared by all links
        toolTip: $(
          "ToolTip",
          $(
            go.TextBlock,
            { margin: 2 }, // the tooltip shows the result of calling linkInfo(data)
            new go.Binding("text", "", this.linkInfo)
          )
        ),
        // the same context menu Adornment is shared by all links
        contextMenu: partContextMenu,
      }
    );

    myDiagram.toolTip = $(
      "ToolTip",
      $(
        go.TextBlock,
        { margin: 4 },
        new go.Binding("text", "", this.diagramInfo)
      )
    );

    myDiagram.contextMenu = $(
      "ContextMenu",
      this.makeButton(
        "Paste",
        function (e, obj) {
          e.diagram.commandHandler.pasteSelection(
            e.diagram.toolManager.contextMenuTool.mouseDownPoint
          );
        },
        function (o) {
          return o.diagram.commandHandler.canPasteSelection(
            o.diagram.toolManager.contextMenuTool.mouseDownPoint
          );
        }
      ),
      this.makeButton(
        "Undo",
        function (e, obj) {
          e.diagram.commandHandler.undo();
        },
        function (o) {
          return o.diagram.commandHandler.canUndo();
        }
      ),
      this.makeButton(
        "Redo",
        function (e, obj) {
          e.diagram.commandHandler.redo();
        },
        function (o) {
          return o.diagram.commandHandler.canRedo();
        }
      )
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

  nodeInfo(d) {
    // Tooltip info for a node data object
    var str = "Node " + d.key + ": " + d.text + "\n";
    if (d.group) str += "member of " + d.group;
    else str += "top-level node";
    return str;
  }

  testFunc() {
    console.log("testFunc");
  }

  linkInfo(d) {
    // Tooltip info for a link data object
    return "Link:\nfrom " + d.from + " to " + d.to;
  }

  diagramInfo(model) {
    // Tooltip info for the diagram's model
    return (
      "Model:\n" +
      model.nodeDataArray.length +
      " nodes, " +
      model.linkDataArray.length +
      " links"
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
