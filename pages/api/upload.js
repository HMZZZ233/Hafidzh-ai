import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
    api: { bodyParser: false }, // WAJIB: matikan parser default Next.js
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Pastikan folder upload ada
    const uploadDir = path.join(process.cwd(), "public/imagesUpload");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Setup formidable
    const form = formidable({
        multiples: false,
        uploadDir,
        keepExtensions: true
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: "Upload gagal" });
        }

        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!file) {
            return res.status(400).json({ error: "Tidak ada file" });
        }

        const filename = path.basename(file.filepath);
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const url = `${siteUrl}/imagesUpload/${filename}`;

        return res.status(200).json({ url });
    });
}
