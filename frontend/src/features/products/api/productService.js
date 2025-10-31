import api from "../../../plugins/axios.js";
export const listProducts = (params = {}) =>
  api.get("/products", { params }).then((r) => r.data);
export const getProduct = (product_uuid) =>
  api.get(`/products/${product_uuid}`).then((r) => r.data);
export const createProduct = (payload) =>
  api.post("/products", payload).then((r) => r.data);
export const updateProduct = (product_uuid, payload) =>
  api.put(`/products/${product_uuid}`, payload).then((r) => r.data);
export const deleteProduct = (product_uuid) =>
  api.delete(`/products/${product_uuid}`).then((r) => r.data);
// signature used by store: uploadProductImage(file, product_id, is_thumbnail)
export const uploadProductImage = (file, product_id, is_thumbnail = false) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("product_id", String(product_id));
  fd.append("is_thumbnail", String(Boolean(is_thumbnail)));
  return api
    .post("/product-image/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};
// NEW: list images for a product (returns array of images)
export const listProductImages = (product_id) =>
  api.get(`/product-image/product/${product_id}`).then((r) => r.data);
export const autoCompleteBrands = (q, limit = 8) =>
  api.get("/brands/autoComplete", { params: { q, limit } }).then((r) => r.data);
export const autoCompleteCategories = (q, limit = 8) =>
  api.get("/categories/autoComplete", { params: { q, limit } }).then((r) => r.data);





