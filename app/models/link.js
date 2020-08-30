import Model, { attr } from "@ember-data/model";

export default class LinkModel extends Model {
  @attr from;
  @attr to;
  @attr color;
  @attr text;
}
