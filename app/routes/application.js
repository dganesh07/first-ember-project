import Route from "@ember/routing/route";

export default class ApplicationRoute extends Route {
  model(params = {}) {
    return this.store
      .findAll("node")
      .then((node) => {
        return node.toArray();
      })
      .catch((error) => {
        /*Do something to inform user about network/server/request error here*/
      });
  }
}
