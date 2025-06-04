const {Brand} = require("../Data/brand");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const brandList = await Brand.find();

  if (!brandList) {
    res.status(500).json({ success: false });
  }
  res.send(brandList);
});


router.delete("/:id", async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    return res.status(500).send("The barnd cannot be deleted");
  }
  res.status(200).json({ success: true, message: "The Brand is deleted" });
});

router.post(`/`, async (req, res) => {
  let brand = new Brand({
    name: req.body.name,
  });
  brand = await brand.save();
  if (!brand) {
    return res.status(500).send("The brand cannot be created");
  }
  res.send(brand);
});

module.exports = router;