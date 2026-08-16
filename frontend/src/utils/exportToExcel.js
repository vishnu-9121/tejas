import * as XLSX from 'xlsx';

/**
 * Export JSON data to Excel (.xlsx) file
 * @param {Array<Object>} data - Array of plain objects
 * @param {string} fileName - Destination filename without extension
 * @param {string} sheetName - Sheet name (default: 'Data')
 */
export const exportToExcel = (data, fileName = 'export', sheetName = 'Data') => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('No data available to export to Excel.');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Calculate dynamic column widths based on contents
  const colKeys = Object.keys(data[0]);
  const colWidths = colKeys.map(key => {
    let maxLength = key.length;
    data.forEach(row => {
      const val = row[key];
      if (val !== undefined && val !== null) {
        const len = String(val).length;
        if (len > maxLength) maxLength = len;
      }
    });
    return { wch: Math.min(Math.max(maxLength + 4, 12), 45) };
  });

  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const safeFileName = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, safeFileName);
};
