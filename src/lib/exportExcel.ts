import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (data: any[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Raport opriri");

  sheet.columns = [
    { header: "Data", key: "stop_date", width: 15 },
    { header: "Ora", key: "stop_time", width: 10 },
    { header: "Mașină", key: "machine", width: 20 },
    { header: "Operator", key: "operator_name", width: 20 },
    { header: "Motiv", key: "reason", width: 25 },
  ];

  data.forEach((row) => {
    sheet.addRow(row);
  });

  // header bold + culoare
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E293B" },
  };

  sheet.getRow(1).font = { color: { argb: "FFFFFFFF" }, bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "raport_opriri.xlsx");
};