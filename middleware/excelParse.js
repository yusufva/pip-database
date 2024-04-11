import exceljs from "exceljs";
import { StatusCodes } from "http-status-codes";
import { unlink } from "fs";

function excelHandle(req, res, next) {
    if (!req.file) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send(httpRespondsMessage.badRequest("no file uploaded"));
    }

    const path = "./public/uploads/" + req.file.filename;

    const workbook = new exceljs.Workbook();
    workbook.xlsx
        .readFile(path)
        .then((excelFile) => {
            const worksheet = excelFile.worksheets[0];
            const excelData = [];
            const header = [];

            worksheet.getRow(1).eachCell((cell, colNumber) => {
                header[colNumber] = cell.value
                    .replaceAll(" ", "")
                    .toLowerCase();
            });

            worksheet.eachRow((row, index) => {
                if (index > 1) {
                    const rowData = {};
                    row.eachCell((cell, colNumber) => {
                        rowData[`${header[colNumber]}`] = cell.value;
                    });
                    excelData.push(rowData);
                }
            });

            req.excelData = excelData;

            unlink(path, (err) => {
                if (err) throw err;
            });
            next();
        })
        .catch((err) => {
            console.error("Error reading excel file: ", err);
            unlink(path, (err) => {});
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(
                    httpRespondsMessage.internalServerError(
                        "error reading excel file: " + err
                    )
                );
        });
}

export default excelHandle;
