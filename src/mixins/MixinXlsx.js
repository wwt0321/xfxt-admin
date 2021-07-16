import XLSX from 'xlsx';

export const MixinXlsx = {
  methods: {
    /**
     * 从 Excel 文件中读取数据
     * @param {File} file - Excel 文件
     * return {Promise<Object[]>} 数据
     */
    async readXlsx(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          resolve(XLSX.utils.sheet_to_json(worksheet, { raw: false }));
        };
        reader.readAsArrayBuffer(file);
      });
    },
    async writeXlsx(json, name) {
      let wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(json);
      XLSX.utils.book_append_sheet(wb, ws, name);
      XLSX.writeFile(wb, `${name}.xlsx`);
    },
  },
};
