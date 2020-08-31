import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";
import { tracked } from "@glimmer/tracking";
import randomWords from "random-words";

export default class EditorComponent extends Component {
  @tracked editorOne = this.generateRandomParagraph();
  @tracked editorTwo = this.generateRandomParagraph();
  @tracked editorThree = this.generateRandomParagraph();
  @tracked editorFour = this.generateRandomParagraph();
  @tracked editorFive = this.generateRandomParagraph();

  generateRandomParagraph() {
    return htmlSafe(
      `<div> ${randomWords({
        min: 50,
        max: 300,
        join: " ",
      })}</div>`
    );
  }
}
