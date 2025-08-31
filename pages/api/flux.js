export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ status: false, error: "Method not allowed" });
    }

    try {
        const { prompt } = await req.body ? JSON.parse(req.body) : {};

        if (!prompt) {
            return res.status(400).json({ status: false, error: "Prompt is required" });
        }

        // Kirim ke API FLUX dari ENV
        const fluxRes = await fetch(process.env.API_FLUX, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        const result = await fluxRes.json();

        res.status(200).json({ status: true, result });
    } catch (err) {
        res.status(500).json({ status: false, error: "FLUX request failed", detail: err.message });
    }
}
