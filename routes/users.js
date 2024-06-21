var express = require("express");
var userHelper = require("../helper/userHelper");
var router = express.Router();
var fs = require("fs");

const verifySignedIn = (req, res, next) => {
  if (req.session.signedIn) {
    next();
  } else {
    res.redirect("/signin");
  }
};

/* GET home page. */
router.get("/", verifySignedIn, async function (req, res, next) {
  let user = req.session.user;
  let cartCount = null;
  if (user) {
    let userId = req.session.user._id;
    cartCount = await userHelper.getCartCount(userId);
  }
  userHelper.getAllProducts().then((products) => {
    res.render("users/home", { admin: false, products, user, cartCount });
  });
});



///////ALL document/////////////////////                                         
router.get("/all-documents", verifySignedIn, function (req, res) {
  let user = req.session.user;
  userHelper.getAlldocuments().then((documents) => {
    res.render("users/document/all-documents", { admin: false, layout: "innerlayout", documents, user });
  });
});

///////ADD document/////////////////////                                         
router.get("/add-document", verifySignedIn, function (req, res) {
  let user = req.session.user;
  res.render("users/document/add-document", { admin: false, layout: "innerlayout", user });
});

///////ADD document/////////////////////                                         
router.post("/add-document", function (req, res) {
  userHelper.adddocument(req.body, (id) => {
    let image1 = req.files.Image1;
    let image2 = req.files.Image2;

    if (image1 && image2) {
      image1.mv("./public/images/document-docs/" + id + ".pdf", (err1) => {
        if (err1) {
          console.log(err1);
          return res.status(500).send(err1);
        }

        image2.mv("./public/images/document-images/" + id + ".png", (err2) => {
          if (err2) {
            console.log(err2);
            return res.status(500).send(err2);
          }

          res.redirect("all-documents");
        });
      });
    } else {
      res.status(400).send('Two images are required.');
    }
  });
});

///////EDIT document/////////////////////                                         
router.get("/edit-document/:id", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let documentId = req.params.id;
  let document = await userHelper.getdocumentDetails(documentId);
  console.log(document);
  res.render("users/document/edit-document", { admin: false, layout: "innerlayout", document, user });
});

///////EDIT document/////////////////////                                         
router.post("/edit-document/:id", verifySignedIn, function (req, res) {
  let documentId = req.params.id;
  userHelper.updatedocument(documentId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/document-images/" + documentId + ".png");
      }
    }
    res.redirect("/users/document/all-documents");
  });
});

///////DELETE document/////////////////////                                         
router.get("/delete-document/:id", verifySignedIn, function (req, res) {
  let documentId = req.params.id;
  userHelper.deletedocument(documentId).then((response) => {
    fs.unlinkSync("./public/images/document-images/" + documentId + ".png");
    res.redirect("/users/document/all-documents");
  });
});

///////DELETE ALL document/////////////////////                                         
router.get("/delete-all-documents", verifySignedIn, function (req, res) {
  userHelper.deleteAlldocuments().then(() => {
    res.redirect("/users/document/all-documents");
  });
});


///////ALL password/////////////////////                                         
router.get("/all-passwords", verifySignedIn, function (req, res) {
  let user = req.session.user;
  let secret = 'msb'; // Replace with your actual secret key
  userHelper.getAllpasswords().then((passwords) => {
    // Decrypt passwords before rendering
    passwords.forEach(password => {
      password.password = userHelper.decryptPassword(password.password, secret); // Decrypt password
    });

    res.render("users/password/all-passwords", { admin: false, layout: "innerlayout", passwords, user });
  });
});

///////ADD password/////////////////////                                         
router.get("/add-password", verifySignedIn, function (req, res) {
  let user = req.session.user;
  res.render("users/password/add-password", { admin: false, layout: "innerlayout", user });
});

///////ADD password/////////////////////                                         
router.post("/add-password", function (req, res) {
  userHelper.addpassword(req.body, (id) => {
    res.redirect("all-passwords");
  });
});

///////EDIT password/////////////////////                                         
router.get("/edit-password/:id", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let passwordId = req.params.id;
  let password = await userHelper.getpasswordDetails(passwordId);
  console.log(password);
  res.render("users/password/edit-password", { admin: false, layout: "innerlayout", password, user });
});

///////EDIT password/////////////////////                                         
router.post("/edit-password/:id", verifySignedIn, function (req, res) {
  let passwordId = req.params.id;
  userHelper.updatepassword(passwordId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/password-images/" + passwordId + ".png");
      }
    }
    res.redirect("/users/password/all-passwords");
  });
});

///////DELETE password/////////////////////                                         
router.get("/delete-password/:id", verifySignedIn, function (req, res) {
  let passwordId = req.params.id;
  userHelper.deletepassword(passwordId).then((response) => {
    res.redirect("/all-passwords");
  });
});

///////DELETE ALL password/////////////////////                                         
router.get("/delete-all-passwords", verifySignedIn, function (req, res) {
  userHelper.deleteAllpasswords().then(() => {
    res.redirect("/all-passwords");
  });
});


///////ALL project/////////////////////                                         
router.get("/all-projects", verifySignedIn, function (req, res) {
  let user = req.session.user;
  userHelper.getAllprojects().then((projects) => {
    res.render("users/projects/all-projects", { admin: false, layout: "innerlayout", projects, user });
  });
});

///////ADD projects/////////////////////                                         
router.get("/add-project", verifySignedIn, function (req, res) {
  let user = req.session.user;
  res.render("users/projects/add-project", { admin: false, layout: "innerlayout", user });
});

///////ADD projects/////////////////////                                         
router.post("/add-project", function (req, res) {
  userHelper.addproject(req.body, (id) => {
    let image = req.files.Image;
    image.mv("./public/images/project-images/" + id + ".png", (err, done) => {
      if (!err) {
        res.redirect("/users/projects/all-projects");
      } else {
        console.log(err);
      }
    });
  });
});

///////EDIT projects/////////////////////                                         
router.get("/edit-project/:id", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let projectId = req.params.id;
  let project = await userHelper.getprojectDetails(projectId);
  console.log(project);
  res.render("users/projects/edit-project", { admin: false, layout: "innerlayout", project, user });
});

///////EDIT projects/////////////////////                                         
router.post("/edit-project/:id", verifySignedIn, function (req, res) {
  let projectId = req.params.id;
  userHelper.updateproject(projectId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/project-images/" + projectId + ".png");
      }
    }
    res.redirect("/users/projects/all-projects");
  });
});

///////DELETE projects/////////////////////                                         
router.get("/delete-project/:id", verifySignedIn, function (req, res) {
  let projectId = req.params.id;
  userHelper.deleteproject(projectId).then((response) => {
    fs.unlinkSync("./public/images/project-images/" + projectId + ".png");
    res.redirect("/users/projects/all-projects");
  });
});

///////DELETE ALL projects/////////////////////                                         
router.get("/delete-all-projects", verifySignedIn, function (req, res) {
  userHelper.deleteAllprojects().then(() => {
    res.redirect("/users/projects/all-projects");
  });
});







router.get("/signup", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/");
  } else {
    res.render("users/signup", { admin: false, layout: "emptylayout" });
  }
});

router.post("/signup", function (req, res) {
  userHelper.doSignup(req.body).then((response) => {
    req.session.signedIn = true;
    req.session.user = response;
    res.redirect("/");
  });
});

router.get("/signin", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/");
  } else {
    res.render("users/signin", {
      admin: false,
      layout: "emptylayout",
      signInErr: req.session.signInErr,
    });
    req.session.signInErr = null;
  }
});

router.post("/signin", function (req, res) {
  userHelper.doSignin(req.body).then((response) => {
    if (response.status) {
      req.session.signedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      req.session.signInErr = "Invalid Email/Password";
      res.redirect("/signin");
    }
  });
});

router.get("/signout", function (req, res) {
  req.session.signedIn = false;
  req.session.user = null;
  res.redirect("/");
});

router.get("/cart", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = await userHelper.getCartCount(userId);
  let cartProducts = await userHelper.getCartProducts(userId);
  let total = null;
  if (cartCount != 0) {
    total = await userHelper.getTotalAmount(userId);
  }
  res.render("users/cart", {
    admin: false,
    user,
    cartCount,
    cartProducts,
    total,
  });
});

router.get("/add-to-cart/:id", function (req, res) {
  console.log("api call");
  let productId = req.params.id;
  let userId = req.session.user._id;
  userHelper.addToCart(productId, userId).then(() => {
    res.json({ status: true });
  });
});

router.post("/change-product-quantity", function (req, res) {
  console.log(req.body);
  userHelper.changeProductQuantity(req.body).then((response) => {
    res.json(response);
  });
});

router.post("/remove-cart-product", (req, res, next) => {
  userHelper.removeCartProduct(req.body).then((response) => {
    res.json(response);
  });
});

router.get("/place-order", verifySignedIn, async (req, res) => {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = await userHelper.getCartCount(userId);
  let total = await userHelper.getTotalAmount(userId);
  res.render("users/place-order", { admin: false, user, cartCount, total });
});

router.post("/place-order", async (req, res) => {
  let user = req.session.user;
  let products = await userHelper.getCartProductList(req.body.userId);
  let totalPrice = await userHelper.getTotalAmount(req.body.userId);
  userHelper
    .placeOrder(req.body, products, totalPrice, user)
    .then((orderId) => {
      if (req.body["payment-method"] === "COD") {
        res.json({ codSuccess: true });
      } else {
        userHelper.generateRazorpay(orderId, totalPrice).then((response) => {
          res.json(response);
        });
      }
    });
});

router.post("/verify-payment", async (req, res) => {
  console.log(req.body);
  userHelper
    .verifyPayment(req.body)
    .then(() => {
      userHelper.changePaymentStatus(req.body["order[receipt]"]).then(() => {
        res.json({ status: true });
      });
    })
    .catch((err) => {
      res.json({ status: false, errMsg: "Payment Failed" });
    });
});

router.get("/order-placed", verifySignedIn, async (req, res) => {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = await userHelper.getCartCount(userId);
  res.render("users/order-placed", { admin: false, user, cartCount });
});

router.get("/orders", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = await userHelper.getCartCount(userId);
  let orders = await userHelper.getUserOrder(userId);
  res.render("users/orders", { admin: false, user, cartCount, orders });
});

router.get(
  "/view-ordered-products/:id",
  verifySignedIn,
  async function (req, res) {
    let user = req.session.user;
    let userId = req.session.user._id;
    let cartCount = await userHelper.getCartCount(userId);
    let orderId = req.params.id;
    let products = await userHelper.getOrderProducts(orderId);
    res.render("users/order-products", {
      admin: false,
      user,
      cartCount,
      products,
    });
  }
);

router.get("/cancel-order/:id", verifySignedIn, function (req, res) {
  let orderId = req.params.id;
  userHelper.cancelOrder(orderId).then(() => {
    res.redirect("/orders");
  });
});

router.post("/search", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = await userHelper.getCartCount(userId);
  userHelper.searchProduct(req.body).then((response) => {
    res.render("users/search-result", { admin: false, user, cartCount, response });
  });
});

module.exports = router;
