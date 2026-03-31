import Notice from "../models/notice.js";

export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSingleNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.status(200).json(notice);
  } catch (error) {
    console.error("Error fetching notice:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createNotice = async (req, res) => {
  try {
    const { title, description, createdBy, category, isImportant } = req.body;
    let image = "";
    if (req.file) {
      image = req.file.path; // URL from Cloudinary
    }
    const notice = await Notice.create({ title, description, createdBy, category, isImportant, image });
    res.status(201).json(notice);
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, createdBy, category, isImportant } = req.body;
    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    if (title) notice.title = title;
    if (description) notice.description = description;
    if (createdBy) notice.createdBy = createdBy;
    if (category) notice.category = category;
    if (isImportant !== undefined) notice.isImportant = isImportant;
    
    // If a new image was uploaded, update the URL
    if (req.file) {
      notice.image = req.file.path;
    }

    await notice.save();
    res.status(200).json(notice);
  } catch (error) {
    console.error("Error updating notice:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    await notice.deleteOne();
    res.status(200).json({ message: "Notice deleted" });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
