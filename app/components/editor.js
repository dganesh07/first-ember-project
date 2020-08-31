import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import randomParagraph from "random-paragraph";

export default class EditorComponent extends Component {
  @tracked testValue = htmlSafe(`<div> ${randomParagraph()}</div>`);

}
