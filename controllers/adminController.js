const User = require("../models/user");
const Vendor = require("../models/vendor");
const Product = require("../models/product");
const Order =  require("../models/order");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

exports.adminRegister = async (req, res) => {
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ msg: "Invalid email address" });
  }

  if (!validator.isLength(req.body.password, { min: 4 })) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters long" });
  }

  let admin = await User.findOne({ email: req.body.email });
  if (admin) {
    return res.status(200).json({ msg: "Please login with correct password" });
  }
  let password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const hashPas = await bcrypt.hash(password, salt);

  admin = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPas,
    isAdmin: true,
  });

  try {
    const saveAdmin = await admin.save();
    res.status(201).json(saveAdmin);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const admin = await User.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(400).json({ msg: "admin not found" });
    }

    const ComparePassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!ComparePassword) {
      return res.status(400).json({ msg: "Password error" });
    }

    const accessToken = jwt.sign(
      {
        id: admin._id,
        name: admin.name,
        isAdmin: admin.isAdmin,
      },
      process.env.jwtSEC,
      { expiresIn: "2d" }
    );

    const { password, ...other } = admin._doc;
    res.status(200).json({ ...other, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.addVendors = async (req, res) => {
  try {
    const { name, email, location, contactInformation } = req.body;
    const vendor = new Vendor({ name, location, contactInformation, email });
    const saveVendor = await vendor.save();
    res.status(201).json(saveVendor);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getTruckDriversList = async (req, res) => {
  try {
    const TruckDriversList = await User.find({ isAdmin: false });
    res.status(200).json(TruckDriversList);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getVendorsList = async (req, res) => {
  try {
    const vendorsLsit = await Vendor.find();
    res.status(200).json(vendorsLsit);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.editVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;

    let updateFields = req.body;

    const vendor = await Vendor.findByIdAndUpdate(vendorId, {
      $set: updateFields,
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor is not found" });
    }

    await vendor.save();
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
     await Vendor.findByIdAndDelete(vendorId);

    res.status(200).json("vendor account deleted");
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.addProducts = async (req, res) => {
  try {
    const { name, price, category, image, vendorId } = req.body;
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(400).json({ message: "Vendor is not found" });
    }

    const product = new Product({ name, price, category, image, vendorId });
    const savedProduct = await product.save();
    vendor.products.push(savedProduct._id);
    await vendor.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getProductsList = async (req, res) => {
  try {
  
    const vendor = await Vendor.findById(req.params.id);
    const productIds = vendor.products;
 
    const products = await Product.find({ _id: { $in: productIds } });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    let updateFields = req.body;

    const product = await Product.findByIdAndUpdate(productId, {
      $set: updateFields,
    });

    if (!product) {
      return res.status(404).json({ message: "productis not found" });
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
     await Product.findByIdAndDelete(productId);

    res.status(200).json("product deleted");
  } catch (error) {
    res.status(500).json(error);
  }
}


exports.getOrders = async (req,res)=> {
  try {
   
 
   const orders = await Order.find({});
   res.status(200).json(orders);
  } catch (error) {
   res.status(500).json(error);
  }
 
 }
 