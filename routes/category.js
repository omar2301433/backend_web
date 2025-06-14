const {Category} = require("../Data/category");
const express = require("express");
const router = express.Router();
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

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.get(`/:id`, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(500).json({ message: "The category with the given ID was not found." });
  }
  res.status(200).send(category);
});

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
  const file = req.file;
  const fileName = file?.filename;
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

  let category = new Category({
    name: req.body.name,
    image: fileName ? `${basePath}${fileName}` : '',
  });

  category = await category.save();
  if (!category) {
    return res.status(400).send("The category cannot be created");
  }
  res.send(category);
});


router.delete("/:id", async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(500).send("The category cannot be deleted");
  }
  res.status(200).json({ success: true, message: "The category is deleted" });
});

router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name : req.body.name,
      image: req.body.image
    },
    { new: true }
  )
  if (!category) {
    return res.status(500).send("The category cannot be created");
  }
  res.send(category);
});

module.exports = router;