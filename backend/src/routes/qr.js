import express from "express";
import {
  generateQRCode,
  generateTableQRCode,
  generateBulkTableQRCodes,
} from "../utils/qrCodeGenerator.js";
import Table from "../models/Table.js";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// Generate QR code for any text
router.post("/generate", async (req, res) => {
  try {
    const { text, options = {} } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required for QR code generation",
      });
    }

    const result = await generateQRCode(text, options);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate QR code",
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: {
        qrCodeDataURL: result.dataURL,
        text: result.text,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Generate QR code for a specific table
router.get("/table/:tableId", async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await Table.findById(tableId).populate("restaurant_id");

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    const result = await generateTableQRCode(
      table.restaurant_id._id,
      table.table_number,
      table._id,
      table.qr_code_id,
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate table QR code",
        error: result.error,
      });
    }

    // Update table with QR code image
    table.qr_code_image = result.qrCodeDataURL;
    await table.save();

    res.json({
      success: true,
      data: {
        tableId: table._id,
        tableNumber: table.table_number,
        qrCodeDataURL: result.qrCodeDataURL,
        qrText: result.qrText,
        restaurant: {
          id: table.restaurant_id._id,
          name: table.restaurant_id.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Generate QR codes for all tables in a restaurant
router.get("/restaurant/:restaurantId/tables", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const tables = await Table.find({
      restaurant_id: restaurantId,
      is_active: true,
    }).sort({ table_number: 1 });

    if (tables.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tables found for this restaurant",
      });
    }

    const result = await generateBulkTableQRCodes(restaurantId, tables);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate QR codes",
        error: result.error,
      });
    }

    // Update tables with QR code images
    for (const qrData of result.qrCodes) {
      await Table.findByIdAndUpdate(qrData.tableId, {
        qr_code_image: qrData.qrCodeDataURL,
      });
    }

    res.json({
      success: true,
      data: {
        restaurant: {
          id: restaurant._id,
          name: restaurant.name,
        },
        qrCodes: result.qrCodes,
        count: result.count,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Regenerate QR code for a table (useful when QR gets damaged)
router.post("/table/:tableId/regenerate", async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await Table.findById(tableId).populate("restaurant_id");

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // Generate new QR code ID for security
    const { v4: uuidv4 } = await import("uuid");
    table.qr_code_id = uuidv4();

    const result = await generateTableQRCode(
      table.restaurant_id._id,
      table.table_number,
      table._id,
      table.qr_code_id,
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to regenerate table QR code",
        error: result.error,
      });
    }

    // Update table with new QR data
    table.qr_code_url = result.qrText;
    table.qr_code_image = result.qrCodeDataURL;
    await table.save();

    res.json({
      success: true,
      message: "QR code regenerated successfully",
      data: {
        tableId: table._id,
        tableNumber: table.table_number,
        qrCodeDataURL: result.qrCodeDataURL,
        qrText: result.qrText,
        qrCodeId: table.qr_code_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
