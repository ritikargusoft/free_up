import {
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../../features/products/api/productService.js";

const state = () => ({
  list: [],
  total: 0,
  current: null,
  loading: false,
  error: null,
});

const getters = {
  all: (s) => s.list,
  current: (s) => s.current,
  loading: (s) => s.loading,
};

const actions = {
  async fetchProducts({ commit }, params = {}) {
    commit("setLoading", true);
    try {
      const rows = await listProducts(params);
      commit("setList", rows);
    } catch (err) {
      commit("setError", err.message || "Failed to load products");
      throw err;
    } finally {
      commit("setLoading", false);
    }
  },

  async fetchProduct({ commit }, uuid) {
    commit("setLoading", true);
    try {
      const p = await getProduct(uuid);
      commit("setCurrent", p);
      return p;
    } finally {
      commit("setLoading", false);
    }
  },

  async create({ commit }, { productPayload, files = [] }) {
    commit("setLoading", true);
    try {
      const created = await createProduct(productPayload);
      if (files && files.length > 0) {
        const pid = created.product_id;
        for (const f of files) {
          await uploadProductImage(f, pid, false);
        }
      }
      commit("addProduct", created);
      return created;
    } catch (err) {
      commit("setError", err.message || "Create failed");
      throw err;
    } finally {
      commit("setLoading", false);
    }
  },

  async update({ commit }, { uuid, payload }) {
    commit("setLoading", true);
    try {
      const resp = await updateProduct(uuid, payload);
      commit("updateProduct", resp.product || resp);
      return resp;
    } finally {
      commit("setLoading", false);
    }
  },

  async remove({ commit }, uuid) {
    commit("setLoading", true);
    try {
      await deleteProduct(uuid);
      commit("removeProduct", uuid);
    } finally {
      commit("setLoading", false);
    }
  },
};

const mutations = {
  setList(state, rows) {
    state.list = rows;
  },
  setCurrent(state, p) {
    state.current = p;
  },
  setLoading(state, v) {
    state.loading = v;
  },
  setError(state, e) {
    state.error = e;
  },
  addProduct(state, p) {
    state.list.unshift(p);
  },
  updateProduct(state, up) {
    state.list = state.list.map((p) =>
      p.product_uuid === up.product_uuid ? up : p
    );
    if (state.current?.product_uuid === up.product_uuid) state.current = up;
  },
  removeProduct(state, uuid) {
    state.list = state.list.filter((p) => p.product_uuid !== uuid);
    if (state.current?.product_uuid === uuid) state.current = null;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
