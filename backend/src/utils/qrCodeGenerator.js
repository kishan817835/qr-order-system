import QRCode from "qrcode";
import fs from "fs";
import path from "path";

export const generateQRCode = async (text, options = {}) => {
  try {
    const defaultOptions = {
      type: "png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 256,
      ...options,
    };

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(text, defaultOptions);

    return {
      success: true,
      dataURL: qrCodeDataURL,
      text: text,
    };
  } catch (error) {
    console.error("QR Code generation error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const generateQRCodeBuffer = async (text, options = {}) => {
  try {
    const defaultOptions = {
      type: "png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 256,
      ...options,
    };

    const qrCodeBuffer = await QRCode.toBuffer(text, defaultOptions);

    return {
      success: true,
      buffer: qrCodeBuffer,
      text: text,
    };
  } catch (error) {
    console.error("QR Code generation error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const saveQRCodeFile = async (text, filePath, options = {}) => {
  try {
    const defaultOptions = {
      type: "png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 256,
      ...options,
    };

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await QRCode.toFile(filePath, text, defaultOptions);

    return {
      success: true,
      filePath: filePath,
      text: text,
    };
  } catch (error) {
    console.error("QR Code file save error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const generateTableQRCode = async (
  restaurantId,
  tableNumber,
  tableId,
  qrCodeId,
) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const qrText = `${frontendUrl}/menu/${restaurantId}?table=${tableNumber}&service=dining&qr_id=${qrCodeId}`;

    // Generate QR code with custom styling for restaurant
    const qrResult = await generateQRCode(qrText, {
      width: 300,
      margin: 2,
      color: {
        dark: "#1a1a1a",
        light: "#ffffff",
      },
    });

    if (!qrResult.success) {
      throw new Error(qrResult.error);
    }

    return {
      success: true,
      qrCodeDataURL: qrResult.dataURL,
      qrText: qrText,
      tableNumber: tableNumber,
      restaurantId: restaurantId,
    };
  } catch (error) {
    console.error("Table QR Code generation error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const generateBulkTableQRCodes = async (restaurantId, tables) => {
  try {
    const qrCodes = [];

    for (const table of tables) {
      const qrResult = await generateTableQRCode(
        restaurantId,
        table.table_number,
        table._id,
        table.qr_code_id,
      );

      if (qrResult.success) {
        qrCodes.push({
          tableId: table._id,
          tableNumber: table.table_number,
          qrCodeDataURL: qrResult.qrCodeDataURL,
          qrText: qrResult.qrText,
        });
      }
    }

    return {
      success: true,
      qrCodes: qrCodes,
      count: qrCodes.length,
    };
  } catch (error) {
    console.error("Bulk QR Code generation error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
