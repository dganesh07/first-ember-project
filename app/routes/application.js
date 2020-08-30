import Route from "@ember/routing/route";

export default class ApplicationRoute extends Route {
  model(params = {}) {
    var data = {
      link: [],
      node: [],
    };
    return this.store
      .findAll("node")
      .then((node) => {
        data["node"] = node.toArray();
        this.store.findAll("link").then((link) => {
          console.log("in link call");
          data["link"] = link.toArray();
        });
        return data;
      })
      .catch((error) => {
        /*Do something to inform user about network/server/request error here*/
      });
  }
}
