// /api/upload.js
export const config = {
    api: {
        bodyParser: false,
    },
};
import formidable from "formidable";
import fs from "fs";
import path from "path";
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: "Upload failed", detail: err.message });
        }
        const file = files.file[0];
        const tempPath = file.filepath;
        const newPath = path.join(process.cwd(), "public", file.originalFilename);
        fs.rename(tempPath, newPath, (err) => {
            if (err) return res.status(500).json({ error: "File move failed", detail: err.message });
            const fileUrl = `/` + file.originalFilename;
            res.status(200).json({ url: fileUrl });
        });
    });
}
