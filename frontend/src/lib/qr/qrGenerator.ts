import QRCode from 'qrcode';

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    const url = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: '#0f172a', // slate-900
        light: '#ffffff',
      },
    });
    return url;
  } catch (err) {
    console.error('QR Generation Error:', err);
    return '';
  }
};

export const downloadQRCode = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}_QR.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
