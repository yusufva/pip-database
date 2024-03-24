import multer from "multer";
import path from "path";

const xlsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            `excel-${file.originalname}-${new Date().getTime()}` +
                path.extname(file.originalname)
        );
    },
});

const xlsFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
        return cb(new Error("Only excel files are allowed!"), false);
    }
    cb(null, true);
};

export const upload = multer({
    storage: xlsStorage,
    fileFilter: xlsFilter,
});
