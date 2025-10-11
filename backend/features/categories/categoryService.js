import * as categoryModel from "./categoryModel.js";

export async function getCategoryById(id) {
  const Category = await categoryModel.getCategoryById(id);
  if (!Category) throw new Error("Category not found");
  return Category;
}

export async function getCategoryByUuid(uuid) {
  const Category = await categoryModel.getCategoryByUuid(uuid);
  if (!Category)
    throw Object.assign(new Error("Category not found"), { status: 404 });
  return Category;
}

export async function getCategoryByName(name) {
  return await categoryModel.getCategoryByName(name);
}

export async function getAllCategories() {
  const Categories = await categoryModel.getAllCategories();
  return Categories;
}

export async function createCategory(data) {
  if (!data || !data.name)
    throw Object.assign(new Error("Enter the name of a Category"), {
      status: 400,
    });
  // check existance by name (case-insensitive)
  const existing = await categoryModel.getCategoryByName(data.name);
  if (existing) {
    return { created: false, existing };
  }
  const Category = await categoryModel.createCategory({
    name: data.name,
    description: data.description ?? null,
  });
  return { created: true, Category };
}

export async function autoCompleteCategory(q, limit = 8) {
  return await categoryModel.autoCompleteCategory(q, limit);
}

export async function updateCategory(brand_uuid, data) {
  const Category = await categoryModel.updateCategory(brand_uuid, data);
  if (!Category)
    throw Object.assign(new Error("Category not found"), { status: 404 });
  return Category;
}

export async function deleteCategory(brand_uuid) {
  const deleted = await categoryModel.deleteCategory(brand_uuid);
  if (!deleted)
    throw Object.assign(new Error("Category not found"), { status: 404 });
  return deleted;
}
