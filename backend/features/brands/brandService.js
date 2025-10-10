import * as brandModel from "./brandModel.js";

export async function getBrandById(id) {
  const brand = await brandModel.getBrandsById(id);
  if (!brand) throw new Error("Brand not found");
  return brand;
}

export async function getBrandByUuid(Uuid) {
  const brand = await brandModel.getBrandsByUuid(Uuid);
  if (!brand) throw new Error("Brand not found");
  return brand;
}


export async function getBrandByName(name) {
  const brand = await brandModel.getBrandByName(name);
  return brand;
}


export async function getAllBrands() {
  const brands = await brandModel.getAllBrands();
  return brands.map((b) => {
    return b;
  });
}

export async function createBrand(data) {
  if (!data.name) throw new Error("Enter the name of a brand ");
  const existing = await brandModel.getBrandByName(data.name);
  if (existing) {
    return { created: false, existing: true };
  }

  const brand = await brandModel.createBrand({
    name: data.name,
    description: data.description ?? null,
  });
}

export async function autoCompleteBrands(q, limit = 8) {
  return await brandModel.autoCompleteBrands(q,limit)
}


export async function updateBrand(brand_uuid, data) {

      const brand = await brandModel.updateBrand(brand_uuid, data);
        if (!brand) {
          const err = new Error("Brand not found");
          err.status = 404;
          throw err;
        }
        return brand;

}


export async function deleteBrand(brand_uuid) {

      const brand = await brandModel.deleteBrand(brand_uuid);
        if (!brand) {
          const err = new Error("Brand not found");
          err.status = 404;
          throw err;
        }
        return brand;

}