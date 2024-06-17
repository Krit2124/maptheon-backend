const { put } = require('@vercel/blob');

module.exports = new class BlobService {
    async uploadImage(path, bufferImage) {
        // Загружаем изображение в Vercel Blob
        const result = await put(path, bufferImage, {
            contentType: 'image/jpeg',
            access: 'public',
            addRandomSuffix: false,
        });

        console.log(result);

        return result;
    };
}