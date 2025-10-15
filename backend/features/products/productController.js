import * as productService from "./productService.js";

export async function createProduct(req, res, next) {
  try {
    const payload = req.body;
    const user = req.user;
    const created = await productService.createProduct(payload, user);
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product_uuid = req.params.id;
    const p = await productService.getProductByUuid(product_uuid);
    return res.json(p);
  } catch (err) {
    next(err);
  }
}
export async function listProducts(req, res, next) {
  try {
    const q = req.query;
    const filters = {
      limit: q.limit ? Number(q.limit) : undefined,
      offset: q.offset ? Number(q.offset) : undefined,
      seller_uuid: q.seller_uuid || undefined,
      brand_id: q.brand_id ? Number(q.brand_id) : undefined,
      status: q.status || undefined,
      target_audience: q.target_audience || undefined,
      q: q.q || undefined,
      category_id: q.category_id ? Number(q.category_id) : undefined,
      orderBy: q.orderBy || undefined,
      orderDir: q.orderDir || undefined,
    };
    const rows = await productService.listProducts(filters);
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}
export async function updateProduct(req, res, next) {
  try {
    const product_uuid = req.params.id;
    const payload = req.body;
    const user = req.user;
    const updated = await productService.updateProductByUuid(
      product_uuid,
      payload,
      user
    );
    return res.json({ message: "Product updated", product: updated });
  } catch (err) {
    next(err);
  }
}
export async function deleteProduct(req, res, next) {
  try {
    const product_uuid = req.params.id;
    const deleted = await productService.deleteProduct(product_uuid, req.user);
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
}
