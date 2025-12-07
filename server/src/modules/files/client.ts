import multer from "multer";

export const upload = multer({
  dest: "static/upload/slip",
});
export const imgUpload = multer({
  dest: "static/upload/cdn",
});
