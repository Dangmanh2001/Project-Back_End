const os = require("os")
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

module.exports = (dataSample, nameFile) => {
  const workbook = XLSX.utils.book_new();

  // Tạo một Worksheet từ mảng dữ liệu
  const worksheet = XLSX.utils.json_to_sheet(dataSample);

  // Thêm Worksheet vào Workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
  // Lấy đường dẫn đầy đủ tới thư mục "Downloads"
  const downloadsPath = path.join(os.homedir(), "Downloads");

  // Đảm bảo thư mục "Downloads" tồn tại, nếu không tạo mới

  if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath);
  }

  // Lưu Workbook thành một tệp Excel
  const excelFilePath = path.join(downloadsPath, "exported_data_courses.xlsx");
  XLSX.writeFile(workbook, excelFilePath, nameFile);

  console.log(`Dữ liệu đã được xuất thành công vào ${excelFilePath}`);
};
