import Route from "@ember/routing/route";

export default class ApplicationRoute extends Route {
  model(params = {}) {
    return this.store
      .findAll("post")
      .then((post) => {
        /*Iterate here*/
        //console.log("in router", post.toArray());
        return post.toArray();
      })
      .catch((error) => {
        /*Do something to inform user about network/server/request error here*/
      });
  }
}
