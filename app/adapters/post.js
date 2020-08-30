// import { pluralize } from "ember-inflector";
// import JSONAPIAdapter from "@ember-data/adapter/json-api";

// export default JSONAPIAdapter.extend({
//   host: "https://my-json-server.typicode.com/dganesh07/ember-node-json",
//   //host: "https:/jsonplaceholder.typicode.com",
//   pathForType: function (modelName) {
//     return "db";
//   },
// });


import RESTAdapter from "@ember-data/adapter/rest";

export default RESTAdapter.extend({
  host: "https://my-json-server.typicode.com/dganesh07/ember-node-json",

  pathForType: function (modelName) {
    return "db";
  },
});
