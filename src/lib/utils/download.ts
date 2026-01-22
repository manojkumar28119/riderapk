import { toast } from "@/hooks/use-toast";

export const downloadFromUrl = (url: string, filename?: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || url.split('/').pop()?.split('?')[0] || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadFile = (
  data: string | Blob | ArrayBuffer | Uint8Array,
  type: 'csv' | 'xlsx' | 'pdf',
  filename?: string
): void => {
  try {
    const mimeTypes: Record<string, string> = {
      csv: 'text/csv;charset=utf-8;',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      pdf: 'application/pdf'
    };

    const blob = data instanceof Blob ? data : new Blob([data as BlobPart], { type: mimeTypes[type] });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `items.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    toast({
      title: `Failed to download file.`,
      variant: "failure",
    });
    throw error;
  }
};

