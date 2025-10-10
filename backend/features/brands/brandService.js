import * as brandModel from "./brandModel.js";

export async function getBrandById(id) {
  const brand = await brandModel.getBrandsById(id);
  if (!brand) throw new Error("Brand not found");
  return brand;
}
export async function getBrandByUuid(uuid) {
  const brand = await brandModel.getBrandsByUuid(uuid);
  if (!brand)
    throw Object.assign(new Error("Brand not found"), { status: 404 });
  return brand;
}
export async function getBrandByName(name) {
  return await brandModel.getBrandByName(name);
}
export async function getAllBrands() {
  const brands = await brandModel.getAllBrands();
  return brands;
}
export async function createBrand(data) {
  if (!data || !data.name)
    throw Object.assign(new Error("Enter the name of a brand"), {
      status: 400,
    });
  // check existance by name (case-insensitive)
  const existing = await brandModel.getBrandByName(data.name);
  if (existing) {
    return { created: false, existing };
  }
  const brand = await brandModel.createBrand({
    name: data.name,
    description: data.description ?? null,
  });
  return { created: true, brand };
}
export async function autoCompleteBrands(q, limit = 8) {
  return await brandModel.autoCompleteBrands(q, limit);
}
export async function updateBrand(brand_uuid, data) {
  const brand = await brandModel.updateBrand(brand_uuid, data);
  if (!brand)
    throw Object.assign(new Error("Brand not found"), { status: 404 });
  return brand;
}
export async function deleteBrand(brand_uuid) {
  const deleted = await brandModel.deleteBrand(brand_uuid);
  if (!deleted)
    throw Object.assign(new Error("Brand not found"), { status: 404 });
  return deleted;
}
