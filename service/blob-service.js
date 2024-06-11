const { Blob } = require('@vercel/blob');

const blob = new Blob({
  url: process.env.VERCEL_BLOB_URL,
  token: process.env.VERCEL_BLOB_TOKEN,
});

module.exports = new class BlobService {
    async uploadImage(path, bufferImage) {
        // Загружаем изображение в Vercel Blob
        const result = await blob.put(path, bufferImage, {
            contentType: 'image/jpeg',
            access: 'public',
            addRandomSuffix: false,
        });

        console.log(result);

        return result;
    };
    
    // async getImageURL(id_map) {
    //     // Получаем URL изображения
    //     const url = getURL(`mapsFullSize/${id_map}.jpg`);
    //     return url;
    // };
}