// Defines the shape of Braintrust's experiment data.
// We only care about a subset of the full export.
export interface BraintrustData {
  id: string;
  name: string;
  created: string; // ISO 8601 date string
  scores: {
    [key: string]: number;
  };
}

// Defines the shape of the user-provided business KPI data.
export interface KpiDataPoint {
  date: string; // Expects 'YYYY-MM-DD'
  value: number;
}

/**
 * Parses a Braintrust experiment JSON file.
 * @param file - The File object to parse.
 * @returns A promise that resolves to an array of BraintrustData.
 */
export async function parseBraintrustJson(file: File): Promise<BraintrustData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const json = JSON.parse(text);
        // Basic validation: check if it's an array.
        // A real app would have more robust validation (e.g., with Zod).
        if (!Array.isArray(json)) {
          throw new Error('Invalid JSON format: expected an array of experiments.');
        }
        // For now, we assume the structure matches BraintrustData.
        resolve(json as BraintrustData[]);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

/**
 * Parses a business KPI CSV file.
 * Requires headers 'date' and 'value'.
 * @param file - The File object to parse.
 * @returns A promise that resolves to an array of KpiDataPoint.
 */
export async function parseKpiCsv(file: File): Promise<KpiDataPoint[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        if (rows.length < 2) {
          throw new Error('CSV must have a header row and at least one data row.');
        }
        
        const header = rows[0].split(',').map(h => h.trim());
        const dateIndex = header.indexOf('date');
        const valueIndex = header.indexOf('value');

        if (dateIndex === -1 || valueIndex === -1) {
          throw new Error("CSV header must include 'date' and 'value' columns.");
        }

        const data = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            date: values[dateIndex].trim(),
            value: parseFloat(values[valueIndex].trim()),
          };
        });
        
        resolve(data);

      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
