import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ApplicationRoute extends Route {
  @service store;

  async model() {
    let responseData = {
      link: [],
      node: [],
    };
    await Promise.all([
      this.store.findAll("node"),
      this.store.findAll("link"),
    ]).then((response) => {
      response.map((data) => {
        responseData[data.modelName] = data.toArray();
      });
    });
    return responseData;
  }
}
