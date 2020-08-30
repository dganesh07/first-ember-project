// import RESTAdapter from "@ember-data/adapter/rest";

// export default RESTAdapter.extend({
//   host: "https:/jsonplaceholder.typicode.com",

//   pathForType: function (modelName) {
//     return pluralize(modelName);
//   },
// });

import RESTAdapter from "@ember-data/adapter/rest";

export default RESTAdapter.extend({
  host: "https://my-json-server.typicode.com/dganesh07/ember-node-json",

  pathForType: function (modelName) {
    return "link";
  },
});

