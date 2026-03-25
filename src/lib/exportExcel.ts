import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (data: any[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Raport opriri");

  sheet.columns = [
    { header: "Data", key: "stop_date", width: 15 },
    { header: "Ora", key: "stop_time", width: 10 },
    { header: "Schimb", key: "shift", width: 12 },
    { header: "Mașină", key: "machine", width: 20 },
    { header: "Operator", key: "operator_name", width: 20 },
    { header: "Motiv", key: "reason", width: 25 },
    { header: "Detalii", key: "details", width: 30 },
  ];

  data.forEach((row) => {
    sheet.addRow(row);
  });

  // stil header
  sheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "raport_opriri.xlsx");
};