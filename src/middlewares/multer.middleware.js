import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("in destination multter");
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        console.log("in filename multter");
        cb(null, file.originalname);
    },
});

export const upload = multer({
    storage,
});
