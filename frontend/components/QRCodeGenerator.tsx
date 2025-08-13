import { useEffect, useRef } from "react";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";

interface QRCodeGeneratorProps {
  text: string;
  size?: number;
  tableNumber?: number;
  onCopy?: () => void;
  onDownload?: () => void;
}

export default function QRCodeGenerator({
  text,
  size = 200,
  tableNumber,
  onCopy,
  onDownload,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  // Simple QR code pattern generator (placeholder)
  const generateQRPattern = (canvas: HTMLCanvasElement, data: string) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const qrSize = 25; // 25x25 grid
    const moduleSize = size / qrSize;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Generate a simple pattern based on the text
    const hash = data.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    // Create a deterministic pattern
    ctx.fillStyle = "#000000";

    // Corner squares (position markers)
    const corners = [
      [0, 0],
      [qrSize - 7, 0],
      [0, qrSize - 7],
    ];

    corners.forEach(([x, y]) => {
      // Outer square
      ctx.fillRect(
        x * moduleSize,
        y * moduleSize,
        7 * moduleSize,
        7 * moduleSize,
      );
      // Inner white square
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(
        (x + 1) * moduleSize,
        (y + 1) * moduleSize,
        5 * moduleSize,
        5 * moduleSize,
      );
      // Inner black square
      ctx.fillStyle = "#000000";
      ctx.fillRect(
        (x + 2) * moduleSize,
        (y + 2) * moduleSize,
        3 * moduleSize,
        3 * moduleSize,
      );
    });

    // Generate data pattern
    for (let i = 0; i < qrSize; i++) {
      for (let j = 0; j < qrSize; j++) {
        // Skip corner areas
        if (
          (i < 9 && j < 9) ||
          (i < 9 && j >= qrSize - 8) ||
          (i >= qrSize - 8 && j < 9)
        ) {
          continue;
        }

        // Generate pseudo-random pattern based on hash and position
        const value = (hash + i * 31 + j * 17) % 100;
        if (value > 50) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = size;
      canvas.height = size;
      generateQRPattern(canvas, text);
    }
  }, [text, size]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = `table-${tableNumber || "qr"}-qr-code.png`;
      link.href = canvas.toDataURL();
      link.click();
      onDownload?.();
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
        <canvas
          ref={canvasRef}
          className="border border-muted rounded"
          style={{ width: size, height: size }}
        />
      </div>

      {tableNumber && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">
            Table {tableNumber} QR Code
          </p>
          <p className="text-xs text-secondary">
            Scan to order directly to this table
          </p>
        </div>
      )}

      <div className="bg-muted p-3 rounded-lg">
        <p className="text-xs text-secondary break-all font-mono">{text}</p>
      </div>

      <div className="flex space-x-3 justify-center">
        <button
          onClick={handleCopy}
          className={`btn btn-sm ${copied ? "bg-green text-white" : "btn-secondary"}`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy URL
            </>
          )}
        </button>
        <button onClick={handleDownload} className="btn btn-primary btn-sm">
          <Download className="w-4 h-4 mr-2" />
          Download QR
        </button>
      </div>
    </div>
  );
}
