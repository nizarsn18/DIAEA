import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName = 'export_diaea.xlsx', sheetName = 'Données') => {
  if (!data || data.length === 0) {
    alert('Aucune donnée à exporter.');
    return;
  }
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  XLSX.writeFile(workbook, fileName);
};
