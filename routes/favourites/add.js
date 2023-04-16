const express = require("express");
const router = express.Router();
const FavouritePets = require("../../models/favorites.pets");
const User = require("../../models/user.detail.model");
const Pet = require("../../models/pets.model");

// Endpoint to add a pet to user's favourite list
router.post("/add", async (req, res) => {
  try {
    const { petId } = req.body;
    const { userId } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if pet exists
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Check if pet is already in user's favourite list
    const favouritePets = await FavouritePets.findById(userId);
    if (favouritePets && favouritePets.petIds.includes(petId)) {
      return res
        .status(400)
        .json({ message: "Pet is already in favourite list" });
    }

    // Append pet to user's favourite list
    if (favouritePets) {
      favouritePets.petIds.push(petId);
      pet.stars++;
      await pet.save();
      await favouritePets.save();
    } else {
      const newFavouritePets = new FavouritePets({
        _id: userId,
        petIds: [petId],
      });
      pet.stars++;
      await pet.save();
      await newFavouritePets.save();
    }

    res.json({ message: "Pet added to favourite list successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  const petId = req.body.petId;

  try {
    const pet = await Pet.findById(petId);

    const favourite = await FavouritePets.findById(userId);
    if (!favourite) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    const index = favourite.petIds.indexOf(petId);
    if (index === -1) {
      return res.status(404).json({ message: "Pet not found in favourite" });
    }

    favourite.petIds.splice(index, 1);
    pet.stars--;
    await pet.save();
    await favourite.save();

    res.status(200).json({ message: "Pet removed from favourite" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
