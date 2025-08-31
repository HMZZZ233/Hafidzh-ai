export default async function handler(req, res) {
    try {
        const { content } = req.query;

        const url = `${process.env.API_CHAT}?prompt=${encodeURIComponent(process.env.CHAT_PROMPT)}&content=${encodeURIComponent(content)}`;
        const response = await fetch(url);
        const data = await response.json();

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
}
