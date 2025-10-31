import {
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  listProductImages, 
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
      const rowsWithThumb = await Promise.all(
        (rows || []).map(async (p) => {
          try {
            const imgs = await listProductImages(p.product_id);
            if (Array.isArray(imgs) && imgs.length > 0) {
              p.thumbnail_url = imgs[0].img_url;
              p.images = imgs;
            } else {
              p.thumbnail_url = p.thumbnail_url || null;
              p.images = [];
            }
          } catch (e) {
            p.thumbnail_url = p.thumbnail_url || null;
            p.images = p.images || [];
            console.error("Failed fetching images for product", p.product_id, e);
          }
          return p;
        })
      );
      commit("setList", rowsWithThumb);
    } catch (err) {
      console.error("Fetch products error:", err);
      commit("setError", err.message || "Failed to load products");
      throw err;
    } finally {
      commit("setLoading", false);
    }
  },
  async fetchProduct({ commit }, uuid) {
    commit("setLoading", true);
    try {
      const product = await getProduct(uuid);
      try {
        const imgs = await listProductImages(product.product_id);
        product.images = imgs || [];
        if (imgs && imgs.length) product.thumbnail_url = imgs[0].img_url;
      } catch (e) {
        product.images = product.images || [];
      }
      commit("setCurrent", product);
      return product;
    } catch (err) {
      console.error("Fetch product error:", err);
      commit("setError", err.message || "Failed to fetch product");
      throw err;
    } finally {
      commit("setLoading", false);
    }
  },
  async create({ commit }, { productPayload, files = [] }) {
    commit("setLoading", true);
    try {
      const created = await createProduct(productPayload);
      created.images = created.images || [];
      if (files && files.length > 0) {
        const pid = created.product_id;
        for (const f of files) {
          try {
            const imgResp = await uploadProductImage(f, pid, false);
            if (imgResp) {
              created.images.push(imgResp);
              if (!created.thumbnail_url && imgResp.img_url) {
                created.thumbnail_url = imgResp.img_url;
              }
            }
          } catch (imgErr) {
            console.error("Image upload failed for product", created.product_id, imgErr);
          }
        }
      }
      commit("addProduct", created);
      return created;
    } catch (err) {
      console.error("Create product error:", err);
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
      const updated = resp.product || resp;
      commit("updateProduct", updated);
      return updated;
    } catch (err) {
      console.error("Update product error:", err);
      commit("setError", err.message || "Update failed");
      throw err;
    } finally {
      commit("setLoading", false);
    }
  },
  async remove({ commit }, uuid) {
    commit("setLoading", true);
    try {
      await deleteProduct(uuid);
      commit("removeProduct", uuid);
    } catch (err) {
      console.error("Delete product error:", err);
      commit("setError", err.message || "Delete failed");
      throw err;
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
    state.list = state.list.map((p) => (p.product_uuid === up.product_uuid ? up : p));
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