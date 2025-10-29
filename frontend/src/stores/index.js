import { createStore } from "vuex";
import auth from "./modules/auth.js";
import products from "./modules/products.js";
export default createStore({
  modules: { auth, products },
});
