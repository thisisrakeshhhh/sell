export class UploadService {
  constructor(private r2Bucket: R2Bucket) {}

  /**
   * Generates structured R2 object keys and pre-signed PUT URLs
   */
  async createProductImageUpload(productCode: string, mediaType: string = "front") {
    const r2Key = `products/${productCode}/${mediaType}.webp`;
    const publicUrl = `https://cdn.jerseyflow.com/${r2Key}`;
    return { r2Key, publicUrl };
  }

  async createReceiptUpload(orderNumber: string) {
    const timestamp = Date.now();
    const r2Key = `payments/${orderNumber}/receipt_${timestamp}.webp`;
    const publicUrl = `https://cdn.jerseyflow.com/${r2Key}`;
    return { r2Key, publicUrl };
  }

  async createLogoUpload(storeId: string) {
    const r2Key = `logos/${storeId}/logo.webp`;
    const publicUrl = `https://cdn.jerseyflow.com/${r2Key}`;
    return { r2Key, publicUrl };
  }
}
