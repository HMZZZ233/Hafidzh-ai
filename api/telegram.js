export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const { type, user, rating, message, ip } = req.body;
    const token = process.env.PANEL_TOKEN;
    const chatId = process.env.ID_PANEL;

    if (!token || !chatId) {
        return res.status(500).json({ ok: false, error: "Bot token / Chat ID belum di set di env" });
    }

    let text = "";
    if (type === "rating") {
        text = `⭐ *New Rating*\n👤 User: ${user}\n🌟 Rating: ${rating}\n💬 Pesan: ${message}\n🌐 IP: ${ip}`;
    } else if (type === "bug") {
        text = `🐞 *New Bug Report*\n👤 User: ${user}\n💬 Pesan: ${message}\n🌐 IP: ${ip}`;
    } else if (type === "visitor") {
        text = `👀 *New Visitor*\n🌐 IP: ${ip}\n📱 UA: ${message}`;
    } else {
        text = `📩 *New Message*\n${JSON.stringify(req.body, null, 2)}`;
    }

    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: "Markdown"
            })
        });

        return res.status(200).json({ ok: true });
    } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
    }
}
