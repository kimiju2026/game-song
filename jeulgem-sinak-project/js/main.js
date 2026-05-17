// ---데이터 저장 (내 플레이리스트 및 현재 추천 곡 정보) ---
let myPlaylist = [];
let currentRecommendedMusic = {
    title: "EDM MIX",
    sub: "(High Energy)"
};

// 메인 화면 카드와 결과 창에서 사용할 게임 데이터
const RECOMMEND_DATA = {
    games: {
        "FPS 게임": [
            { title: "발로란트", sub: "(VALORANT)", genre: "FPS 게임", comment: "빠른 템포 음악과 FPS 조합으로 집중력을 높여보세요!", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop" },
            { title: "오버워치 2", sub: "(Overwatch 2)", genre: "하이퍼 FPS", comment: "팀원들과의 완벽한 연계, 텐션을 올려줄 음악과 함께하세요!", image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop" },
            { title: "배틀그라운드", sub: "(PUBG)", genre: "서바이벌 슈팅", comment: "생존을 위한 사운드 플레이, 감도를 올려줄 완벽한 조합!", image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600&auto=format&fit=crop" }
        ],
        "RPG 게임": [
            { title: "로스트아크", sub: "(LOST ARK)", genre: "MMORPG", comment: "광활한 아크라시아 대륙을 모험할 웅장한 가이드!", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop" },
            { title: "메이플스토리", sub: "(MapleStory)", genre: "사이드스크롤 RPG", comment: "추억과 성장의 대륙, 사냥의 효율을 극대화할 리듬!", image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600&auto=format&fit=crop" }
        ],
        "공포 게임": [
            { title: "데드 바이 데이라이트", sub: "(Dead by Daylight)", genre: "생존 공포", comment: "심장 소리를 감출 몰입감 넘치는 사운드 매칭!", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop" }
        ],
        "시뮬레이션": [
            { title: "동물의 숲", sub: "(Animal Crossing)", genre: "샌드박스 힐링", comment: "나만의 섬에서 잔잔하고 편안하게 즐기는 힐링 레이아웃.", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop" }
        ],
        "리듬 게임": [
            { title: "디제이맥스 리스펙트 V", sub: "(DJMAX)", genre: "전통 리듬게임", comment: "손끝으로 느끼는 전율, 음악 장르와 완벽히 동기화됩니다!", image: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600&auto=format&fit=crop" }
        ]
    },
    music: {
        "EDM": [
            { title: "Neon Drive", sub: "(Cyberpunk Beats)", synthType: "sawtooth", tempo: 130, notes: [110, 130, 146, 165, 110, 146, 165, 196] },
            { title: "EDM MIX", sub: "(High Energy)", synthType: "sawtooth", tempo: 140, notes: [146, 146, 196, 196, 220, 220, 165, 165] }
        ],
        "Lo-fi": [
            { title: "Midnight Coffee", sub: "(Chill Study)", synthType: "triangle", tempo: 75, notes: [261, 329, 392, 523, 349, 440, 523, 659] },
            { title: "Rainy Window", sub: "(Lofi Beats)", synthType: "triangle", tempo: 80, notes: [293, 349, 440, 587, 329, 392, 493, 659] }
        ],
        "힙합": [
            { title: "Boom Bap Classics", sub: "(Underground HipHop)", synthType: "square", tempo: 90, notes: [98, 98, 130, 146, 110, 110, 146, 165] }
        ],
        "락": [
            { title: "Hard Rock Anthems", sub: "(Guitar Shred)", synthType: "sawtooth", tempo: 120, notes: [146, 146, 146, 174, 196, 196, 220, 146] }
        ],
        "클래식": [
            { title: "Chopin Nocturnes", sub: "(Piano Solo)", synthType: "sine", tempo: 65, notes: [523, 659, 783, 1046, 880, 698, 587, 493] },
            { title: "Vivaldi Summer", sub: "(Orchestra Storm)", synthType: "sine", tempo: 150, notes: [440, 523, 659, 880, 783, 659, 523, 440] }
        ]
    }
};

let audioCtx = null;
let synthInterval = null;
let isPlayingSynth = false;

function playSystemSynth(musicData) {
    stopSystemSynth();
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const notes = musicData.notes || [261, 293, 329, 349, 392, 440, 493, 523];
    const type = musicData.synthType || "sine";
    const intervalTime = (60 / (musicData.tempo || 100)) * 1000 * 0.5;
    let currentNoteIndex = 0;
    isPlayingSynth = true;

    synthInterval = setInterval(() => {
        if (!isPlayingSynth) return;
        try {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = type;
            const baseFreq = notes[currentNoteIndex % notes.length];
            osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
            currentNoteIndex++;
        } catch (e) {
            console.error("사운드 재생 중 오류 발생:", e);
        }
    }, intervalTime);
}

function stopSystemSynth() {
    isPlayingSynth = false;
    if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const authModalOverlay = document.getElementById('auth-modal-overlay');
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const goToRegister = document.getElementById('go-to-register');
    const goToLogin = document.getElementById('go-to-login');
    const btnSubmitLogin = document.getElementById('btn-submit-login');
    const btnSubmitRegister = document.getElementById('btn-submit-register');
    const btnLogout = document.getElementById('btn-logout');
    const userNicknameTag = document.getElementById('user-nickname-tag');
    const greetingName = document.getElementById('greeting-name');

    const navItems = document.querySelectorAll('.nav-item');
    const contentViews = document.querySelectorAll('.content-view');
    const backToHome = document.getElementById('back-to-home');

    // 캐러셀 요소 타겟팅
    const cards = document.querySelectorAll('.game-main-card, [class*="game-card"], .carousel-item');
    const prevBtn = document.getElementById('slide-prev-btn');
    const nextBtn = document.getElementById('slide-next-btn');
    let cardIndex = 0;

    const genreNextBtn = document.getElementById('genre-next-btn');
    const genreItems = document.querySelectorAll('.select-item');
    const openShareBtn = document.getElementById('open-share-btn');
    const closeShareBtn = document.getElementById('close-share-btn');
    const shareModalOverlay = document.getElementById('share-modal-overlay');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const shareLinkInput = document.getElementById('share-link-input');

    goToRegister?.addEventListener('click', () => { loginBox.classList.add('hidden'); registerBox.classList.remove('hidden'); });
    goToLogin?.addEventListener('click', () => { registerBox.classList.add('hidden'); loginBox.classList.remove('hidden'); });

    btnSubmitRegister?.addEventListener('click', () => {
        const id = document.getElementById('reg-id').value.trim();
        const pw = document.getElementById('reg-pw').value.trim();
        const name = document.getElementById('reg-name').value.trim();
        if(!id || !pw || !name) return alert('필드를 모두 입력하세요.');
        let users = JSON.parse(localStorage.getItem('appUsers')) || [];
        if(users.some(u => u.id === id)) return alert('이미 존재하는 중복된 아이디입니다.');
        users.push({id, pw, name});
        localStorage.setItem('appUsers', JSON.stringify(users));
        alert('회원가입이 완료되었습니다! 로그인해주세요.'); 
        goToLogin.click();
    });

    btnSubmitLogin?.addEventListener('click', () => {
        const id = document.getElementById('login-id').value.trim();
        const pw = document.getElementById('login-pw').value.trim();
        let users = JSON.parse(localStorage.getItem('appUsers')) || [];
        const user = users.find(u => u.id === id && u.pw === pw);
        if(user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            applyLogin(user.name);
        } else {
            alert('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    });

    btnLogout?.addEventListener('click', () => { if(confirm('로그아웃 하시겠습니까?')) { localStorage.removeItem('currentUser'); location.reload(); } });

    function applyLogin(name) {
        if(authModalOverlay) authModalOverlay.classList.add('hidden');
        
        if(userNicknameTag) {
            userNicknameTag.innerHTML = `<span style="color: var(--brand-green); font-weight: bold;">${name}</span>`;
        }
        
        if(greetingName) {
            greetingName.innerHTML = `<span style="color: var(--brand-green); font-weight: bold;">${name}</span>님`;
        }
    }

    function switchView(id) {
        contentViews.forEach(v => v.id === id ? v.classList.remove('hidden') : v.classList.add('hidden'));
        navItems.forEach(n => {
            const viewId = n.id.replace('menu-', 'view-');
            viewId === id ? n.classList.add('active') : n.classList.remove('active');
        });
        if (id !== 'view-result') {
            stopSystemSynth();
            const playPauseBtn = document.getElementById('synth-play-pause-btn');
            if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play" style="font-size:20px; color:var(--brand-green);"></i>';
            const discIcon = document.getElementById('sidebar-disc-icon');
            if (discIcon) discIcon.style.animation = "none";
        }
    }

    navItems.forEach(n => n.addEventListener('click', () => switchView(n.id.replace('menu-', 'view-'))));
    backToHome?.addEventListener('click', () => switchView('view-main'));

    function initializeMainCards() {
        const genreImageMap = {
            "FPS": "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
            "RPG": "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
            "공포": "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop",
            "리듬": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
            "힐링": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop"
        };

        cards.forEach(card => {
            const cardText = (card.innerText || card.textContent || "").replace(/\s+/g, "");
            let matchedImageUrl = null;

            for (const key in genreImageMap) {
                if (cardText.includes(key)) {
                    matchedImageUrl = genreImageMap[key];
                    break;
                }
            }

            if (matchedImageUrl) {
                card.style.setProperty('background-color', 'transparent', 'important');
                card.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.85)), url('${matchedImageUrl}')`;
                card.style.backgroundSize = "cover";
                card.style.backgroundPosition = "center";
                card.style.backgroundRepeat = "no-repeat";
            }
        });
    }

    cards.forEach(card => {
        const btn = card.querySelector('button') || card.querySelector('.main-start-btn') || card;
        
        const handleCardClick = (e) => {
            e.stopPropagation();
            const cardText = (card.innerText || card.textContent || "").replace(/\s+/g, "");
            const genreButtons = document.querySelectorAll('.select-item');
            let isMatched = false;

            genreButtons.forEach(btn => {
                const btnText = btn.innerText.trim();
                if (cardText.includes(btnText) || btnText.includes(cardText.replace("게임", ""))) {
                    btn.parentElement.querySelectorAll('.select-item').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    isMatched = true;
                }
            });

            if (!isMatched && genreButtons.length > 0) {
                genreButtons[0].classList.add('active');
            }

            switchView('view-genre');
        };

        if (btn !== card) {
            btn.addEventListener('click', handleCardClick);
        }
        card.addEventListener('click', () => {
            if (card.classList.contains('active')) {
                handleCardClick({ stopPropagation: () => {} });
            }
        });
    });

    function updateCards() {
        if (cards.length === 0) return;
        cards.forEach((c, i) => {
            c.classList.remove('active', 'next', 'prev', 'next-secondary', 'prev-secondary');
            if (i === cardIndex) {
                c.classList.add('active');
            } else if (i === (cardIndex + 1) % cards.length) {
                c.classList.add('next');
            } else if (i === (cardIndex + 2) % cards.length) {
                c.classList.add('next-secondary');
            } else if (i === (cardIndex - 1 + cards.length) % cards.length) {
                c.classList.add('prev');
            } else {
                c.classList.add('prev-secondary');
            }
        });
    }

    nextBtn?.addEventListener('click', () => { cardIndex = (cardIndex + 1) % cards.length; updateCards(); });
    prevBtn?.addEventListener('click', () => { cardIndex = (cardIndex - 1 + cards.length) % cards.length; updateCards(); });

    genreItems.forEach(item => {
        item.addEventListener('click', () => {
            const parentGrid = item.parentElement;
            parentGrid.querySelectorAll('.select-item').forEach(btn => btn.classList.remove('active'));
            item.classList.add('active');
        });
    });

    genreNextBtn?.addEventListener('click', () => {
        const groups = document.querySelectorAll('.selection-group');
        const selectedGameZone = groups[0]?.querySelector('.select-item.active');
        const selectedMusicZone = groups[1]?.querySelector('.select-item.active');
        
        let gameGenre = selectedGameZone ? selectedGameZone.innerText.trim() : "FPS 게임";
        let musicGenre = selectedMusicZone ? selectedMusicZone.innerText.trim() : "EDM";

        if (!RECOMMEND_DATA.games[gameGenre] && RECOMMEND_DATA.games[gameGenre + " 게임"]) {
            gameGenre = gameGenre + " 게임";
        } else if (!RECOMMEND_DATA.games[gameGenre] && RECOMMEND_DATA.games[gameGenre.replace(" 게임", "")]) {
            gameGenre = gameGenre.replace(" 게임", "");
        }

        const gamePool = RECOMMEND_DATA.games[gameGenre] || RECOMMEND_DATA.games["FPS 게임"];
        const musicPool = RECOMMEND_DATA.music[musicGenre] || RECOMMEND_DATA.music["EDM"];

        const randomGame = gamePool[Math.floor(Math.random() * gamePool.length)];
        const randomMusic = musicPool[Math.floor(Math.random() * musicPool.length)];

        switchView('view-result');
        renderResultView(randomGame, randomMusic, gameGenre);
    });

    openShareBtn?.addEventListener('click', () => { if(shareModalOverlay) shareModalOverlay.classList.remove('hidden'); });
    closeShareBtn?.addEventListener('click', () => { if(shareModalOverlay) shareModalOverlay.classList.add('hidden'); });
    shareModalOverlay?.addEventListener('click', (e) => { if(e.target === shareModalOverlay) shareModalOverlay.classList.add('hidden'); });

    copyLinkBtn?.addEventListener('click', () => {
        if (shareLinkInput) {
            shareLinkInput.select();
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareLinkInput.value)
                    .then(() => alert('추천 조합 링크가 복사되었습니다! 🎉'))
                    .catch(() => alert('링크 복사에 실패했습니다.'));
            } else {
                document.execCommand('copy');
                alert('추천 조합 링크가 복사되었습니다! 🎉');
            }
        }
    });

    const sidebarMiniPlayer = document.querySelector('.mini-player-box');
    const sidebarHeartBtn = sidebarMiniPlayer?.querySelector('.save-heart');
    if (sidebarHeartBtn) sidebarHeartBtn.addEventListener('click', handleTogglePlaylist);

    function renderResultView(gameData, musicData, gameCategoryName) {
        currentRecommendedMusic.title = musicData.title;
        currentRecommendedMusic.sub = musicData.sub;
        
        const gameCard = document.getElementById('game-result-card');
        const gameCategoryLabel = document.getElementById('game-category-label');
        if (gameCategoryLabel) gameCategoryLabel.innerText = `추천 게임 (${gameCategoryName})`;
        
        if (gameCard) {
            gameCard.className = "pick-card pick-card-img-bg";
            gameCard.style.backgroundImage = `url('${gameData.image}')`;
            const gameTitleEl = document.getElementById('res-game-title');
            const gameSubEl = document.getElementById('res-game-sub');
            if (gameTitleEl) gameTitleEl.innerText = gameData.title;
            if (gameSubEl) gameSubEl.innerText = gameData.sub; 
        }

        const musicCard = document.getElementById('music-result-card');
        if (musicCard) {
            const musicTitleEl = document.getElementById('res-music-title');
            const musicSubEl = document.getElementById('res-music-sub');
            if (musicTitleEl) musicTitleEl.innerText = musicData.title;
            if (musicSubEl) musicSubEl.innerText = musicData.sub;
        }

        const sideTrackTitle = document.getElementById('side-track-title');
        const sideTrackSub = document.getElementById('side-track-sub');
        if (sideTrackTitle && sideTrackSub) {
            sideTrackTitle.innerText = musicData.title;
            sideTrackSub.innerText = musicData.sub;
        }

        const gameCommentBox = document.getElementById('game-comment-box');
        if (gameCommentBox) gameCommentBox.innerHTML = `"${gameData.comment || '음악과 함께 몰입도를 극대화해보세요!'}"`;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const targetNameEl = document.getElementById('result-user-name');
        if (targetNameEl) {
            const displayValue = currentUser ? currentUser.name : "사용자";
            targetNameEl.innerHTML = `<span style="color: var(--brand-green); font-weight: bold;">${displayValue}</span>`;
        }

        /* ==========================================================================
         플레이어 박스 크기 맞추기
           ========================================================================== */
        const videoStatusBox = document.getElementById('game-video-status-box');
        if (videoStatusBox) {
            videoStatusBox.style.display = "block";
            videoStatusBox.style.padding = "0";
            videoStatusBox.style.overflow = "hidden";
            videoStatusBox.style.position = "relative";
            videoStatusBox.style.borderRadius = "12px";
            
            // 대칭 설정
            videoStatusBox.innerHTML = `
                <div class="audio-player-wrapper" style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px;">
                    <div style="font-size:12px; color:var(--text-sub); margin-bottom:4px;">🎮 시스템 동시 플레이</div>
                    <button style="background: #222; border: 2px solid var(--brand-green); width: 50px; height: 50px; border-radius: 50%; cursor: default; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 10px rgba(30,215,96,0.3);">
                        <i class="fas fa-gamepad" style="font-size:20px; color:var(--brand-green);"></i>
                    </button>
                    <div style="font-size:11px; color:var(--brand-green); margin-top:4px; letter-spacing:1px; text-transform: uppercase;">
                        ${gameData.title} PLAYING
                    </div>
                </div>
            `;
        }

        const audioZone = document.getElementById('music-audio-player-zone');
        const discIcon = document.getElementById('sidebar-disc-icon');

        if (audioZone) {
            audioZone.innerHTML = `
                <div class="audio-player-wrapper" style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px;">
                    <div style="font-size:12px; color:var(--text-sub); margin-bottom:4px;">🎧 무차단 시스템 신디사이저 플레이어</div>
                    <button id="synth-play-pause-btn" style="background: #222; border: 2px solid var(--brand-green); width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 10px rgba(30,215,96,0.3); transition: transform 0.1s;">
                        <i class="fas fa-pause" style="font-size:20px; color:var(--brand-green);"></i>
                    </button>
                    <div style="font-size:11px; color:var(--brand-green); margin-top:4px; letter-spacing:1px;" id="synth-status-text">LIVE SYNTH PLAYING</div>
                </div>
            `;

            playSystemSynth(musicData);
            if (discIcon) discIcon.style.animation = "rotate 4s linear infinite";
            if (sideTrackTitle) sideTrackTitle.style.color = "var(--brand-green)";

            const playPauseBtn = document.getElementById('synth-play-pause-btn');
            const statusText = document.getElementById('synth-status-text');

            playPauseBtn?.addEventListener('click', () => {
                if (isPlayingSynth) {
                    stopSystemSynth();
                    playPauseBtn.innerHTML = '<i class="fas fa-play" style="font-size:20px; color:var(--brand-green); margin-left:3px;"></i>';
                    if (statusText) statusText.innerText = "PLAYER PAUSED";
                    if (discIcon) discIcon.style.animation = "none";
                    if (sideTrackTitle) sideTrackTitle.style.color = "#fff";
                } else {
                    playSystemSynth(musicData);
                    playPauseBtn.innerHTML = '<i class="fas fa-pause" style="font-size:20px; color:var(--brand-green);"></i>';
                    if (statusText) statusText.innerText = "LIVE SYNTH PLAYING";
                    if (discIcon) discIcon.style.animation = "rotate 4s linear infinite";
                    if (sideTrackTitle) sideTrackTitle.style.color = "var(--brand-green)";
                }
            });
        }

        let heartBtn = musicCard?.querySelector('.save-heart');
        if (!heartBtn && musicCard) {
            const cardDetail = musicCard.querySelector('.card-detail');
            if (cardDetail) {
                heartBtn = document.createElement('button');
                heartBtn.className = 'save-heart';
                heartBtn.innerHTML = '<i class="far fa-heart"></i>';
                cardDetail.appendChild(heartBtn);
            }
        }
        if (heartBtn) {
            heartBtn.removeEventListener('click', handleTogglePlaylist);
            heartBtn.addEventListener('click', handleTogglePlaylist);
        }
        syncHeartButtonsState();
    }

    function syncHeartButtonsState() {
        const isAlreadyAdded = myPlaylist.some(item => item.title === currentRecommendedMusic.title);
        const musicCard = document.getElementById('music-result-card');
        const cardHeartBtn = musicCard?.querySelector('.save-heart');
        const miniPlayerHeartBtn = document.querySelector('.mini-player-box .save-heart');

        [cardHeartBtn, miniPlayerHeartBtn].forEach(btn => {
            if (!btn) return;
            if (isAlreadyAdded) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    }

    function handleTogglePlaylist(e) {
        e.stopPropagation(); 
        const existingIndex = myPlaylist.findIndex(item => item.title === currentRecommendedMusic.title);
        if (existingIndex > -1) {
            myPlaylist.splice(existingIndex, 1);
            alert(`"${currentRecommendedMusic.title}" 곡이 내 플레이리스트에서 삭제되었습니다.`);
        } else {
            myPlaylist.push({
                id: Date.now(),
                title: currentRecommendedMusic.title,
                sub: currentRecommendedMusic.sub,
                addedAt: new Date().toLocaleDateString()
            });
            alert(`"${currentRecommendedMusic.title}" 곡이 내 플레이리스트에 추가되었습니다! 🎉`);
        }
        syncHeartButtonsState();
        updatePlaylistDOM();
    }

    window.deletePlaylistItem = function(id) {
        const index = myPlaylist.findIndex(item => item.id === id);
        if (index > -1) {
            const deletedTitle = myPlaylist[index].title;
            myPlaylist.splice(index, 1);
            alert(`"${deletedTitle}" 곡이 삭제되었습니다.`);
            updatePlaylistDOM();
            syncHeartButtonsState();
        }
    };

    function updatePlaylistDOM() {
        const playlistCountEl = document.getElementById('playlist-count');
        if (playlistCountEl) playlistCountEl.innerText = `저장된 곡: ${myPlaylist.length}곡`;

        const playlistTableBody = document.querySelector('.playlist-table tbody');
        if (playlistTableBody) {
            playlistTableBody.innerHTML = ''; 
            if (myPlaylist.length === 0) {
                playlistTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#777; padding: 30px;">플레이리스트가 비어 있습니다.</td></tr>`;
                return;
            }
            myPlaylist.forEach((track, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="color: var(--brand-green); font-weight: bold; vertical-align: middle;">${index + 1}</td>
                    <td style="vertical-align: middle;">
                        <div style="font-weight: bold; color: #fff;">${track.title}</div>
                        <div style="font-size: 12px; color: var(--text-sub);">${track.sub}</div>
                    </td>
                    <td style="color: var(--text-sub); font-size: 13px; vertical-align: middle;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <span>${track.addedAt}</span>
                            <i class="fas fa-trash-alt" 
                               style="cursor: pointer; color: #555; transition: color 0.2s;" 
                               onmouseover="this.style.color='#ff5b5b'" 
                               onmouseout="this.style.color='#555'" 
                               onclick="deletePlaylistItem(${track.id})">
                            </i>
                        </div>
                    </td>
                `;
                playlistTableBody.appendChild(tr);
            });
        }
    }

    const cur = JSON.parse(localStorage.getItem('currentUser'));
    if(cur) {
        applyLogin(cur.name); 
    } else {
        if(authModalOverlay) authModalOverlay.classList.remove('hidden');
    }
    
    initializeMainCards();
    updateCards();
    updatePlaylistDOM(); 
    syncHeartButtonsState();
});