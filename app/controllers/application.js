import Controller from "@ember/controller";
import { reads } from "@ember/object/computed";

export default class ApplicationController extends Controller {
  items = reads("model");
}
