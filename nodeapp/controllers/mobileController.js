const Mobile = require('../models/mobileModel');

const getAllMobiles = async (req, res) => {
  try {
    const sortValue = req.body.sortValue || 1; // Default to ascending order if not provided
    const search = req.body.searchValue || ''; // Default to empty string if not provided
    const searchRegex = new RegExp(search, 'i'); // Case-insensitive search regex

    const mobiles = await Mobile.find({ model: searchRegex })
      .sort({ mobilePrice: parseInt(sortValue) });

    res.status(200).json(mobiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMobileById = async (req, res) => {
  try {
    const { id } = req.params;
    const mobile = await Mobile.findById(id);

    if (!mobile) {
      res.status(200).json({ message: 'Cannot find any mobile' });
      return;
    }

    res.status(200).json(mobile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMobile = async (req, res) => {
  try {
    const mobile = await Mobile.create(req.body);
    res.status(200).json({ message: 'Mobile added successfully', mobileId: mobile._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMobile = async (req, res) => {
  try {
    const { id } = req.params;
    const mobile = await Mobile.findByIdAndUpdate(id, req.body, { new: true });

    if (!mobile) {
      res.status(404).json({ message: 'Mobile not found' });
      return;
    }

    res.status(200).json({ message: 'Mobile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMobile = async (req, res) => {
  try {
    const { id } = req.params;
    const mobile = await Mobile.findByIdAndDelete(id);

    if (!mobile) {
      res.status(404).json({ message: 'Mobile not found' });
      return;
    }

    res.status(200).json({ message: 'Mobile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getMobilesByUserId = async (req, res) => {
  try {
    const sortValue = req.body.sortValue || 1; // Default to ascending order if not provided
    const search = req.body.searchValue || ''; // Default to empty string if not provided
    const searchRegex = new RegExp(search, 'i'); // Case-insensitive search regex

    const { userId } = req.body;

    const mobiles = await Mobile.find({ userId, model: searchRegex })
      .sort({ mobilePrice: parseInt(sortValue) });

    res.status(200).json(mobiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllMobiles,
  getMobileById,
  addMobile,
  updateMobile,
  deleteMobile,
  getMobilesByUserId
};
