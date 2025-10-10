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
    const brand = await brandService.getAllBrands();
    res.json(brand);
  } catch (err) {
    next(err);
  }
}

export const createBrand = async (req, res, next) => {
  const existingBrand = await brandService.getBrandByName(req.name);

  if (existingBrand) {
    return { created: false, brand: null, existing: existingBrand };
  }

  const newBrand = await brandService.createBrand(req);
  return { created: true, brand: newBrand, existing: null };
};

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
    const brand = await brandService.deleteBrand(req.params.id);
    res.status(204).end("user deleted");
  } catch (err) {
    next(err);
  }
}
