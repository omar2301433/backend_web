const {Product} = require("../Data/product");
const {Category} = require("../Data/category");
const { Brand } = require("../Data/brand");

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })

const uploadOptions = multer({ storage: storage });


router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});



router.get('/search', async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    console.log("Search term is missing.");
    return res.status(400).json({ success: false, message: "Search term is required" });
  }

  console.log("Search term received:", searchTerm);

  try {
    // Load all products and populate related fields
    const allProducts = await Product.find({})
      .populate('category')
      .populate('brand');

    console.log(`Found ${allProducts.length} products in DB`);

    const filtered = allProducts.filter(product => {
      try {
        const name = (product.name || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const specs = (product.specs || '').toLowerCase();
        const categoryName = (product.category?.name || '').toLowerCase();
        const brandName = (product.brand?.name || '').toLowerCase();

        return [name, description, specs, categoryName, brandName].some(field =>
          field.includes(searchTerm.toLowerCase())
        );
      } catch (err) {
        console.error("Error in filtering loop:", err.message);
        return false;
      }
    });

    console.log(`Filtered to ${filtered.length} matching products`);

    res.json({ success: true, data: filtered });
  } catch (err) {
    console.error("Search failed:", err.stack);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});






router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});



router.post(`/`,uploadOptions.single('image'), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid category");

  const file = req.file;
    if(!file) return res.status(400).send('No image in the request')

    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  
  let product = new Product({
    name: req.body.name,
    category: req.body.category,
    brand: req.body.brand,
    price: req.body.price,
    description: req.body.description,
    image: `${basePath}${fileName}`,
    specs: req.body.specs,
    isFeatured: req.body.isFeatured,
    quantity: req.body.quantity,
  });
 product = await product.save();
  if (!product) {
    return res.status(500).send("The product cannot be created");
  }
  res.send(product);
});


router.put("/:id", async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
  return res.status(400).send("Invalid product id")
  }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid category");

  const product = await Product.findByIdAndUpdate(
   req.params.id,
    {
    name: req.body.name,
    category: req.body.category,
    brand: req.body.brand,
    price: req.body.price,
    description: req.body.description,
    image_url: req.body.image_url,
    specs: req.body.specs,
    isFeatured: req.body.isFeatured,
    quantity: req.body.quantity,
    },
    {new: true}
  );
  if (!product) 
    return res.status(400).send("the product cannot be update ");
  
  res.send(product);
});



router.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(500).send("The product cannot be delted");
  }
  res.status(200).json({ success: true, message: "The product is deleted" });
});


router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount : productCount
  });
});

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});
router.put(
    '/gallery-images/:id', 
    uploadOptions.array('images', 10), 
    async (req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
         }
         const files = req.files
         let imagesURLs = [];
         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

         if(files) {
            files.map(file =>{
                imagesURLs.push(`${basePath}${file.filename}`);
            })
         }

         const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesURLs
            },
            { new: true}
        )

        if(!product)
            return res.status(500).send('the gallery cannot be updated!')

        res.send(product);
    }
)


module.exports = router;