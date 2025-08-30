export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const { chat_id, type, user, rating, message, bug, ip, ua } = req.body;

    // Validasi chat_id
    if (chat_id !== process.env.ID_PANEL) {
        return res.status(403).json({ ok: false, error: "Maaf, kamu bukan Hamzah W.D" });
    }

    let text = "";

    if (type === "rating") {
        text = `
⭐️ *RATING BARU MASUK*
👤 User: ${user}
⭐ Rating: ${rating}
💬 Pesan: ${message || "-"}
🌐 IP: ${ip}
📱 UA: ${ua || "-"}
        `;
    } else if (type === "bug") {
        text = `
🐞 *BUG REPORT BARU*
👤 User: ${user}
🐞 Bug: ${bug || "-"}
💬 Pesan: ${message || "-"}
🌐 IP: ${ip}
📱 UA: ${ua || "-"}
        `;
    } else if (type === "visitor") {
        text = `
👀 *VISITOR BARU*
🌐 IP: ${ip}
📱 UA: ${ua || "-"}
        `;
    } else {
        return res.status(400).json({ ok: false, error: "Invalid type" });
    }

    try {
        await fetch(`https://api.telegram.org/bot${process.env.PANEL_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: process.env.ID_PANEL,
                text,
                parse_mode: "Markdown"
            })
        });

        // Bisa tambahkan pesan khusus kalau chat_id valid
        if (chat_id === process.env.ID_PANEL) {
            return res.status(200).json({ ok: true, message: "Hai Tuan" });
        }
    } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
    }
}
