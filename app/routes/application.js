import Route from "@ember/routing/route";

export default class ApplicationRoute extends Route {
  model(params = {}) {
    this.store.findAll("post").then(function (post) {
        console.log("here")
      console.log(post);
    });
    return this.store.findAll("post");
  }
}
