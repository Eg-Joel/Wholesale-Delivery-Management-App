const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/vendor");
const Product =  require("../models/product");
const Order =  require("../models/order");

exports.truckDriverRegister = async (req, res) => {
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ msg: "Invalid email address" });
  }

  if (!validator.isLength(req.body.password, { min: 4 })) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters long" });
  }
  if (
    !validator.isMobilePhone(req.body.mobileNumber, "any", {
      strictMode: false,
    })
  ) {
    return res.status(400).json({ msg: "Invalid mobile number" });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(200).json({ msg: "Please login with correct password" });
  }
  let password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const hashPas = await bcrypt.hash(password, salt);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    mobileNumber: req.body.mobileNumber,
    address: req.body.address,
    drivingLicenseDetails: req.body.drivingLicenseDetails,
    password: hashPas,
  });

  try {
    const saveUser = await user.save();
    res.status(201).json(saveUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.truckDriverLogin = async (req, res) => {
  try {
    if (
      !validator.isMobilePhone(req.body.mobileNumber, "any", {
        strictMode: false,
      })
    ) {
      return res.status(400).json({ msg: "Invalid mobile number" });
    }
    if (!validator.isLength(req.body.password, { min: 4 })) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ mobileNumber: req.body.mobileNumber });
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    const ComparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!ComparePassword) {
      return res.status(400).json({ msg: "Password error" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      process.env.jwtSEC,
      { expiresIn: "2d" }
    );

    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.editTDsProfile = async (req, res) => {
  try {
    
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashpass = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashpass;
    }
    const updateUser = await User.findByIdAndUpdate(req.user.id, {
      $set: req.body,
    });
    await updateUser.save();
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.addToCart = async (req,res) =>{
  try {
    const {products, collectedAmount} = req.body
  
    const totalAmount = products.reduce((total, product) => total + product.quantity * product.price,0)
    const vendorId = products.length > 0 ? products[0].vendorId : null;


    const order = new Order({
      vendorId:vendorId,
      truckDriverId:req.user.id,
      products,
      collectedAmount,
      totalAmount:totalAmount,
    })
    await order.save();
    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.getOrders = async (req,res)=> {
 try {
  const  truckDriverId = req.user.id

  const orders = await Order.find({ truckDriverId: truckDriverId });
  res.status(200).json(orders);
 } catch (error) {
  res.status(500).json(error);
 }

}
