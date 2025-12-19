
import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface ExportButtonProps {
  elementId: string;
  filename: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ elementId, filename }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setIsExporting(true);
    try {
      const html2canvasModule = await import('https://esm.sh/html2canvas@1.4.1');
      const html2canvas = html2canvasModule.default;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.animation = 'none';
            clonedElement.style.transition = 'none';
          }
        }
      });

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed', error);
      alert('Erro ao exportar imagem. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-white px-5 py-2.5 rounded-full transition-all shadow-lg font-bold text-xs uppercase tracking-widest"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Exportando...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Baixar PNG
        </>
      )}
    </button>
  );
};

export default ExportButton;
