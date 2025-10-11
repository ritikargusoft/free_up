import * as categoryService from "./categoryService.js";

export async function getCategoryByUuid(req, res, next) {
  try {
    const category = await categoryService.getCategoryByUuid(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found " });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function getCategoryById(req, res, next) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found " });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function getAllCategories(req, res, next) {
  try {
    const categories = await categoryService.getAllCategories();
    return res.json(categories);
  } catch (err) {
    next(err);
  }
}
export async function createCategory(req, res, next) {
  try {
    const payload = req.body;
    const result = await categoryService.createCategory(payload);
    if (result.created === false) {
      return res
        .status(200)
        .json({
          message: "Category already exists",
          category: result.existing,
        });
    }
    // created true
    return res.status(201).json(result.category);
  } catch (err) {
    next(err);
  }
}

export async function autoCompleteCategoryHandler(req, res, next) {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const rows = await categoryService.autoCompleteCategory(req.query.q, limit);
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    return res.json({ message: "Category updated", category });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    await categoryService.deleteCategory(req.params.id);
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
}
