export const config = {
    api: {
        responseLimit: false, // biar bisa nerima file besar
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ status: false, error: "Method not allowed" });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ status: false, error: "Prompt kosong" });
        }

        // Request ke API Flux
        const fluxRes = await fetch(process.env.API_FLUX, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        // Ambil hasilnya dalam bentuk buffer (gambar)
        const buffer = Buffer.from(await fluxRes.arrayBuffer());

        // Balikin ke frontend sebagai image/png
        res.setHeader("Content-Type", "image/png");
        res.status(200).send(buffer);
    } catch (e) {
        res.status(500).json({ status: false, error: e.message });
    }
}
