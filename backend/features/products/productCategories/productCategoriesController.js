import * as productCategoryService from "./productCategoriesService.js"

export async function addCategories(req,res,next) {
    try {
        const {product_id, category_ids} = req.body;
        const inserted = await productCategoryService.addCategoriesToProduct(product_id,category_ids);
        return res.status(201).json({inserted});
    } catch (err) {
        next (err)
    }
}

export async function getCategoriesForProduct(req,res,next) {

    try {
         const product_id = Number(req.params.product_id);
    if(!product_id) return res.status(400).json({message:"Invalid product_id"});
    const rows = await productCategoryService.listCategoriesForProduct(product_id);
    return res.json(rows);
    } catch (err) {
        next(err)
    }
}

export async function deleteCategoryMapping(req,res,next) {
    try {
        const product_id = Number(req.params.product_id);
        const category_id = Number(req.params.category_id);
        const deleted = await productCategoryService.removeCategoryFromProduct(product_id,category_id);
        return res.status(200).json({deleted})
    } catch (err) {
        next(err)
    }
    
}

export async function replaceCategories(req,res,next) {
    try {
        const product_id = Number(req.body.product_id);
        const category_ids= req.body.category_ids || [];
        const rows = await productCategoryService.replaceCategoriesForProduct(product_id,category_ids);
        return res.json({categories:rows}) 
    } catch (err) {
        next(err)
    }
}