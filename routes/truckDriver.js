const { truckDriverRegister, truckDriverLogin, editTDsProfile, addToCart, getOrders } = require("../controllers/TruckDriverController");
const { getVendorsList, getProductsList } = require("../controllers/adminController");
const {  verifyToken } = require("../middlewares/verifyToken");

const router = require("express").Router()


//register
router.post("/register",truckDriverRegister)

//login
router.post("/login",truckDriverLogin)

//Edit vendor
router.put("/editTDprofile", verifyToken,editTDsProfile ); 

//get vendors list 
router.get("/getVendors", verifyToken, getVendorsList);

//get product list 
router.get("/getProducts/:id", verifyToken, getProductsList);


//add products to a cart
router.post("/addToCart", verifyToken, addToCart);

//get orders
router.get("/getOrders", verifyToken, getOrders);

module.exports = router

