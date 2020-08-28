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
      { key: 3, text: "Gamma", color: "lightgreen", group: 5 },
      { key: 4, text: "Delta", color: "pink", group: 5 },
      { key: 5, text: "Epsilon", color: "green", isGroup: true },
    ];
    var linkDataArray = [
      { from: 1, to: 2, color: "blue" },
      { from: 2, to: 2 },
      { from: 3, to: 4, color: "green" },
      { from: 3, to: 1, color: "purple" },
    ];
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    this.testFunc();

    var partContextMenu = $(
      "ContextMenu",
      this.makeButton("Properties", function (e, obj) {
        // OBJ is this Button
        var contextmenu = obj.part; // the Button is in the context menu Adornment
        var part = contextmenu.adornedPart; // the adornedPart is the Part that the context menu adorns
        // now can do something with PART, or with its data, or with the Adornment (the context menu)
        if (part instanceof go.Link) alert(this.linkInfo(part.data));
        else if (part instanceof go.Group) alert(groupInfo(contextmenu));
        else alert(this.nodeInfo(part.data));
      }),
      this.makeButton(
        "Cut",
        function (e, obj) {
          e.diagram.commandHandler.cutSelection();
        },
        function (o) {
          return o.diagram.commandHandler.canCutSelection();
        }
      ),
      this.makeButton(
        "Copy",
        function (e, obj) {
          e.diagram.commandHandler.copySelection();
        },
        function (o) {
          return o.diagram.commandHandler.canCopySelection();
        }
      ),
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
        "Delete",
        function (e, obj) {
          e.diagram.commandHandler.deleteSelection();
        },
        function (o) {
          return o.diagram.commandHandler.canDeleteSelection();
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
      ),
      this.makeButton(
        "Group",
        function (e, obj) {
          e.diagram.commandHandler.groupSelection();
        },
        function (o) {
          return o.diagram.commandHandler.canGroupSelection();
        }
      ),
      this.makeButton(
        "Ungroup",
        function (e, obj) {
          e.diagram.commandHandler.ungroupSelection();
        },
        function (o) {
          return o.diagram.commandHandler.canUngroupSelection();
        }
      )
    );

    myDiagram.nodeTemplate = $(
      go.Node,
      "Auto",
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
          font: "bold 14px sans-serif",
          stroke: "#333",
          margin: 6, // make some extra space for the shape around the text
          isMultiline: false, // don't allow newlines in text
          editable: true, // allow in-place editing by user
        },
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
      { toShortLength: 3, relinkableFrom: true, relinkableTo: true }, // allow the user to relink existing links
      $(go.Shape, { strokeWidth: 2 }, new go.Binding("stroke", "color")),
      $(
        go.Shape,
        { toArrow: "Standard", stroke: null },
        new go.Binding("fill", "color")
      ),
      {
        // this tooltip Adornment is shared by all links
        toolTip: $(
          "ToolTip",
          $(
            go.TextBlock,
            { margin: 4 }, // the tooltip shows the result of calling linkInfo(data)
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

  @action
  changeIcon() {
    if (this.iconName == "check-circle") {
      this.iconName = "sync-alt";
    } else {
      this.iconName = "check-circle";
    }
  }
}
