// /api/upload.js
export const config = {
    api: {
        bodyParser: false, // penting biar bisa handle FormData / file upload
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Ambil buffer dari form upload
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Dummy: balikin langsung jadi base64 (biar keliatan bisa upload)
        const base64 = buffer.toString("base64");

        // Sementara kasih URL dummy, nanti bisa lo ganti upload ke Cloudinary/ImgBB
        return res.status(200).json({
            url: `data:image/png;base64,${base64}`,
        });
    } catch (err) {
        console.error("Upload error:", err);
        return res
            .status(500)
            .json({ error: "Upload gagal", detail: err.message });
    }
}
