
import RESTAdapter from "@ember-data/adapter/rest";

export default RESTAdapter.extend({
  host: "https://my-json-server.typicode.com/dganesh07/ember-link-json",

  pathForType: function (modelName) {
    return "db";
  },
});