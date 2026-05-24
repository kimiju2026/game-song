// --- GameBeat 상태 ---
let myPlaylist = [];
let currentRecommendedMusic = { title: "EDM MIX", sub: "(High Energy)" };
let currentPick = { game: null, music: null, keyword: "" };
let chosenRouletteKeyword = "";

const ROULETTE_KEYWORD_POOL = [
    "박자감", "슈팅, 경쟁", "긴장감, 심리", "탐험, 크래프팅",
    "자유도, 액션", "감동, 몰입", "고난도, 패링", "반복플레이, 랜덤", "여유, 정리"
];

const MOOD_KEYWORD_MAP = {
    "집중": ["박자감", "슈팅, 경쟁"],
    "감성": ["감동, 몰입"],
    "텐션업": ["슈팅, 경쟁", "고난도, 패링"],
    "힐링": ["여유, 정리", "탐험, 크래프팅"]
};

const GENRE_DEFAULT_KEYWORDS = {
    "FPS 게임": ["슈팅, 경쟁", "박자감"],
    "RPG 게임": ["감동, 몰입", "탐험, 크래프팅"],
    "공포 게임": ["긴장감, 심리"],
    "생존 게임": ["탐험, 크래프팅", "긴장감, 심리"],
    "오픈월드": ["자유도, 액션", "탐험, 크래프팅"],
    "스토리 게임": ["감동, 몰입"],
    "소울라이크": ["고난도, 패링", "긴장감, 심리"],
    "로그라이크": ["반복플레이, 랜덤", "고난도, 패링"],
    "시뮬레이션": ["여유, 정리"],
    "리듬 게임": ["박자감"],
    "힐링 게임": ["여유, 정리", "감동, 몰입"]
};

const MUSIC_GENRE_KEYWORDS = {
    "팝": ["감동, 몰입", "여유, 정리"],
    "힙합": ["슈팅, 경쟁", "박자감"],
    "EDM": ["박자감", "슈팅, 경쟁", "고난도, 패링"],
    "Lo-fi": ["여유, 정리", "탐험, 크래프팅"],
    "락": ["슈팅, 경쟁", "고난도, 패링"],
    "재즈": ["감동, 몰입", "여유, 정리"],
    "클래식": ["감동, 몰입", "여유, 정리"],
    "제이팝": ["박자감", "감동, 몰입"]
};

const MUSIC_DEFAULT_IMAGE = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop";

const MASTER_RANKING_SEED = [
    { game: "발로란트", music: "EDM MIX", count: 1209 },
    { game: "로스트아크", music: "River Flows in You", count: 943 },
    { game: "스타듀 밸리", music: "Midnight Coffee", count: 882 },
    { game: "발로란트", music: "Neon Drive", count: 754 },
    { game: "Cyberpunk 2077", music: "Kick Back", count: 621 }
];

const STORAGE_KEYS = {
    rankings: "gamebeat_rankings",
    theme: "gamebeat_theme"
};

// 메인 화면 카드와 결과 창에서 사용할 게임 데이터
const RECOMMEND_DATA = {
    games: {
        "FPS 게임": [
            { title: "발로란트", sub: "(VALORANT)", genre: "FPS 게임", comment: "빠른 템포 음악과 FPS 조합으로 집중력을 높여보세요!", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop" },
            { title: "오버워치 2", sub: "(Overwatch 2)", genre: "하이퍼 FPS", comment: "팀원들과의 완벽한 연계, 텐션을 올려줄 음악과 함께하세요!", image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop" },
            { title: "배틀그라운드", sub: "(PUBG)", genre: "서바이벌 슈팅", comment: "생존을 위한 사운드 플레이, 감도를 올려줄 완벽한 조합!", image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600&auto=format&fit=crop" },
            { title: "Counter-Strike 2", sub: "(카운터 스트라이크 2)", genre: "전술 슈팅 FPS", comment: "전술적인 움직임과 완벽한 브리핑, 승리를 부르는 리듬!", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop" },
            { title: "War Thunder", sub: "(워 썬더)", genre: "밀리터리 슈팅 시뮬레이션", comment: "웅장한 전장의 포화 속에서 몰입감을 더해줄 사운드 조합!", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop" }
        ],
        "RPG 게임": [
            { title: "로스트아크", sub: "(LOST ARK)", genre: "MMORPG", comment: "광활한 아크라시아 대륙을 모험할 웅장한 가이드!", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop" },
            { title: "메이플스토리", sub: "(MapleStory)", genre: "사이드스크롤 RPG", comment: "추억과 성장의 대륙, 사냥의 효율을 극대화할 리듬!", image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600&auto=format&fit=crop" }
        ],
        "공포 게임": [
            { title: "데드 바이 데이라이트", sub: "(Dead by Daylight)", genre: "생존 공포", comment: "심장 소리를 감출 몰입감 넘치는 사운드 매칭!", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop" },
            { title: "The Backrooms", sub: "(백룸)", genre: "탈출 공포", comment: "끝없는 미로와 기괴한 공간, 한 치 앞도 알 수 없는 긴장감!", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop" },
            { title: "8번 출구", sub: "(The Exit 8)", genre: "단편 공포 시뮬레이션", comment: "이상 현상을 찾아내라! 관찰력과 집중력을 극대화할 조합.", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop" },
            { title: "Buckshot Roulette", sub: "(벅샷 룰렛)", genre: "스릴러 보드게임", comment: "목숨을 건 베팅, 심장을 조여오는 사운드 매치!", image: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600&auto=format&fit=crop" },
            { title: "Poppy Playtime", sub: "(파피 플레이타임)", genre: "퍼즐 호러", comment: "장난감 공장의 숨겨진 비밀을 밝혀낼 스릴 넘치는 동반자.", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop" },
            { title: "The Witch's House", sub: "(마녀의 집)", genre: "쯔꾸르 공포", comment: "클래식한 도트 속 반전 스토리, 몰입감을 더해줄 감성.", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop" },
            { title: "DON'T SCREAM", sub: "(돈 스크림)", genre: "마이크 연동 공포", comment: "소리 내면 처음부터! 숨소리조차 삼키게 만드는 극한의 서스펜스.", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop" },
            { title: "후즈 앳 더 도어", sub: "(Who's at the door?)", genre: "심리적 공포", comment: "문 밖의 정체는 무엇일까? 문틈 사이 긴장감을 조율할 비트.", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop" }
        ],
        "생존 게임": [
            { title: "Subnautica", sub: "(서브노티카)", genre: "해양 생존 어드벤처", comment: "심해의 신비로움과 외로움을 달래줄 깊고 푸른 사운드.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop" },
            { title: "Raft", sub: "(래프트)", genre: "해상 생존 크래프팅", comment: "뗏목 위에서 펼쳐지는 끝없는 바다 항해, 청량한 음악과 함께!", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop" },
            { title: "Grounded", sub: "(그라운디드)", genre: "마이크로 생존", comment: "마당 구석 곤충들과의 사투! 작아진 세계 속 거대한 모험.", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop" },
            { title: "The Forest", sub: "(더 포레스트)", genre: "식인종 섬 생존 호러", comment: "울창한 숲속 생존 크래프팅, 밤이 찾아오기 전 텐션을 올리세요.", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop" },
            { title: "플래닛 크래프터", sub: "(The Planet Crafter)", genre: "우주 테라포밍 생존", comment: "황량한 행성을 생명이 숨 쉬는 곳으로 바꿀 웅장한 테마.", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" },
            { title: "하이드로니어", sub: "(Hydroneer)", genre: "기계 공학 채굴 생존", comment: "나만의 자동화 광산을 건설하자! 반복 작업의 재미를 돋울 비트.", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop" },
            { title: "Oxygen Not Included", sub: "(산소 미포함)", genre: "우주 기지 시뮬레이션 생존", comment: "복제체들의 생존 복지 향상! 복잡한 뇌를 식혀줄 편안한 사운드.", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" },
            { title: "60초!", sub: "(60 Seconds!)", genre: "방공호 생존 전략", comment: "종말 이후 방공호에서의 하루하루, 선택의 기로 속 스릴 매칭.", image: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600&auto=format&fit=crop" }
        ],
        "오픈월드": [
            { title: "Grand Theft Auto V", sub: "(GTA 5)", genre: "오픈월드 액션 어드벤처", comment: "로스 산토스의 거리를 질주할 때 어울리는 완벽한 라디오 감성 비트!", image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop" },
            { title: "Cyberpunk 2077", sub: "(사이버펑크 2077)", genre: "오픈월드 액션 RPG", comment: "나이트 시티의 네온사인과 어우러지는 강렬한 미래형 테마.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop" }
        ],
        "스토리 게임": [
            { title: "산나비", sub: "(SANABI)", genre: "조선 사이버펑크 액션", comment: "가슴을 울리는 스토리와 와이어 액션, 감동의 여운을 증폭시킬 음악.", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop" },
            { title: "UNDERTALE", sub: "(언더테일)", genre: "선택형 스토리 RPG", comment: "당신의 의지가 가득 차오른다! 독창적인 세계관에 녹아드는 선율.", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop" },
            { title: "To the Moon", sub: "(투 더 문)", genre: "감동 스토리 어드벤처", comment: "달로 가고 싶었던 기억을 조각하는 감동적인 멜로디의 하모니.", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop" },
            { title: "Ori and the Blind Forest", sub: "(오리와 눈먼 숲)", genre: "메트로베니아 어드벤처", comment: "한 편의 동화 같은 연출과 아름다운 배경, 몽환적인 몰입감.", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop" },
            { title: "Little Nightmares", sub: "(리틀 나이트메어)", genre: "미스터리 퍼즐 어드벤처", comment: "어린아이의 시선으로 마주하는 기괴한 악몽 속 숨막히는 잔혹 동화.", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop" },
            { title: "클레르 옵스퀴르", sub: "(Clair Obscur: Expedition 33)", genre: "스토리 중심 RPG", comment: "예술적인 그래픽과 무게감 있는 서사를 더 화려하게 꾸며줄 조합.", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop" }
        ],
        "소울라이크": [
            { title: "Lies of P", sub: "(P의 거짓)", genre: "다크 판타지 소울라이크", comment: "피노키오의 잔혹한 여정, 완벽한 패링 타이밍을 이끌어낼 긴장감!", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop" },
            { title: "Dark Souls", sub: "(다크 소울)", genre: "정통 소울라이크 RPG", comment: "유 다이(YOU DIED)의 연속 속에서도 꺾이지 않는 투지를 불태울 비트.", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop" },
            { title: "Sekiro: Shadows Die Twice", sub: "(세키로)", genre: "검극 액션 소울라이크", comment: "챙강! 불꽃 튀는 검극 액션, 극강의 집중력을 완성하는 조합.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop" },
            { title: "Hollow Knight", sub: "(할로우 나이트)", genre: "다크 메트로베니아", comment: "쇠락한 곤충 왕국 신네스트를 탐험할 쓸쓸하고 아름다운 동반 사운드.", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop" }
        ],
        "로그라이크": [
            { title: "Skul: The Hero Slayer", sub: "(스컬)", genre: "2D 횡스크롤 로그라이크", comment: "머리를 바꿔가며 싸우는 해골의 유쾌하고 다이내믹한 리듬 액션!", image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600&auto=format&fit=crop" },
            { title: "The Binding of Isaac: Rebirth", sub: "(아이작의 번제)", genre: "탑다운 슈팅 로그라이크", comment: "기괴하고 중독성 넘치는 지하 세계 탐험, 무한 반복 플레이용 찰떡 비트.", image: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600&auto=format&fit=crop" }
        ],
        "시뮬레이션": [
            { title: "동물의 숲", sub: "(Animal Crossing)", genre: "샌드박스 힐링", comment: "나만의 섬에서 잔잔하고 편안하게 즐기는 힐링 레이아웃.", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop" },
            { title: "Cities: Skylines", sub: "(시티즈: 스카이라인)", genre: "도시 건설 시뮬레이션", comment: "나만의 메가폴리스 구상, 장시간 몰입을 도울 안정적인 사운드 밸런스.", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop" }
        ],
        "리듬 게임": [
            { title: "디제이맥스 리스펙트 V", sub: "(DJMAX)", genre: "전통 리듬게임", comment: "손끝으로 느끼는 전율, 음악 장르와 완벽히 동기화됩니다!", image: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600&auto=format&fit=crop" },
            { title: "얼얼스 (A Dance of Fire and Ice)", sub: "(ADOFAI)", genre: "원버튼 리듬게임", comment: "불과 얼음의 완벽한 박자 감각을 깨워줄 추천 조합!", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop" }
        ],
        "힐링 게임": [
            { title: "Stardew Valley", sub: "(스타듀 밸리)", genre: "농경 시뮬레이션", comment: "평화로운 귀농 생활, 흙냄새 가득한 편안한 감성의 배경음악.", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop" },
            { title: "PowerWash Simulator", sub: "(파워워시 시뮬레이션)", genre: "고압 세척 힐링", comment: "치이익- 묵은 때를 씻어내며 잡생각을 지워낼 ASMR형 사운드 매칭.", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop" },
            { title: "A Little to the Left", sub: "(어 리틀 투 더 레프트)", genre: "퍼즐 정리 힐링", comment: "정돈된 사물들이 주는 마음의 평온, 아기자기한 감성의 조합.", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop" },
            { title: "Euro Truck Simulator 2", sub: "(유로 트럭 시뮬레이션 2)", genre: "운전 시뮬레이션", comment: "유럽 대륙을 가로지르는 밤샘 야간 운전의 동반자 힐링 비트.", image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop" }
        ]
    },
    music: {
        "팝": [
            { title: "Sunflower", sub: "(Post Malone)", synthType: "sine", tempo: 90, notes: [293, 329, 392, 440, 392, 329, 293, 261] },
            { title: "nobody", sub: "(OneRepublic)", synthType: "sine", tempo: 112, notes: [349, 392, 440, 523, 440, 392, 349, 329] },
            { title: "Sunshine", sub: "(OneRepublic)", synthType: "sine", tempo: 120, notes: [392, 440, 494, 587, 494, 440, 392, 349] },
            { title: "Mystical Magical", sub: "(Benson Boone)", synthType: "sine", tempo: 105, notes: [261, 329, 392, 523, 494, 392, 329, 293] },
            { title: "Die For You", sub: "(The Weekend)", synthType: "sine", tempo: 67, notes: [220, 261, 329, 440, 392, 329, 261, 220] }
        ],
        "힙합": [
            { title: "Boom Bap Classics", sub: "(Underground HipHop)", synthType: "square", tempo: 90, notes: [98, 98, 130, 146, 110, 110, 146, 165] },
            { title: "Vampire", sub: "(Dominic Fike)", synthType: "square", tempo: 94, notes: [146, 165, 196, 220, 196, 165, 146, 110] },
            { title: "Timeless", sub: "(The Weekend)", synthType: "square", tempo: 85, notes: [110, 130, 146, 165, 146, 130, 110, 98] },
            { title: "Passionfruit", sub: "(Drake)", synthType: "square", tempo: 112, notes: [165, 196, 220, 261, 220, 196, 165, 146] },
            { title: "Tiramisu", sub: "(Don Toliver)", synthType: "square", tempo: 130, notes: [130, 146, 165, 196, 165, 146, 130, 110] },
            { title: "Body", sub: "(Don Toliver)", synthType: "square", tempo: 120, notes: [110, 146, 165, 220, 165, 146, 110, 98] }
        ],
        "EDM": [
            { title: "Neon Drive", sub: "(Cyberpunk Beats)", synthType: "sawtooth", tempo: 130, notes: [110, 130, 146, 165, 110, 146, 165, 196] },
            { title: "EDM MIX", sub: "(High Energy)", synthType: "sawtooth", tempo: 140, notes: [146, 146, 196, 196, 220, 220, 165, 165] },
            { title: "Summer Days", sub: "(Martin Garrix)", synthType: "sawtooth", tempo: 114, notes: [146, 196, 220, 293, 220, 196, 146, 110] },
            { title: "Closer", sub: "(The Chainsmokers)", synthType: "sawtooth", tempo: 95, notes: [261, 293, 329, 392, 349, 329, 293, 261] },
            { title: "Wake Me Up", sub: "(Avicii)", synthType: "sawtooth", tempo: 124, notes: [220, 293, 349, 440, 392, 349, 293, 220] },
            { title: "Waiting For Love", sub: "(Avicii)", synthType: "sawtooth", tempo: 128, notes: [293, 349, 440, 587, 523, 440, 349, 293] },
            { title: "Faded", sub: "(Alan Walker)", synthType: "sawtooth", tempo: 90, notes: [220, 261, 349, 392, 349, 261, 220, 196] }
        ],
        "Lo-fi": [
            { title: "Midnight Coffee", sub: "(Chill Study)", synthType: "triangle", tempo: 75, notes: [261, 329, 392, 523, 349, 440, 523, 659] },
            { title: "Rainy Window", sub: "(Lofi Beats)", synthType: "triangle", tempo: 80, notes: [293, 349, 440, 587, 329, 392, 493, 659] }
        ],
        "락": [
            { title: "Hard Rock Anthems", sub: "(Guitar Shred)", synthType: "sawtooth", tempo: 120, notes: [146, 146, 146, 174, 196, 196, 220, 146] }
        ],
        "재즈": [
            { title: "Luv (sic) pt2", sub: "(Nujabes)", synthType: "sine", tempo: 88, notes: [261, 311, 392, 466, 349, 440, 523, 587] },
            { title: "My Way", sub: "(Frank Sinatra)", synthType: "sine", tempo: 76, notes: [261, 293, 329, 349, 392, 440, 494, 523] },
            { title: "Fly Me To The Moon", sub: "(Frank Sinatra)", synthType: "sine", tempo: 120, notes: [440, 349, 293, 261, 349, 440, 523, 392] },
            { title: "Just the Two of Us", sub: "(Grover Washington, Jr.)", synthType: "sine", tempo: 96, notes: [311, 392, 466, 523, 466, 392, 311, 261] }
        ],
        "클래식": [
            { title: "Chopin Nocturnes", sub: "(Piano Solo)", synthType: "sine", tempo: 65, notes: [523, 659, 783, 1046, 880, 698, 587, 493] },
            { title: "Vivaldi Summer", sub: "(Orchestra Storm)", synthType: "sine", tempo: 150, notes: [440, 523, 659, 880, 783, 659, 523, 440] },
            { title: "Merry Christmas Mr. Lawrence", sub: "(Ryuichi Sakamoto)", synthType: "sine", tempo: 72, notes: [293, 329, 392, 440, 587, 659, 784, 880] },
            { title: "River Flows in You", sub: "(Yiruma)", synthType: "sine", tempo: 70, notes: [440, 494, 523, 587, 659, 587, 523, 494] },
            { title: "Claire de lune", sub: "(Debussy)", synthType: "sine", tempo: 60, notes: [311, 392, 466, 622, 466, 392, 311, 233] },
            { title: "Summer", sub: "(Hisaishi Joe)", synthType: "sine", tempo: 126, notes: [392, 440, 523, 587, 698, 587, 523, 440] },
            { title: "Moonlight Sonata 3rd", sub: "(Beethoven)", synthType: "sine", tempo: 155, notes: [220, 261, 329, 440, 523, 659, 880, 1046] }
        ],
        "제이팝": [
            { title: "Kick Back", sub: "(Yonezu Kenshi)", synthType: "sawtooth", tempo: 122, notes: [146, 174, 220, 293, 220, 174, 146, 110] },
            { title: "SPECIALZ", sub: "(King Gnu)", synthType: "sawtooth", tempo: 118, notes: [110, 130, 165, 220, 165, 130, 110, 82] },
            { title: "Pretender", sub: "(OfficialHigeDandism)", synthType: "sine", tempo: 92, notes: [277, 311, 370, 415, 554, 415, 370, 311] },
            { title: "Odoriko", sub: "(Vaundy)", synthType: "triangle", tempo: 115, notes: [261, 329, 392, 440, 392, 329, 261, 196] },
            { title: "Avid", sub: "(SawanoHiroyuki)", synthType: "sawtooth", tempo: 78, notes: [220, 261, 293, 329, 440, 329, 293, 261] }
        ]
    }
};

function enrichRecommendData() {
    Object.keys(RECOMMEND_DATA.games).forEach(genreKey => {
        const defaults = GENRE_DEFAULT_KEYWORDS[genreKey] || ["감동, 몰입"];
        RECOMMEND_DATA.games[genreKey].forEach(game => {
            if (!game.keywords) game.keywords = [...defaults];
        });
    });
    Object.keys(RECOMMEND_DATA.music).forEach(genreKey => {
        const defaults = MUSIC_GENRE_KEYWORDS[genreKey] || ["박자감"];
        RECOMMEND_DATA.music[genreKey].forEach(track => {
            if (!track.keywords) track.keywords = [...defaults];
            if (!track.image) track.image = MUSIC_DEFAULT_IMAGE;
            if (track.spotifyId === undefined) track.spotifyId = null;
            if (track.youtubeId === undefined) track.youtubeId = null;
        });
    });
}
enrichRecommendData();

function getActiveKeywords(moodLabel, rouletteKeyword) {
    const moodKeys = MOOD_KEYWORD_MAP[moodLabel] || [];
    const all = [...moodKeys];
    if (rouletteKeyword) all.push(rouletteKeyword);
    return [...new Set(all)];
}

function scoreItem(item, activeKeywords) {
    let score = 0;
    const keywords = item.keywords || [];
    const textBlob = `${item.title || ""} ${item.sub || ""} ${item.genre || ""} ${item.comment || ""}`.toLowerCase();
    activeKeywords.forEach(kw => {
        if (keywords.includes(kw)) score += 3;
        else if (keywords.some(k => k.includes(kw) || kw.includes(k))) score += 2;
        else if (textBlob.includes(kw.toLowerCase())) score += 1;
    });
    return score;
}

function pickBestFromPool(pool, activeKeywords) {
    if (!pool || pool.length === 0) return null;
    const scored = pool.map(item => ({ item, score: scoreItem(item, activeKeywords) }));
    const maxScore = Math.max(...scored.map(s => s.score));
    const top = scored.filter(s => s.score === maxScore && maxScore > 0).map(s => s.item);
    const candidates = top.length > 0 ? top : pool;
    return candidates[Math.floor(Math.random() * candidates.length)];
}

function matchRecommend(gameGenre, musicGenre, moodLabel, rouletteKeyword) {
    let normalizedGameGenre = gameGenre;
    if (!RECOMMEND_DATA.games[normalizedGameGenre] && RECOMMEND_DATA.games[normalizedGameGenre + " 게임"]) {
        normalizedGameGenre = normalizedGameGenre + " 게임";
    } else if (!RECOMMEND_DATA.games[normalizedGameGenre] && RECOMMEND_DATA.games[normalizedGameGenre.replace(" 게임", "")]) {
        normalizedGameGenre = normalizedGameGenre.replace(" 게임", "");
    }
    const gamePool = RECOMMEND_DATA.games[normalizedGameGenre] || RECOMMEND_DATA.games["FPS 게임"];
    const musicPool = RECOMMEND_DATA.music[musicGenre] || RECOMMEND_DATA.music["EDM"];
    const activeKeywords = getActiveKeywords(moodLabel, rouletteKeyword);
    const game = pickBestFromPool(gamePool, activeKeywords);
    const music = pickBestFromPool(musicPool, activeKeywords);
    return { game, music, gameGenre: normalizedGameGenre, activeKeywords };
}

function playlistStorageKey(userId) {
    return `gamebeat_playlist_${userId}`;
}

function loadPlaylistForUser(userId) {
    if (!userId) { myPlaylist = []; return; }
    try {
        myPlaylist = JSON.parse(localStorage.getItem(playlistStorageKey(userId))) || [];
    } catch {
        myPlaylist = [];
    }
}

function savePlaylistForUser(userId) {
    if (!userId) return;
    localStorage.setItem(playlistStorageKey(userId), JSON.stringify(myPlaylist));
}

function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem("currentUser")); } catch { return null; }
}

function initRankings() {
    if (localStorage.getItem(STORAGE_KEYS.rankings)) return;
    const map = {};
    MASTER_RANKING_SEED.forEach(({ game, music, count }) => {
        const key = `${game}|${music}`;
        map[key] = { game, music, count };
    });
    localStorage.setItem(STORAGE_KEYS.rankings, JSON.stringify(map));
}

function getRankingsMap() {
    initRankings();
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.rankings)) || {}; } catch { return {}; }
}

function recordRankingPick(game, music) {
    const map = getRankingsMap();
    const key = `${game.title}|${music.title}`;
    if (!map[key]) map[key] = { game: game.title, music: music.title, count: 0 };
    map[key].count += 1;
    localStorage.setItem(STORAGE_KEYS.rankings, JSON.stringify(map));
}

function renderRankings() {
    const rankList = document.getElementById("rank-list");
    if (!rankList) return;
    const map = getRankingsMap();
    const sorted = Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
    rankList.innerHTML = sorted.map((item, i) =>
        `<div><span>${i + 1}</span> ${item.game} X ${item.music} <em class="rank-count">(${item.count.toLocaleString()}회)</em></div>`
    ).join("") || `<div><span>-</span> 아직 추천 기록이 없습니다</div>`;
}

function tickRankingsLive() {
    const map = getRankingsMap();
    let changed = false;
    Object.keys(map).forEach(key => {
        if (Math.random() < 0.35) {
            map[key].count += Math.floor(Math.random() * 3) + 1;
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem(STORAGE_KEYS.rankings, JSON.stringify(map));
        renderRankings();
    }
}

function buildShareUrl(game, music, keyword) {
    const params = new URLSearchParams({
        g: game?.title || "",
        m: music?.title || "",
        k: keyword || ""
    });
    const base = window.location.href.split("?")[0];
    return `${base}?${params.toString()}`;
}

function parseShareUrlAndApply(switchViewFn, renderResultFn) {
    const params = new URLSearchParams(location.search);
    const g = params.get("g");
    const m = params.get("m");
    const k = params.get("k");
    if (!g || !m) return;
    let foundGame = null;
    let foundMusic = null;
    let foundGameGenre = "FPS 게임";
    Object.keys(RECOMMEND_DATA.games).forEach(genre => {
        RECOMMEND_DATA.games[genre].forEach(game => {
            if (game.title === g) { foundGame = game; foundGameGenre = genre; }
        });
    });
    Object.keys(RECOMMEND_DATA.music).forEach(genre => {
        RECOMMEND_DATA.music[genre].forEach(track => {
            if (track.title === m) foundMusic = track;
        });
    });
    if (foundGame && foundMusic) {
        if (k) chosenRouletteKeyword = k;
        currentPick = { game: foundGame, music: foundMusic, keyword: k || "" };
        switchViewFn("view-result");
        renderResultFn(foundGame, foundMusic, foundGameGenre);
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    if (theme === "light") {
        btn.innerHTML = `<i class="fas fa-sun"></i> <span>라이트</span>`;
    } else {
        btn.innerHTML = `<i class="fas fa-moon"></i> <span>나이트</span>`;
    }
}

function getAvatarInitials(name) {
    if (!name) return "?";
    const trimmed = name.trim();
    if (trimmed.length <= 2) return trimmed.toUpperCase();
    return trimmed.slice(0, 2).toUpperCase();
}

function itemMatchesQuery(item, query) {
    const q = query.toLowerCase();
    const keywords = item.keywords || [];
    const blob = `${item.title || ""} ${item.sub || ""} ${item.genre || ""} ${item.comment || ""} ${keywords.join(" ")}`.toLowerCase();
    if (blob.includes(q)) return true;
    return keywords.some(kw => kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase()));
}

function searchAllByKeyword(query) {
    const q = query.trim();
    if (!q) return { games: [], music: [] };
    const games = [];
    const music = [];
    Object.keys(RECOMMEND_DATA.games).forEach(genreKey => {
        RECOMMEND_DATA.games[genreKey].forEach(game => {
            if (itemMatchesQuery(game, q)) {
                games.push({ ...game, genreKey });
            }
        });
    });
    Object.keys(RECOMMEND_DATA.music).forEach(genreKey => {
        RECOMMEND_DATA.music[genreKey].forEach(track => {
            if (itemMatchesQuery(track, q)) {
                music.push({ ...track, genreKey });
            }
        });
    });
    return { games, music };
}

function renderSearchResults(query) {
    const panel = document.getElementById("search-results-panel");
    const gamesList = document.getElementById("search-games-results");
    const musicList = document.getElementById("search-music-results");
    if (!panel || !gamesList || !musicList) return;

    const { games, music } = searchAllByKeyword(query);
    if (!query.trim()) {
        panel.classList.add("hidden");
        return;
    }
    panel.classList.remove("hidden");

    gamesList.innerHTML = games.length
        ? games.map(g => `<li><strong>${g.title}</strong><div class="item-sub">${g.genreKey} · ${g.sub || ""}</div></li>`).join("")
        : `<li class="search-empty">일치하는 게임이 없습니다</li>`;

    musicList.innerHTML = music.length
        ? music.map(m => `<li><strong>${m.title}</strong><div class="item-sub">${m.genreKey} · ${m.sub || ""}</div></li>`).join("")
        : `<li class="search-empty">일치하는 음악이 없습니다</li>`;
}

function updateProfileUI(user) {
    const name = user?.name || "게스트";
    const id = user?.id || "guest";
    const initials = getAvatarInitials(name);

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setText("profile-display-name", name);
    setText("profile-display-id", `@${id}`);
    setText("top-profile-name", name);

    ["profile-avatar", "top-avatar"].forEach(aid => {
        const av = document.getElementById(aid);
        if (av) av.textContent = initials;
    });

    const greetingName = document.getElementById("greeting-name");
    if (greetingName) greetingName.textContent = name;
}

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

    const navItems = document.querySelectorAll('.top-nav-menu .nav-item');
    const contentViews = document.querySelectorAll('.content-view');
    const brandLogoBtn = document.getElementById('brand-logo-btn');
    const topProfileChip = document.getElementById('top-profile-chip');
    const mainSearchInput = document.getElementById('main-search-input');
    const searchSubmitBtn = document.getElementById('search-submit-btn');

    const cardDeck = document.getElementById('card-deck');
    const carouselZone = document.getElementById('carousel-zone');
    const carouselDots = document.getElementById('carousel-dots');
    const cards = cardDeck ? cardDeck.querySelectorAll('.game-main-card') : [];
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
    const shareLinkInline = document.getElementById('share-link-inline');
    const copyLinkInlineBtn = document.getElementById('copy-link-inline-btn');
    const shareLinkBar = document.getElementById('share-link-bar');

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
            applyLogin(user.name, user.id);
        } else {
            alert('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    });

    btnLogout?.addEventListener('click', () => {
        if(confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('currentUser');
            myPlaylist = [];
            location.reload();
        }
    });

    function applyLogin(name, userId) {
        if(authModalOverlay) authModalOverlay.classList.add('hidden');
        const user = getCurrentUser();
        if(userId) loadPlaylistForUser(userId);
        updateProfileUI(user || { name, id: userId });
        updatePlaylistDOM();
        syncHeartButtonsState();
    }

    function switchView(id) {
        contentViews.forEach(v => v.id === id ? v.classList.remove('hidden') : v.classList.add('hidden'));
        navItems.forEach(n => {
            const viewId = n.id.replace('menu-', 'view-');
            viewId === id ? n.classList.add('active') : n.classList.remove('active');
        });
        if (topProfileChip) {
            topProfileChip.classList.toggle('active', id === 'view-profile');
        }
        if (id !== 'view-result') {
            stopSystemSynth();
        }
    }

    navItems.forEach(n => n.addEventListener('click', () => switchView(n.id.replace('menu-', 'view-'))));
    brandLogoBtn?.addEventListener('click', () => switchView('view-main'));
    topProfileChip?.addEventListener('click', () => switchView('view-profile'));

    function runKeywordSearch() {
        const query = mainSearchInput?.value.trim() || chosenRouletteKeyword || "";
        if (mainSearchInput && query) mainSearchInput.value = query;
        renderSearchResults(query);
        if (query) switchView('view-main');
    }

    searchSubmitBtn?.addEventListener('click', runKeywordSearch);
    mainSearchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') runKeywordSearch();
    });

    function initializeMainCards() {
        const genreImageMap = {
            "FPS": "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
            "RPG": "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
            "공포": "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop",
            "리듬": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
            "힐링": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
            "생존": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
            "오픈월드": "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop",
            "스토리": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
            "소울라이크": "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
            "로그라이크": "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600&auto=format&fit=crop",
            "시뮬레이션": "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop"
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
        card.addEventListener('click', (e) => {
            if (card.classList.contains('next')) {
                e.stopPropagation();
                goNextCard();
                return;
            }
            if (card.classList.contains('prev')) {
                e.stopPropagation();
                goPrevCard();
                return;
            }
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
            } else if (i === (cardIndex - 2 + cards.length) % cards.length) {
                c.classList.add('prev-secondary');
            }
        });
        if (carouselDots) {
            carouselDots.innerHTML = '';
            cards.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'carousel-dot' + (i === cardIndex ? ' active' : '');
                dot.setAttribute('aria-label', `카드 ${i + 1}`);
                dot.addEventListener('click', () => {
                    cardIndex = i;
                    updateCards();
                });
                carouselDots.appendChild(dot);
            });
        }
    }

    function goNextCard() {
        if (!cards.length) return;
        cardIndex = (cardIndex + 1) % cards.length;
        updateCards();
    }

    function goPrevCard() {
        if (!cards.length) return;
        cardIndex = (cardIndex - 1 + cards.length) % cards.length;
        updateCards();
    }

    nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); goNextCard(); });
    prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); goPrevCard(); });

    let touchStartX = 0;
    let touchStartY = 0;
    carouselZone?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    carouselZone?.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        const dy = e.changedTouches[0].screenY - touchStartY;
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) goNextCard();
        else goPrevCard();
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
        const mainVisible = !document.getElementById('view-main')?.classList.contains('hidden');
        if (!mainVisible) return;
        if (e.key === 'ArrowRight') goNextCard();
        if (e.key === 'ArrowLeft') goPrevCard();
    });

    genreItems.forEach(item => {
        item.addEventListener('click', () => {
            const parentGrid = item.parentElement;
            parentGrid.querySelectorAll('.select-item').forEach(btn => btn.classList.remove('active'));
            item.classList.add('active');
        });
    });

    const rouletteSpinBtn = document.getElementById('roulette-spin-btn');
    const rouletteResultEl = document.getElementById('roulette-result');

    rouletteSpinBtn?.addEventListener('click', () => {
        rouletteSpinBtn.disabled = true;
        let counter = 0;
        const spinInterval = setInterval(() => {
            const tempKey = ROULETTE_KEYWORD_POOL[Math.floor(Math.random() * ROULETTE_KEYWORD_POOL.length)];
            if (rouletteResultEl) rouletteResultEl.textContent = `🎯 [추첨중] ${tempKey}`;
            counter++;
            if (counter > 10) {
                clearInterval(spinInterval);
                chosenRouletteKeyword = ROULETTE_KEYWORD_POOL[Math.floor(Math.random() * ROULETTE_KEYWORD_POOL.length)];
                if (rouletteResultEl) rouletteResultEl.textContent = `🎉 [당첨] ${chosenRouletteKeyword}`;
                if (mainSearchInput) mainSearchInput.value = chosenRouletteKeyword;
                rouletteSpinBtn.disabled = false;
            }
        }, 80);
    });

    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
    applyTheme(savedTheme);
    themeToggle?.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next);
    });

    function runRecommend() {
        const groups = document.querySelectorAll('.selection-group');
        const selectedGameZone = groups[0]?.querySelector('.select-item.active');
        const selectedMusicZone = groups[1]?.querySelector('.select-item.active');
        const selectedMoodZone = groups[2]?.querySelector('.select-item.active');

        let gameGenre = selectedGameZone ? selectedGameZone.innerText.trim() : "FPS";
        let musicGenre = selectedMusicZone ? selectedMusicZone.innerText.trim() : "EDM";
        const moodLabel = selectedMoodZone ? selectedMoodZone.innerText.trim() : "집중";

        if (gameGenre === "리듬게임") gameGenre = "리듬 게임";

        const { game, music, gameGenre: normalizedGenre } = matchRecommend(
            gameGenre, musicGenre, moodLabel, chosenRouletteKeyword
        );
        const keyword = chosenRouletteKeyword || (MOOD_KEYWORD_MAP[moodLabel] || [])[0] || "";
        currentPick = { game, music, keyword };
        recordRankingPick(game, music);
        renderRankings();
        switchView('view-result');
        renderResultView(game, music, normalizedGenre);
    }

    genreNextBtn?.addEventListener('click', runRecommend);
    document.getElementById('btn-re-recommend')?.addEventListener('click', () => {
        switchView('view-genre');
    });

    function updateShareLink() {
        if (!currentPick.game || !currentPick.music) return "";
        return buildShareUrl(currentPick.game, currentPick.music, currentPick.keyword);
    }

    function showShareLinks() {
        const url = updateShareLink();
        if (!url) return;
        if (shareLinkInput) shareLinkInput.value = url;
        if (shareLinkInline) shareLinkInline.value = url;
        if (shareLinkBar) shareLinkBar.classList.remove('hidden');
    }

    function copyShareLink(text) {
        if (!text) return;
        const done = () => alert('공유 링크가 복사되었습니다!');
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(done).catch(() => alert('링크 복사에 실패했습니다.'));
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            done();
        }
    }

    function openShareModal() {
        const url = updateShareLink();
        if (!url) {
            alert('먼저 추천을 받아주세요.');
            return;
        }
        if (shareLinkInput) shareLinkInput.value = url;
        if (shareLinkInline) shareLinkInline.value = url;
        if (shareModalOverlay) shareModalOverlay.classList.remove('hidden');
    }

    openShareBtn?.addEventListener('click', openShareModal);
    closeShareBtn?.addEventListener('click', () => { if(shareModalOverlay) shareModalOverlay.classList.add('hidden'); });
    shareModalOverlay?.addEventListener('click', (e) => { if(e.target === shareModalOverlay) shareModalOverlay.classList.add('hidden'); });

    copyLinkBtn?.addEventListener('click', () => copyShareLink(shareLinkInput?.value));
    copyLinkInlineBtn?.addEventListener('click', () => copyShareLink(shareLinkInline?.value || shareLinkInput?.value));

    document.getElementById('share-kakao')?.addEventListener('click', () => {
        showShareLinks();
        const url = encodeURIComponent(shareLinkInput?.value || shareLinkInline?.value || location.href);
        window.open(`https://sharer.kakao.com/talk/friends/picker/slide?url=${url}`, '_blank', 'width=600,height=600');
    });
    document.getElementById('share-facebook')?.addEventListener('click', () => {
        showShareLinks();
        const url = encodeURIComponent(shareLinkInput?.value || shareLinkInline?.value || location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    });
    document.getElementById('share-instagram')?.addEventListener('click', () => {
        showShareLinks();
        const link = shareLinkInput?.value || shareLinkInline?.value;
        if (link) navigator.clipboard?.writeText(link);
        alert('인스타그램은 링크 복사 후 스토리/DM에 붙여넣어 주세요.');
    });

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
            musicCard.className = "pick-card pick-card-img-bg";
            musicCard.style.backgroundImage = `url('${musicData.image || MUSIC_DEFAULT_IMAGE}')`;
            const musicTitleEl = document.getElementById('res-music-title');
            const musicSubEl = document.getElementById('res-music-sub');
            if (musicTitleEl) musicTitleEl.innerText = musicData.title;
            if (musicSubEl) musicSubEl.innerText = musicData.sub;
        }

        const gameCommentBox = document.getElementById('game-comment-box');
        let commentText = gameData.comment || '음악과 함께 몰입도를 극대화해보세요!';
        if (currentPick.keyword) {
            commentText += ` 핵심 키워드 [${currentPick.keyword}] 조건이 매칭되었습니다.`;
        }
        if (gameCommentBox) gameCommentBox.innerHTML = `"${commentText}"`;
        showShareLinks();

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const targetNameEl = document.getElementById('result-user-name');
        if (targetNameEl) {
            const displayValue = currentUser ? currentUser.name : "사용자";
            targetNameEl.innerHTML = `<span style="color: var(--brand-accent); font-weight: bold;">${displayValue}</span>`;
        }

        const videoStatusBox = document.getElementById('game-video-status-box');
        if (videoStatusBox) {
            videoStatusBox.style.display = "block";
            videoStatusBox.style.padding = "0";
            videoStatusBox.style.overflow = "hidden";
            videoStatusBox.style.position = "relative";
            videoStatusBox.style.borderRadius = "12px";
            
            videoStatusBox.innerHTML = `
                <div class="audio-player-wrapper" style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px;">
                    <div style="font-size:12px; color:var(--text-sub); margin-bottom:4px;">🎮 시스템 동시 플레이</div>
                    <button style="background: var(--bg-inner); border: 2px solid var(--brand-accent); width: 50px; height: 50px; border-radius: 50%; cursor: default; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 12px var(--accent-glow);">
                        <i class="fas fa-gamepad" style="font-size:20px; color:var(--brand-accent);"></i>
                    </button>
                    <div style="font-size:11px; color:var(--brand-accent); margin-top:4px; letter-spacing:1px; text-transform: uppercase;">
                        ${gameData.title} PLAYING
                    </div>
                </div>
            `;
        }

        const audioZone = document.getElementById('music-audio-player-zone');

        if (audioZone) {
            audioZone.innerHTML = `
                <div class="audio-player-wrapper" style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px;">
                    <div style="font-size:12px; color:var(--text-sub); margin-bottom:4px;">🎧 무차단 시스템 신디사이저 플레이어</div>
                    <button id="synth-play-pause-btn" style="background: var(--bg-inner); border: 2px solid var(--brand-accent); width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 12px var(--accent-glow); transition: transform 0.1s;">
                        <i class="fas fa-pause" style="font-size:20px; color:var(--brand-accent);"></i>
                    </button>
                    <div style="font-size:11px; color:var(--brand-accent); margin-top:4px; letter-spacing:1px;" id="synth-status-text">LIVE SYNTH PLAYING</div>
                </div>
            `;

            if (window.AudioAdapter) {
                AudioAdapter.play(musicData, playSystemSynth);
            } else {
                playSystemSynth(musicData);
            }
            const playPauseBtn = document.getElementById('synth-play-pause-btn');
            const statusText = document.getElementById('synth-status-text');

            playPauseBtn?.addEventListener('click', () => {
                if (isPlayingSynth) {
                    stopSystemSynth();
                    playPauseBtn.innerHTML = '<i class="fas fa-play" style="font-size:20px; color:var(--brand-accent); margin-left:3px;"></i>';
                    if (statusText) statusText.innerText = "PLAYER PAUSED";
                } else {
                    if (window.AudioAdapter) AudioAdapter.play(musicData, playSystemSynth);
                    else playSystemSynth(musicData);
                    playPauseBtn.innerHTML = '<i class="fas fa-pause" style="font-size:20px; color:var(--brand-accent);"></i>';
                    if (statusText) statusText.innerText = "LIVE SYNTH PLAYING";
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
        if (!cardHeartBtn) return;
        if (isAlreadyAdded) {
            cardHeartBtn.classList.add('active');
            cardHeartBtn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            cardHeartBtn.classList.remove('active');
            cardHeartBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
    }

    function handleTogglePlaylist(e) {
        e.stopPropagation();
        const user = getCurrentUser();
        const existingIndex = myPlaylist.findIndex(item => item.title === currentRecommendedMusic.title);
        if (existingIndex > -1) {
            myPlaylist.splice(existingIndex, 1);
            alert(`"${currentRecommendedMusic.title}" 곡이 내 플레이리스트에서 삭제되었습니다.`);
        } else {
            myPlaylist.push({
                id: Date.now(),
                title: currentRecommendedMusic.title,
                sub: currentRecommendedMusic.sub,
                gameTitle: currentPick.game?.title || "",
                musicTitle: currentRecommendedMusic.title,
                genre: currentPick.game?.genre || "",
                addedAt: new Date().toLocaleDateString()
            });
            alert(`"${currentRecommendedMusic.title}" 곡이 내 플레이리스트에 추가되었습니다!`);
        }
        if (user) savePlaylistForUser(user.id);
        syncHeartButtonsState();
        updatePlaylistDOM();
    }

    window.deletePlaylistItem = function(id) {
        const index = myPlaylist.findIndex(item => item.id === id);
        if (index > -1) {
            const deletedTitle = myPlaylist[index].title;
            myPlaylist.splice(index, 1);
            const user = getCurrentUser();
            if (user) savePlaylistForUser(user.id);
            alert(`"${deletedTitle}" 곡이 삭제되었습니다.`);
            updatePlaylistDOM();
            syncHeartButtonsState();
        }
    };

    function updatePlaylistDOM() {
        const playlistCountEl = document.getElementById('playlist-count');
        if (playlistCountEl) playlistCountEl.innerText = `저장된 곡: ${myPlaylist.length}곡`;

        const playlistTableBody = document.getElementById('playlist-items');
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
                        <div style="font-weight: bold; color: var(--text-main);">${track.title}</div>
                        <div style="font-size: 12px; color: var(--text-sub);">${track.sub}</div>
                    </td>
                    <td style="color: var(--text-sub); font-size: 13px; vertical-align: middle;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <span>${track.addedAt}</span>
                            <i class="fas fa-trash-alt" 
                               style="cursor: pointer; color: #555; transition: color 0.2s;" 
                               onmouseover=\"this.style.color='#ff5b5b'\" 
                               onmouseout=\"this.style.color='#555'\" 
                               onclick="deletePlaylistItem(${track.id})">
                            </i>
                        </div>
                    </td>
                `;
                playlistTableBody.appendChild(tr);
            });
        }
    }

    initRankings();
    renderRankings();
    setInterval(tickRankingsLive, 30000);

    const cur = getCurrentUser();
    if(cur) {
        applyLogin(cur.name, cur.id);
    } else {
        updateProfileUI(null);
        if(authModalOverlay) authModalOverlay.classList.remove('hidden');
    }

    switchView('view-main');
    initializeMainCards();
    updateCards();
    updatePlaylistDOM();
    syncHeartButtonsState();

    parseShareUrlAndApply(switchView, renderResultView);
});