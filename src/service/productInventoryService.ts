

export default class ProductInventoryService {

  getInventoryCountByProductId(productId : String) : String {
    console.log(`getProductInventory with productId ${productId}`);
    return "getInventoryCountByProductId";
  }

  async getInventoryInfoByProductId(productId : String) : Promise<String> {
    console.log(`getProductInventory with productId ${productId}`);
    return "getInventoryCountByProductId";
  }
}