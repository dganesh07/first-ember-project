import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class EditorComponent extends Component {
  @tracked testValue = htmlSafe(
    `<div> ${Math.random().toString(36).substring(7)}</div>`
  );

  //   @action
  //   getContent() {
  //     this.testValue = htmlSafe(
  //       `<div> ${Math.random().toString(36).substring(7)} </div>`
  //     );
  //   }
}
