import fs from "fs";
import path from "path";

/**
 * Deletes a file at the given path if it exists.
 * @param {string} filePath - Absolute path to the file.
 */
export const deleteImage = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  }
};

/**
 * Renames an existing image to match a new name.
 * @param {string} oldPath - Current absolute path of the image.
 * @param {string} newName - The new name for the image (without extension).
 * @returns {string} The new absolute path of the image.
 */
export const renameImage = (oldPath, newName) => {
  if (oldPath && fs.existsSync(oldPath)) {
    const ext = path.extname(oldPath);
    const newFilename = `${newName}${ext}`;
    const newPath = path.join(path.dirname(oldPath), newFilename);

    if (oldPath !== newPath) {
      try {
        fs.renameSync(oldPath, newPath);
        return newPath;
      } catch (err) {
        console.error("Error renaming image:", err);
      }
    }
    return oldPath;
  }
  return null;
};

/**
 * Processes a newly uploaded image file, renames it based on the item name, and returns the new path.
 * Optionally deletes the old image if one existed.
 * @param {Object} file - Multer file object.
 * @param {string} newName - The name to give the file.
 * @param {string} [oldImagePath] - Optional path of an old image to delete.
 * @returns {string} The new absolute path of the uploaded image.
 */
export const processUploadedImage = (file, newName, oldImagePath = null) => {
  const ext = path.extname(file.originalname);
  const newFilename = `${newName}${ext}`;
  const newPath = path.join(file.destination, newFilename);

  // Delete old image if it's different from the new path
  if (oldImagePath && oldImagePath !== newPath) {
    deleteImage(oldImagePath);
  }

  try {
    fs.renameSync(file.path, newPath);
    return newPath;
  } catch (err) {
    console.error("Error renaming uploaded file:", err);
    return file.path; // Fallback to original path if rename fails
  }
};

/**
 * Cleans up multiple uploaded files, typically used in error handling.
 * @param {Array} files - Array of Multer file objects.
 */
export const cleanupUploadedFiles = (files) => {
  if (files && files.length > 0) {
    files.forEach((file) => deleteImage(file.path));
  }
};
