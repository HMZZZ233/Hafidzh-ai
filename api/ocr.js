import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false, // wajib disable parser default biar bisa handle multipart/form-data
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ status: false, error: "Method not allowed" });
    }

    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ status: false, error: "Upload error" });
        }

        const filePath = files.file[0].filepath;

        try {
            // ambil dari ENV
            const ocrRes = await fetch(process.env.API_OCR, {
                method: "POST",
                body: fs.createReadStream(filePath),
                headers: { "Content-Type": "application/octet-stream" }
            });

            const result = await ocrRes.json();

            res.status(200).json({ status: true, result: result.text });
        } catch (e) {
            res.status(500).json({ status: false, error: "OCR gagal", detail: e.message });
        }
    });
}
