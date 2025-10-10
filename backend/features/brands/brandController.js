import * as brandService from "./brandService.js";
export async function getBrandByUuid(req, res, next) {
  try {
    const brand = await brandService.getBrandByUuid(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found " });
    res.json(brand);
  } catch (err) {
    next(err);
  }
}
export async function getBrandById(req, res, next) {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found " });
    res.json(brand);
  } catch (err) {
    next(err);
  }
}
export async function getAllBrands(req, res, next) {
  try {
    const brands = await brandService.getAllBrands();
    return res.json(brands);
  } catch (err) {
    next(err);
  }
}
export async function createBrand(req, res, next) {
  try {
    const payload = req.body;
    const result = await brandService.createBrand(payload);
    if (result.created === false) {
      // brand exists -> return 200 with existing brand
      return res
        .status(200)
        .json({ message: "Brand already exists", brand: result.existing });
    }
    // created true
    return res.status(201).json(result.brand);
  } catch (err) {
    next(err);
  }
}
export async function autoCompleteBrandsHandler(req, res, next) {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const rows = await brandService.autoCompleteBrands(req.query.q, limit);
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}
export async function updateBrand(req, res, next) {
  try {
    const brand = await brandService.updateBrand(req.params.id, req.body);
    return res.json({ message: "Brand updated", brand });
  } catch (err) {
    next(err);
  }
}
export async function deleteBrand(req, res, next) {
  try {
    await brandService.deleteBrand(req.params.id);
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
}
