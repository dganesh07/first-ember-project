import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import * as go from "gojs";

export default class GraphComponent extends Component {
  @tracked iconName = "check-circle";
  @tracked iconText = "saved";
  $ = go.GraphObject.make;

  get goJsData() {
    return this.args.graphDataObject;
  }

  buildGraphData() {
    var nodeArray = [];
    var linkArray = [];
    var dataObject = this.goJsData;
    Object.keys(dataObject).map(function (key, index) {
      dataObject[key].map((elem) => {
        if (key == "node") {
          nodeArray.pushObject(elem.toJSON());
        } else {
          linkArray.pushObject(elem.toJSON());
        }
      });
    });
    return {
      node: nodeArray,
      link: linkArray,
    };
  }

  @action
  setupChart() {
    var $ = this.$;

    var myDiagram = $(go.Diagram, "myDiagramDiv", {
      "clickCreatingTool.archetypeNodeData": { text: "Node", color: "white" },
      "undoManager.isEnabled": true,
    });

    let GraphData = this.buildGraphData();

    var nodeDataArray = GraphData["node"];
    var linkDataArray = GraphData["link"];
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    var self = this;
    var partContextMenu = $(
      "ContextMenu",
      this.makeButton(
        "Font Change",
        function (e, obj) {
          self.changeFontSize(obj, 2);
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

      // {
      //   fromSpot: go.Spot.AllSides,
      //   toSpot: go.Spot.AllSides,
      //   fromLinkable: true,
      //   toLinkable: true,
      //   locationSpot: go.Spot.Center,
      // },
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
          // Setting an inital font
          font: "normal normal bold 10px Georgia, Serif",
          stroke: "#333",
          margin: 8, // make some extra space for the shape around the text
          isMultiline: false, // don't allow newlines in text
          editable: true, // allow in-place editing by user
        },
        new go.Binding("font", "font").makeTwoWay(),
        new go.Binding("text", "text").makeTwoWay()
      ),
      {
        contextMenu: partContextMenu,
      }
    );

    myDiagram.linkTemplate = $(
      go.Link,
      { selectionObjectName: "LINK-TEXT" },
      // {
      //   reshapable: true,
      //   resegmentable: true,
      //   relinkableFrom: true,
      //   relinkableTo: true,
      //   adjusting: go.Link.Stretch,
      // },
      $(
        go.Shape,
        { strokeWidth: 2 },
        new go.Binding("stroke", "color").makeTwoWay()
      ),
      $(
        go.Shape,
        { toArrow: "Standard", stroke: null },
        new go.Binding("fill", "color").makeTwoWay()
      ),
      $(
        go.TextBlock,
        { name: "LINK-TEXT", font: "normal normal bold 20px Georgia, Serif" }, // this is a Link label
        new go.Binding("text", "text").makeTwoWay(),
        new go.Binding("font", "font").makeTwoWay()
      ),
      {
        contextMenu: partContextMenu,
      }
    );
  }

  makeButton(text, action, visiblePredicate) {
    return this.$(
      "ContextMenuButton",
      this.$(go.TextBlock, text),
      { click: action },
      visiblePredicate
        ? new go.Binding("visible", "", function (o, e) {
            return o.diagram ? visiblePredicate(o, e) : false;
          }).ofObject()
        : {}
    );
  }

  changeFontSize(obj) {
    var self = this;
    var adorn = obj.part;
    adorn.diagram.startTransaction("Change Text Size");
    this.changeIcon();
    var object;

    var link = adorn.adornedPart.findObject("LINK-TEXT");
    var node = adorn.adornedPart.findObject("NODE-TEXT");

    let existingFont;
    let newFont;
    if (node) {
      existingFont = parseInt(node.font.split(" ")[3].replace("px", ""));
      newFont = existingFont * 2;
      object = node;
    } else if (link) {
      existingFont = parseInt(link.font.split(" ")[3].replace("px", ""));
      newFont = existingFont / 2;
      object = link;
    }

    object.font = `normal normal bold ${newFont}px Georgia, Serif`;
    adorn.diagram.commitTransaction("Change Text Size");

    setTimeout(function () {
      self.changeIcon();
    }, 5000);
  }

  @action
  changeIcon() {
    if (this.iconName == "check-circle") {
      this.iconName = "sync-alt";
      this.iconText = "saving";
    } else {
      this.iconName = "check-circle";
      this.iconText = "saved";
    }
  }
}
