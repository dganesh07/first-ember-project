import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";
import { tracked } from "@glimmer/tracking";

export default class EditorComponent extends Component {
  @tracked testValue = htmlSafe("<div>BOOO</div>");
}
