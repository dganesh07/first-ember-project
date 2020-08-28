import Component from "@glimmer/component";
import go from "gojs";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

//const $ = go.GraphObject.make;

export default class GraphComponent extends Component {
  @tracked iconName = "check-circle";

  @action
  changeIcon() {
    if (this.iconName == "check-circle") {
      this.iconName = "sync-alt";
    } else {
      this.iconName = "check-circle";
    }
  }
}
