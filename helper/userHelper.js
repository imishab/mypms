var db = require("../config/connection");
var collections = require("../config/collections");
const bcrypt = require("bcrypt");
const objectId = require("mongodb").ObjectID;
const Razorpay = require("razorpay");
const crypto = require('crypto');


var instance = new Razorpay({
  key_id: "rzp_test_8NokNgt8cA3Hdv",
  key_secret: "xPzG53EXxT8PKr34qT7CTFm9",
});

module.exports = {



  ///////ADD document/////////////////////                                         
  adddocument: (document, callback) => {
    console.log(document);
    document.Price = parseInt(document.Price);
    db.get()
      .collection(collections.DOCUMENT_COLLECTION)
      .insertOne(document)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },

  ///////GET ALL document/////////////////////                                            
  getAlldocuments: () => {
    return new Promise(async (resolve, reject) => {
      let documents = await db
        .get()
        .collection(collections.DOCUMENT_COLLECTION)
        .find()
        .toArray();
      resolve(documents);
    });
  },

  ///////ADD document DETAILS/////////////////////                                            
  getdocumentDetails: (documentId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DOCUMENT_COLLECTION)
        .findOne({
          _id: objectId(documentId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  ///////DELETE document/////////////////////                                            
  deletedocument: (documentId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DOCUMENT_COLLECTION)
        .removeOne({
          _id: objectId(documentId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  ///////UPDATE document/////////////////////                                            
  updatedocument: (documentId, documentDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DOCUMENT_COLLECTION)
        .updateOne(
          {
            _id: objectId(documentId)
          },
          {
            $set: {
              Name: documentDetails.Name,
              Category: documentDetails.Category,
              Price: documentDetails.Price,
              Description: documentDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },


  ///////DELETE ALL document/////////////////////                                            
  deleteAlldocuments: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DOCUMENT_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },



  ///////ADD password/////////////////////                                         
  addpassword: (password, callback) => {
    // Hash the password before storing it
    bcrypt.hash(password.password, 10, function (err, hash) {
      if (err) {
        console.error(err);
        return callback(null);
      }
      password.password = hash;
      console.log(password);
      db.get()
        .collection(collections.PASSWORD_COLLECTION)
        .insertOne(password)
        .then((data) => {
          console.log(data);
          callback(data.ops[0]._id);
        });
    });
  },

  decryptPassword: function (encryptedPassword, secret) {
    try {
      let key = crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32);
      const iv = Buffer.alloc(16, 0); // Initialization vector

      console.log('Key:', key);
      console.log('IV:', iv);

      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
      let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      console.log('Decrypted Password:', decrypted);

      return decrypted;
    } catch (error) {
      console.error('Error decrypting password:', error);
      return null; // or throw error, depending on your error handling strategy
    }
  },

  ///////GET ALL password/////////////////////                                            
  getAllpasswords: () => {
    return new Promise(async (resolve, reject) => {
      let passwords = await db
        .get()
        .collection(collections.PASSWORD_COLLECTION)
        .find()
        .toArray();

      // Decrypt passwords before resolving the promise
      passwords.forEach(password => {
        password.password = password.password; // You'll need to decrypt this
      });

      resolve(passwords);
    });
  },



  ///////ADD password DETAILS/////////////////////                                            
  getpasswordDetails: (passwordId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PASSWORD_COLLECTION)
        .findOne({
          _id: objectId(passwordId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  ///////DELETE password/////////////////////                                            
  deletepassword: (passwordId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PASSWORD_COLLECTION)
        .removeOne({
          _id: objectId(passwordId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  ///////UPDATE password/////////////////////                                            
  updatepassword: (passwordId, passwordDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PASSWORD_COLLECTION)
        .updateOne(
          {
            _id: objectId(passwordId)
          },
          {
            $set: {
              Name: passwordDetails.Name,
              Category: passwordDetails.Category,
              Price: passwordDetails.Price,
              Description: passwordDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },


  ///////DELETE ALL password/////////////////////                                            
  deleteAllpasswords: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PASSWORD_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },




  ///////ADD projects/////////////////////                                         
  addproject: (project, callback) => {
    console.log(project);
    db.get()
      .collection(collections.PROJECT_COLLECTION)
      .insertOne(project)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },

  ///////GET ALL projects/////////////////////                                            
  getAllprojects: () => {
    return new Promise(async (resolve, reject) => {
      let projects = await db
        .get()
        .collection(collections.PROJECT_COLLECTION)
        .find()
        .toArray();
      resolve(projects);
    });
  },

  ///////ADD projects DETAILS/////////////////////                                            
  getprojectDetails: (projectId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PROJECT_COLLECTION)
        .findOne({
          _id: objectId(projectId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  ///////DELETE projects/////////////////////                                            
  deleteproject: (projectId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PROJECT_COLLECTION)
        .removeOne({
          _id: objectId(projectId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  ///////UPDATE projects/////////////////////                                            
  updateproject: (projectId, projectDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PROJECT_COLLECTION)
        .updateOne(
          {
            _id: objectId(projectId)
          },
          {
            $set: {
              Name: projectDetails.Name,
              Category: projectDetails.Category,
              Price: projectDetails.Price,
              Description: projectDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },


  ///////DELETE ALL projects/////////////////////                                            
  deleteAllprojects: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PROJECT_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },




  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collections.PRODUCTS_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },

  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.Password = await bcrypt.hash(userData.Password, 10);
      db.get()
        .collection(collections.USERS_COLLECTION)
        .insertOne(userData)
        .then((data) => {
          resolve(data.ops[0]);
        });
    });
  },

  doSignin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .get()
        .collection(collections.USERS_COLLECTION)
        .findOne({ Email: userData.Email });
      if (user) {
        bcrypt.compare(userData.Password, user.Password).then((status) => {
          if (status) {
            console.log("Login Success");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login Failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login Failed");
        resolve({ status: false });
      }
    });
  },

  addToCart: (productId, userId) => {
    console.log(userId);
    let productObject = {
      item: objectId(productId),
      quantity: 1,
    };
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: objectId(userId) });
      if (userCart) {
        let productExist = userCart.products.findIndex(
          (products) => products.item == productId
        );
        console.log(productExist);
        if (productExist != -1) {
          db.get()
            .collection(collections.CART_COLLECTION)
            .updateOne(
              { user: objectId(userId), "products.item": objectId(productId) },
              {
                $inc: { "products.$.quantity": 1 },
              }
            )
            .then(() => {
              resolve();
            });
        } else {
          db.get()
            .collection(collections.CART_COLLECTION)
            .updateOne(
              { user: objectId(userId) },
              {
                $push: { products: productObject },
              }
            )
            .then((response) => {
              resolve();
            });
        }
      } else {
        let cartObject = {
          user: objectId(userId),
          products: [productObject],
        };
        db.get()
          .collection(collections.CART_COLLECTION)
          .insertOne(cartObject)
          .then((response) => {
            resolve();
          });
      }
    });
  },

  getCartProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cartItems = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCTS_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();
      // console.log(cartItems);
      resolve(cartItems);
    });
  },

  getCartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: objectId(userId) });
      if (cart) {
        var sumQuantity = 0;
        for (let i = 0; i < cart.products.length; i++) {
          sumQuantity += cart.products[i].quantity;
        }
        count = sumQuantity;
      }
      resolve(count);
    });
  },

  changeProductQuantity: (details) => {
    details.count = parseInt(details.count);
    details.quantity = parseInt(details.quantity);

    return new Promise((resolve, reject) => {
      if (details.count == -1 && details.quantity == 1) {
        db.get()
          .collection(collections.CART_COLLECTION)
          .updateOne(
            { _id: objectId(details.cart) },
            {
              $pull: { products: { item: objectId(details.product) } },
            }
          )
          .then((response) => {
            resolve({ removeProduct: true });
          });
      } else {
        db.get()
          .collection(collections.CART_COLLECTION)
          .updateOne(
            {
              _id: objectId(details.cart),
              "products.item": objectId(details.product),
            },
            {
              $inc: { "products.$.quantity": details.count },
            }
          )
          .then((response) => {
            resolve({ status: true });
          });
      }
    });
  },

  removeCartProduct: (details) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.CART_COLLECTION)
        .updateOne(
          { _id: objectId(details.cart) },
          {
            $pull: { products: { item: objectId(details.product) } },
          }
        )
        .then(() => {
          resolve({ status: true });
        });
    });
  },

  getTotalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let total = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCTS_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$quantity", "$product.Price"] } },
            },
          },
        ])
        .toArray();
      console.log(total[0].total);
      resolve(total[0].total);
    });
  },

  getCartProductList: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: objectId(userId) });
      resolve(cart.products);
    });
  },

  placeOrder: (order, products, total, user) => {
    return new Promise(async (resolve, reject) => {
      console.log(order, products, total);
      let status = order["payment-method"] === "COD" ? "placed" : "pending";
      let orderObject = {
        deliveryDetails: {
          mobile: order.mobile,
          address: order.address,
          pincode: order.pincode,
        },
        userId: objectId(order.userId),
        user: user,
        paymentMethod: order["payment-method"],
        products: products,
        totalAmount: total,
        status: status,
        date: new Date(),
      };
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .insertOne({ orderObject })
        .then((response) => {
          db.get()
            .collection(collections.CART_COLLECTION)
            .removeOne({ user: objectId(order.userId) });
          resolve(response.ops[0]._id);
        });
    });
  },

  getUserOrder: (userId) => {
    return new Promise(async (resolve, reject) => {
      let orders = await db
        .get()
        .collection(collections.ORDER_COLLECTION)
        .find({ "orderObject.userId": objectId(userId) })
        .toArray();
      // console.log(orders);
      resolve(orders);
    });
  },

  getOrderProducts: (orderId) => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collections.ORDER_COLLECTION)
        .aggregate([
          {
            $match: { _id: objectId(orderId) },
          },
          {
            $unwind: "$orderObject.products",
          },
          {
            $project: {
              item: "$orderObject.products.item",
              quantity: "$orderObject.products.quantity",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCTS_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();
      resolve(products);
    });
  },

  generateRazorpay: (orderId, totalPrice) => {
    return new Promise((resolve, reject) => {
      var options = {
        amount: totalPrice * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: "" + orderId,
      };
      instance.orders.create(options, function (err, order) {
        console.log("New Order : ", order);
        resolve(order);
      });
    });
  },

  verifyPayment: (details) => {
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "xPzG53EXxT8PKr34qT7CTFm9");

      hmac.update(
        details["payment[razorpay_order_id]"] +
        "|" +
        details["payment[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");

      if (hmac == details["payment[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },

  changePaymentStatus: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: {
              "orderObject.status": "placed",
            },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },

  cancelOrder: (orderId) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .removeOne({ _id: objectId(orderId) })
        .then(() => {
          resolve();
        });
    });
  },

  searchProduct: (details) => {
    console.log(details);
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .createIndex({ Name: "text" }).then(async () => {
          let result = await db
            .get()
            .collection(collections.PRODUCTS_COLLECTION)
            .find({
              $text: {
                $search: details.search,
              },
            })
            .toArray();
          resolve(result);
        })

    });
  },
};
