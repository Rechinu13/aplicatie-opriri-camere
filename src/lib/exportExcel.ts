import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

type Oprire = {
  id: number;
  stop_date: string;
  stop_time: string;
  shift: string;
  machine: string;
  operator_name: string;
  reason: string;
  details: string;
  photo_name: string;
};

export async function exportOpririToExcel(opriri: Oprire[]) {
  const workbook = new ExcelJS.Workbook();

  const opririSheet = workbook.addWorksheet("Opriri");

  opririSheet.columns = [
    { header: "ID", key: "id", width: 12 },
    { header: "Data", key: "stop_date", width: 15 },
    { header: "Ora", key: "stop_time", width: 12 },
    { header: "Schimb", key: "shift", width: 15 },
    { header: "Masina", key: "machine", width: 20 },
    { header: "Operator", key: "operator_name", width: 20 },
    { header: "Motiv", key: "reason", width: 25 },
    { header: "Detalii", key: "details", width: 35 },
    { header: "Poza", key: "photo_name", width: 25 },
  ];

  opriri.forEach((oprire) => {
    opririSheet.addRow(oprire);
  });

  opririSheet.getRow(1).font = { bold: true };

  const masiniCount: Record<string, number> = {};
  const motiveCount: Record<string, number> = {};
  const schimburiCount: Record<string, number> = {};

  opriri.forEach((oprire) => {
    masiniCount[oprire.machine] = (masiniCount[oprire.machine] || 0) + 1;
    motiveCount[oprire.reason] = (motiveCount[oprire.reason] || 0) + 1;
    schimburiCount[oprire.shift] = (schimburiCount[oprire.shift] || 0) + 1;
  });

  const masiniSheet = workbook.addWorksheet("Top Masini");
  masiniSheet.columns = [
    { header: "Masina", key: "masina", width: 25 },
    { header: "Numar opriri", key: "count", width: 20 },
  ];

  Object.entries(masiniCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([masina, count]) => {
      masiniSheet.addRow({ masina, count });
    });

  masiniSheet.getRow(1).font = { bold: true };

  const motiveSheet = workbook.addWorksheet("Top Motive");
  motiveSheet.columns = [
    { header: "Motiv", key: "motiv", width: 30 },
    { header: "Numar aparitii", key: "count", width: 20 },
  ];

  Object.entries(motiveCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([motiv, count]) => {
      motiveSheet.addRow({ motiv, count });
    });

  motiveSheet.getRow(1).font = { bold: true };

  const schimburiSheet = workbook.addWorksheet("Pe Schimburi");
  schimburiSheet.columns = [
    { header: "Schimb", key: "schimb", width: 20 },
    { header: "Numar opriri", key: "count", width: 20 },
  ];

  Object.entries(schimburiCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([schimb, count]) => {
      schimburiSheet.addRow({ schimb, count });
    });

  schimburiSheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "raport-opriri.xlsx");
}