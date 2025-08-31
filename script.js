document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menuBtn');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const messageInput = document.getElementById('messageInput');
    const voiceBtn = document.getElementById('voiceBtn');
    const addBtn = document.getElementById('addBtn');
    const addIcon = document.getElementById('addIcon');
    const plusMenu = document.getElementById('plusMenu');
    const chatContainer = document.getElementById('chatContainer');
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModal = document.getElementById('aboutModal');
    const closeAboutModal = document.getElementById('closeAboutModal');
    const ratingsBtn = document.getElementById('ratingsBtn');
    const ratingsModal = document.getElementById('ratingsModal');
    const closeRatingsModal = document.getElementById('closeRatingsModal');
    const newChatBtn = document.getElementById('newChatBtn');
    const generateImageBtn = document.getElementById('generateImageBtn');
    const imagePromptInput = document.getElementById('imagePrompt');
    const imageResult = document.getElementById('imageResult');
    const imageModal = document.getElementById('imageModal');
    const closeImageModal = document.getElementById('closeImageModal');
    const submitRatingBtn = document.querySelector('.submit-rating');
    const ratingTextarea = document.querySelector('.modal-body textarea');
    const ratingUsername = document.getElementById('ratingUsername');
    let selectedRating = 0;
    
    // Fungsi buat pop-up
    function showPopup(msg, success) {
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = `
            <div class="popup-content ${success ? 'success' : 'error'}">
                <p>${msg}</p>
                <div class="popup-actions">
                    <button id="popupClose">Close</button>
                    <button id="popupOk">Ok</button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById("popupClose").onclick = () => popup.remove();
        document.getElementById("popupOk").onclick = () => popup.remove();
    }
    generateImageBtn.addEventListener('click', async () => {
        const prompt = imagePromptInput.value.trim();
        if (!prompt) {
            alert("Masukkan deskripsi gambar terlebih dahulu!");
            return;
        }
        imageResult.innerHTML = "⏳ Sedang membuat gambar...";
        try {
            const res = await fetch('/api/flux', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            if (data.status) {
                imageResult.innerHTML = `<img src="${data.result.url}" alt="Generated Image" style="max-width:100%;border-radius:10px;"/>`;
            } else {
                imageResult.innerHTML = "⚠️ Gagal membuat gambar.";
            }
        } catch (err) {
            imageResult.innerHTML = "🚨 Error koneksi ke server FLUX.";
        }
    });
    closeImageModal.addEventListener('click', () => {
        imageModal.classList.add('hidden');
    });
    menuBtn.addEventListener('click', function() {
        sidebar.classList.add('open');
        overlay.classList.add('show');
    });
    closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        plusMenu.classList.remove('show');
        addBtn.classList.remove('rotate');
    });
    messageInput.addEventListener('input', function() {
        if (messageInput.value.trim() !== '') {
            voiceBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            voiceBtn.classList.add('send-btn');
        } else {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.classList.remove('send-btn');
        }
    });
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;
        addMessage(message, 'user');
        messageInput.value = '';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.classList.remove('send-btn');
        try {
            const res = await fetch(`/api/chat?content=${encodeURIComponent(message)}`);
            const data = await res.json();
            if (data.status) {
                addMessage(data.data, 'ai');
            } else {
                addMessage("Maaf, AI tidak bisa memproses jawaban.", 'ai');
            }
        } catch (err) {
            addMessage("Error koneksi ke server Hafidzh AI.", 'ai');
        }
    }
    voiceBtn.addEventListener('click', function() {
        if (messageInput.value.trim() !== '') {
            sendMessage();
        }
    });
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && messageInput.value.trim() !== '') {
            sendMessage();
        }
    });
    addBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        plusMenu.classList.toggle('show');
        addBtn.classList.toggle('rotate');
        
        if (addBtn.classList.contains('rotate')) {
            addIcon.className = 'fas fa-times';
        } else {
            addIcon.className = 'fas fa-plus';
        }
    });
    document.addEventListener('click', function(e) {
        if (!plusMenu.contains(e.target) && e.target !== addBtn) {
            plusMenu.classList.remove('show');
            addBtn.classList.remove('rotate');
            addIcon.className = 'fas fa-plus';
        }
    });
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender + '-message');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageElement.innerHTML = `
            <div class="message-text">${text}</div>
            <div class="message-time">${time}</div>
        `;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage && sender === 'user') {
            welcomeMessage.remove();
        }
    } 
    aboutBtn.addEventListener('click', function() {
        aboutModal.classList.remove('hidden');
    });
    closeAboutModal.addEventListener('click', function() {
        aboutModal.classList.add('hidden');
    });
    ratingsBtn.addEventListener('click', function() {
        ratingsModal.classList.remove('hidden');
    });
    closeRatingsModal.addEventListener('click', function() {
        ratingsModal.classList.add('hidden');
    });
    const starsSelect = document.querySelectorAll('.rating-stars i');
    starsSelect.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            selectedRating = rating;
            // Update stars appearance
            starsSelect.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                    s.className = 'fas fa-star active';
                } else {
                    s.classList.remove('active');
                    s.className = 'far fa-star';
                }
            });
        });
        
        star.addEventListener('mouseover', function() {
            const rating = this.getAttribute('data-rating');
            
            starsSelect.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            const activeRating = document.querySelector('.rating-stars i.active');
            const currentRating = activeRating ? activeRating.getAttribute('data-rating') : 0;
            
            starsSelect.forEach(s => {
                if (s.getAttribute('data-rating') <= currentRating) {
                    s.className = 'fas fa-star active';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
    });

    // Submit Rating
    submitRatingBtn.addEventListener('click', async () => {
        if (!selectedRating) {
            showPopup("Pilih rating dulu!", false);
            return;
        }

        const userMessage = ratingTextarea.value.trim();
        const ip = await fetch("https://api64.ipify.org?format=json")
            .then(res => res.json())
            .then(d => d.ip)
            .catch(() => "Unknown");

        try {
            const res = await fetch("/api/telegram", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: ratingUsername.value.trim() || "anonymous",
                    rating: selectedRating,
                    message: userMessage,
                    ip
                })
            });

            const data = await res.json();
            if (res.ok && data.ok) {
                showPopup("Ratings anda berhasil terkirim status code: 200", true);
            } else {
                showPopup("Maaf, Ratings anda tidak terkirim\nErr: " + (data.error || "Unknown"), false);
            }
        } catch (err) {
            showPopup("Maaf, Ratings anda tidak terkirim\nErr: " + err.message, false);
        }
    });

    // Popup Function
    function showPopup(msg, success) {
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = `
            <div class="popup-content ${success ? 'success' : 'error'}">
                <button class="popup-close"><i class="fas fa-times"></i></button>
                <p>${msg}</p>
            </div>
        `;
        document.body.appendChild(popup);

        // style inline biar ngikut tema
        const content = popup.querySelector(".popup-content");
        content.style.borderTop = success ? "5px solid var(--hijau)" : "5px solid #e74c3c";
        content.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

        popup.querySelector(".popup-close").onclick = () => popup.remove();
        setTimeout(() => popup.remove(), 5000);
    }
    
    // New chat functionality
    newChatBtn.addEventListener('click', function() {
        // Clear chat container
        chatContainer.innerHTML = '';
        
        // Add welcome message
        const welcomeMessage = document.createElement('div');
        welcomeMessage.classList.add('welcome-message');
        welcomeMessage.innerHTML = `
            <div class="welcome-icon">
                <i class="fas fa-star-and-crescent"></i>
            </div>
            <h2>Selamat Datang di Hafidzh AI</h2>
            <p>AI assistant yang siap membantu Anda dengan berbagai pertanyaan dan kebutuhan</p>
        `;
        
        chatContainer.appendChild(welcomeMessage);
        
        // Close sidebar
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });
});
