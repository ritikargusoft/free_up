import { createBrandsTable } from "../repository/brandRepository.js";
import { createCategoryTable } from "../repository/categoryRepository.js";
import { createOrderItemTable } from "../repository/orderItemRepository.js";
import { createOrdersTable } from "../repository/ordersRepository.js";
import { createProductCategoriesTable } from "../repository/productCategoriesRepository.js";
import { createProductImageTable } from "../repository/productImageRepository.js";
import { createProductsTable } from "../repository/productRepository.js";
import { createUsersTable } from "../repository/userRepository.js";

const createTables = async () => {
  try {
     createUsersTable();
     createProductsTable(),
       createProductImageTable(),
       createBrandsTable(),
       createCategoryTable(),
       createProductCategoriesTable(),
       createOrderItemTable(),
       createOrdersTable(),
      console.log("Tables Created");
  } catch (error) {
    console.log(error);
  }
};

export default createTables;
