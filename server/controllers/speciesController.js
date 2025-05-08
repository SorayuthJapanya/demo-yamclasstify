const Species = require("../models/speciesModel");

exports.addSpecie = async (req, res) => {
  try {
    const currentImage = req.file;
    const {
      commonName,
      localName,
      scientificName,
      familyName,
      description,
      propagation,
      plantingseason,
      harvestingseason,
      utilization,
      status,
      surveysite,
    } = req.body;

    if (
      !currentImage ||
      !commonName ||
      !localName ||
      !scientificName ||
      !familyName ||
      !description ||
      !propagation ||
      !plantingseason ||
      !harvestingseason ||
      !utilization ||
      !status ||
      !surveysite
    ) {
      return res.status(400).json({ message: "All fields are required!!" });
    }

    // Check if scientificName already exists
    const existingSpecie = await Species.findOne({ scientificName });
    if (existingSpecie) {
      return res.status(400).json({
        message: "A species with this scientific name already exists",
      });
    }

    const newSpecies = new Species({
      imageUrl: {
        data: currentImage.buffer,
        contentType: currentImage.mimetype,
      },
      commonName,
      localName,
      scientificName,
      familyName,
      description,
      propagation,
      plantingseason,
      harvestingseason,
      utilization,
      status,
      surveysite,
    });

    const savedSpecies = await newSpecies.save();

    res.status(200).json({
      message: "Species added successfully",
      specie: savedSpecies,
    });
  } catch (error) {
    console.log("Error in addSpecies controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllSpecies = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    const species = await Species.find()
      .skip(Number(skip))
      .limit(Number(limit));

    const totalSpecies = await Species.countDocuments();

    res.status(200).json({
      species,
      totalSpecies,
      totalPages: Math.ceil(totalSpecies / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log("Error in getAllSpecies controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getOneSpecie = async (req, res) => {
  try {
    const { _id } = req.params;

    const specie = await Species.findById(_id);
    if (!specie) {
      return res.status(404).json({ message: "This specie not found" });
    }

    res.status(200).json(specie);
  } catch (error) {
    console.log("Error in getOneSpecie controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateSpecie = async (req, res) => {
  try {
    const { _id } = req.params;
    const currentImage = req.file;
    const {
      commonName,
      localName,
      scientificName,
      familyName,
      description,
      propagation,
      plantingseason,
      harvestingseason,
      utilization,
      status,
      surveysite,
    } = req.body;

    const specie = await Species.findById(_id);
    if (!specie)
      return res.status(404).json({ message: "This specie not found" });

    // Provided Data
    if (commonName) specie.commonName = commonName;
    if (localName) specie.localName = localName;
    if (scientificName) specie.scientificName = scientificName;
    if (familyName) specie.familyName = familyName;
    if (description) specie.description = description;
    if (propagation) specie.propagation = propagation;
    if (plantingseason) specie.plantingseason = plantingseason;
    if (harvestingseason) specie.harvestingseason = harvestingseason;
    if (utilization) specie.utilization = utilization;
    if (status) specie.status = status;
    if (surveysite) specie.surveysite = surveysite;

    if (currentImage) {
      specie.imageUrl = {
        data: currentImage.buffer, // Binary data of the uploaded file
        contentType: currentImage.mimetype, // MIME type of the uploaded file
      };
    }

    const updatedSpecie = await specie.save();

    res
      .status(200)
      .json({ message: "Specie updated successfully", specie: updatedSpecie });
  } catch (error) {
    console.log("Error in updateSpecie controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteSpecie = async (req, res) => {
  try {
    const { _id } = req.params;

    const specie = await Species.findByIdAndDelete(_id);
    if (!specie)
      return res.status(404).json({ message: "This specie not found" });

    res.status(200).json({ message: "Specie deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSpecie controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.searchSpecies = async (req, res) => {
  try {
    const { query } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!query)
      return res.status(400).json({ message: "Search query is required" });

    const species = await Species.find({
      $or: [
        { commonName: { $regex: query, $options: "i" } },
        { localName: { $regex: query, $options: "i" } },
      ],
    })
      .skip(Number(skip))
      .limit(Number(limit));

    if (species.length === 0) {
      return res.status(404).json({ message: "No species found" });
    }

    const totalSpecies = await Species.countDocuments();

    res.status(200).json({
      species,
      totalSpecies,
      totalPages: Math.ceil(totalSpecies / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log("Error in searchSpecies controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
