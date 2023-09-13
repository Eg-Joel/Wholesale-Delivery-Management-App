const {
  adminRegister,
  adminLogin,
  addVendors,
  addProducts,
  getVendorsList,
  getVendor,
  editVendor,
  deleteVendor,
  getProductsList,
  editProduct,
  deleteProduct,
  getOrders,
  getTruckDriversList,
} = require("../controllers/adminController");
const { verifyTokenAdmin } = require("../middlewares/verifyToken");
const router = require("express").Router();

//register
router.post("/register", adminRegister);

//login
router.post("/login", adminLogin);

//get vendors list 
router.get("/getTruckDriversList", verifyTokenAdmin, getTruckDriversList);

//add vendor
router.post("/addVendors", verifyTokenAdmin, addVendors);

//get vendors list 
router.get("/getVendors", verifyTokenAdmin, getVendorsList);

//get vendor 
router.get("/getVendor/:id", verifyTokenAdmin, getVendor);

//Edit vendor
router.put("/editVendor/:id", verifyTokenAdmin,editVendor );

//delete vendor
router.delete("/deleteVendor/:id", verifyTokenAdmin,deleteVendor );

//add products
router.post("/addProducts", verifyTokenAdmin, addProducts);

//get product list 
router.get("/getProducts/:id", verifyTokenAdmin, getProductsList);

//Edit product
router.put("/editProduct/:id", verifyTokenAdmin,editProduct );

//delete product
router.delete("/deleteProduct/:id", verifyTokenAdmin,deleteProduct );

//get orders
router.get("/getOrders", verifyTokenAdmin, getOrders);


module.exports = router;
