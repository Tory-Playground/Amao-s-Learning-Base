/* ============================================================================
 * 🔒 [冷凍區] 系統核心：雙人 localStorage 存檔、引繼碼、簽到、抽卡與副本引擎
 * ============================================================================ */

const STORAGE_KEY = "AMAO_SECRET_BASE_SAVE_V1";

function createDefaultProfile(pid, name, grade, icon, bday) {
    return {
        pid, name, grade, icon, bday,
        coins: 650,
        puddings: 5,
        equippedId: "amao_base",
        lv: 3,
        affection: 3,
        // 🔒 正式上線版：預設僅解鎖 No.001 原始阿毛，其餘皆由孩子自己抽卡收集！
        unlockedIds: ["amao_base"],
        answeredChatIds: [],
        dailyChatCount: 0,
        lastResetDate: "",
        lastCheckInDate: "",
        streakDays: 1,
        bdayClaimedYear: 0,
        stats: { angles: 0, alchemy: 0, english: 0 },
        quests: [
            { id: 'q1', title: `⚡ 完成【阿毛的雷射除草機 (${grade}年級)】1 次`, rewardCoins: 200, done: false, claimed: false },
            { id: 'q2', title: `🍲 幫阿毛煮出完美克數拉麵 (${grade}年級) 1 次`, rewardCoins: 250, done: false, claimed: false },
            { id: 'q3', title: `💬 在房間回答阿毛的${grade}年級英文問題 1 次`, rewardCoins: 150, done: false, claimed: false }
        ]
    };
}

let appData = {
    activePid: "p2",
    profiles: {
        p1: createDefaultProfile("p1", "小六探險家", 6, "👦", "05-20"),
        p2: createDefaultProfile("p2", "小四探險家", 4, "👧", "10-25")
    },
    lastPulledId: "amao_base",
    dexFilter: "ALL",
    showAll67Slots: false,
    dialogueIdx: 0
};

function loadAppData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.profiles && parsed.profiles.p1 && parsed.profiles.p2) {
                appData.profiles = parsed.profiles;
                appData.activePid = parsed.activePid || "p2";
            }
        }
    } catch (e) {
        console.warn("讀取存檔失敗，使用預設存檔", e);
    }
}

function saveAppData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            activePid: appData.activePid,
            profiles: appData.profiles
        }));
    } catch (e) {}
}

function getState() {
    return appData.profiles[appData.activePid];
}

function isCardUnlocked(itemId) {
    return getState().unlockedIds.includes(itemId);
}

function getTodayObj() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return {
        full: `${yyyy}-${mm}-${dd}`,
        mmdd: `${mm}-${dd}`,
        year: yyyy,
        month: now.getMonth() + 1,
        display: `${yyyy}/${mm}/${dd}`
    };
}

function checkDateAndEvents() {
    const today = getTodayObj();
    const s = getState();

    document.getElementById('ui-today-date').innerText = `📅 ${today.display}`;
    document.getElementById('checkin-today-str').innerText = `今天日期：${today.display}`;

    const seasonEl = document.getElementById('ui-season-tag');
    if (today.month === 10) seasonEl.innerText = "🎃 萬聖節搞怪季";
    else if (today.month === 12) seasonEl.innerText = "🎄 聖誕禮物季";
    else if (today.month === 1 || today.month === 2) seasonEl.innerText = "🧧 新春紅包季";
    else seasonEl.innerText = "🍀 皮克敏森林探險季";

    if (s.lastResetDate !== today.full) {
        s.dailyChatCount = 0;
        s.lastResetDate = today.full;
        saveAppData();
    }

    const checkedIn = (s.lastCheckInDate === today.full);
    document.getElementById('checkin-dot').style.display = checkedIn ? 'none' : 'block';

    const bdayBanner = document.getElementById('birthday-banner');
    if (today.mmdd === s.bday && s.bdayClaimedYear !== today.year) {
        bdayBanner.classList.remove('hidden');
        document.getElementById('bday-banner-title').innerText = `🎂 祝 ${s.name} 生日快樂！Yaha!! 🎉`;
    } else {
        bdayBanner.classList.add('hidden');
    }
}

function claimBirthdayGift() {
    const s = getState();
    const today = getTodayObj();
    s.coins += 500;
    s.puddings += 3;
    s.bdayClaimedYear = today.year;
    saveAppData();
    document.getElementById('birthday-banner').classList.add('hidden');
    document.getElementById('amao-sound-tag').innerText = `🎂「Yaha！！祝 ${s.name} 生日快樂！已送上 +500🌰 與 +3🍮！」`;
    renderHub();
}

function triggerBirthdayTest() {
    closeModal('parent-modal');
    const s = getState();
    const bdayBanner = document.getElementById('birthday-banner');
    bdayBanner.classList.remove('hidden');
    document.getElementById('bday-banner-title').innerText = `🎂 祝 ${s.name} 生日快樂！Yaha!! 🎉`;
}

function selectProfile(pid) {
    appData.activePid = pid;
    appData.dialogueIdx = 0;
    saveAppData();
    checkDateAndEvents();
    renderHub();
    closeModal('profile-modal');
}

function openCheckInModal() {
    const s = getState();
    const today = getTodayObj();
    const checked = (s.lastCheckInDate === today.full);
    document.getElementById('checkin-streak-num').innerText = s.streakDays;

    let stampsHtml = '';
    for (let i = 1; i <= 7; i++) {
        const activeStamp = i <= (s.streakDays % 7 || 7);
        stampsHtml += `
            <div class="p-2 rounded-xl border-2 border-[#3e2723] ${activeStamp ? 'bg-[#fff3b0]' : 'bg-gray-100 opacity-60'} text-xs font-black">
                <div>D${i}</div>
                <div class="text-base mt-0.5">${activeStamp ? '💮' : '⚪'}</div>
            </div>
        `;
    }
    document.getElementById('checkin-stamps-grid').innerHTML = stampsHtml;

    const btn = document.getElementById('btn-claim-checkin');
    if (checked) {
        btn.disabled = true;
        btn.innerText = "✓ 今天已經蓋過印章囉！明天再來！";
    } else {
        btn.disabled = false;
        btn.innerText = "💮 蓋下今日阿毛印章 (+100🌰 +1🍮)";
    }
    openModal('checkin-modal');
}

function claimDailyCheckIn() {
    const s = getState();
    const today = getTodayObj();
    if (s.lastCheckInDate === today.full) return;
    s.lastCheckInDate = today.full;
    s.streakDays++;
    s.coins += 100;
    s.puddings += 1;
    saveAppData();
    checkDateAndEvents();
    updateTopBar();
    openCheckInModal();
}

function openTransferModal() {
    const s = getState();
    const unlockedIndexes = DECOR_DEX.filter(d => s.unlockedIds.includes(d.id)).map(d => d.idx).join(',');
    const code = `AMAO-${s.pid.toUpperCase()}-${s.coins}-${s.puddings}-${s.lv}-${s.streakDays}-${unlockedIndexes}`;
    document.getElementById('transfer-player-tag').innerText = `${s.icon} ${s.name} (${s.grade}年級)`;
    document.getElementById('transfer-code-out').value = code;
    document.getElementById('transfer-copy-msg').classList.add('hidden');
    document.getElementById('transfer-status-msg').innerText = "";
    openModal('transfer-modal');
}

function copyTransferCode() {
    const input = document.getElementById('transfer-code-out');
    input.select();
    document.execCommand('copy');
    document.getElementById('transfer-copy-msg').classList.remove('hidden');
}

function applyTransferCode() {
    const raw = document.getElementById('transfer-code-in').value.trim().toUpperCase();
    const parts = raw.split('-');
    const msgEl = document.getElementById('transfer-status-msg');

    if (parts.length < 7 || parts[0] !== 'AMAO') {
        msgEl.innerText = "❗ 引繼碼格式不正確喔！請確認是 AMAO- 開頭的代碼。";
        return;
    }
    const targetPid = parts[1].toLowerCase();
    if (!appData.profiles[targetPid]) {
        msgEl.innerText = "❗ 找不到對應的小主人代號 (P1/P2)！";
        return;
    }

    const prof = appData.profiles[targetPid];
    prof.coins = parseInt(parts[2], 10) || 0;
    prof.puddings = parseInt(parts[3], 10) || 0;
    prof.lv = parseInt(parts[4], 10) || 1;
    prof.streakDays = parseInt(parts[5], 10) || 1;

    const idxList = parts[6].split(',').map(n => parseInt(n, 10)).filter(n => !isNaN(n));
    const newUnlocked = DECOR_DEX.filter(d => idxList.includes(d.idx)).map(d => d.id);
    prof.unlockedIds = newUnlocked.length > 0 ? Array.from(new Set(["amao_base", ...newUnlocked])) : ["amao_base"];

    appData.activePid = targetPid;
    saveAppData();
    renderHub();
    closeModal('transfer-modal');
    document.getElementById('amao-sound-tag').innerText = `🎉「Yaha！！已成功還原 ${prof.name} 的跨裝置進度！」`;
}

function updateTopBar() {
    const s = getState();
    document.getElementById('ui-coins').innerText = s.coins;
    document.getElementById('ui-puddings').innerText = s.puddings;
    document.getElementById('active-player-pill').innerHTML = `
        <span>${s.icon} ${s.name} (${s.grade}年級)</span>
        <i class="fa-solid fa-caret-down"></i>
    `;

    document.querySelectorAll('.grade-badge-inline').forEach(el => {
        el.innerText = `小${s.grade === 6 ? '六' : '四'}題庫`;
    });

    const unlockedCount = s.unlockedIds.length;
    const activeTotal = DECOR_DEX.length;
    document.getElementById('dex-count-badge').innerText = `${unlockedCount}/67`;
    document.getElementById('dex-progress-text').innerText = `已登場 ${unlockedCount}/${activeTotal} 張 (卡包總規模 67 張)`;
}

function switchTab(tabName) {
    const views = ['center', 'dungeons', 'packs', 'decordex', 'dungeon-angles', 'dungeon-alchemy', 'dungeon-english'];
    views.forEach(v => document.getElementById(`view-${v}`).classList.add('hidden'));
    document.getElementById(`view-${tabName}`).classList.remove('hidden');

    ['center', 'dungeons', 'packs', 'decordex'].forEach(t => {
        const deskBtn = document.getElementById(`tab-${t}`);
        if (deskBtn) {
            deskBtn.className = (t === tabName)
                ? "fluffy-btn bg-[#f6bd60] text-[#3e2723] font-bold px-4 py-1.5 text-sm flex items-center gap-2"
                : "fluffy-btn bg-[#fffdf5] text-[#3e2723] font-bold px-4 py-1.5 text-sm flex items-center gap-2";
        }
        const mobBtn = document.getElementById(`mob-tab-${t}`);
        if (mobBtn) {
            mobBtn.className = (t === tabName)
                ? "fluffy-btn bg-[#f6bd60] text-[#3e2723] font-black py-1.5 flex flex-col items-center justify-center text-[11px]"
                : "fluffy-btn bg-[#fffdf5] text-[#3e2723] font-bold py-1.5 flex flex-col items-center justify-center text-[11px]";
        }
    });

    if (tabName === 'center') renderHub();
    if (tabName === 'dungeons') renderDungeonPreviews();
    if (tabName === 'packs') renderCardPacksView();
    if (tabName === 'decordex') renderDecorDex();
}

function renderHub() {
    const s = getState();
    const currentAMao = DECOR_DEX.find(d => d.id === s.equippedId) || DECOR_DEX[0];
    document.getElementById('partner-card-no').innerText = currentAMao.cardNo;
    document.getElementById('partner-name').innerText = currentAMao.name;
    document.getElementById('partner-lv').innerText = s.lv;
    document.getElementById('partner-rosette').innerHTML = renderRarityRosetteSVG(currentAMao.rarity);

    document.getElementById('partner-hearts').innerText = "❤️".repeat(s.affection) + "🤍".repeat(5 - s.affection);
    document.getElementById('amao-main-svg').innerHTML = renderAMaoSVG(currentAMao.decorType, false);

    const featuredIds = ["amao_base", "amao_pk_mushroom", "amao_pk_fourleaf", "amao_ur_meme67"];
    document.getElementById('hub-mini-cards').innerHTML = featuredIds.map(fid => {
        const item = DECOR_DEX.find(d => d.id === fid);
        const isSelected = item.id === s.equippedId;
        const unlocked = isCardUnlocked(item.id);
        return `
            <div onclick="${unlocked ? `equipAMao('${item.id}')` : `switchTab('packs')`}" 
                 title="${unlocked ? '點擊換裝' : '尚未解鎖，快去抽卡包收集！'}"
                 class="cursor-pointer rounded-xl border-2 border-[#3e2723] p-1.5 text-center transition ${isSelected ? 'bg-[#fde68a] ring-2 ring-orange-500' : 'bg-[#fffdf7] hover:bg-amber-50'}">
                <div class="text-[10px] font-black text-gray-500">${item.cardNo} (${item.rarity})</div>
                <div class="w-14 h-14 mx-auto">${renderAMaoSVG(item.decorType, !unlocked)}</div>
                <div class="text-[11px] font-black truncate mt-0.5">${unlocked ? item.name : '🔒 ？？？'}</div>
            </div>
        `;
    }).join('');

    renderDialogueBubble();

    document.getElementById('quest-list').innerHTML = s.quests.map(q => `
        <div class="p-2.5 rounded-xl border-2 border-[#3e2723] flex items-center justify-between ${q.done ? 'bg-[#fff3b0]' : 'bg-white'}">
            <div>
                <p class="font-bold text-xs md:text-sm">${q.title}</p>
                <p class="text-xs text-amber-800 font-bold mt-0.5">賞金：🌰 ${q.rewardCoins} 橡實幣</p>
            </div>
            ${q.claimed 
                ? `<span class="text-xs bg-gray-200 px-2.5 py-1 rounded-lg font-bold text-gray-500">已領取 ✓</span>`
                : q.done 
                    ? `<button onclick="claimQuest('${q.id}')" class="fluffy-btn bg-green-500 text-white text-xs font-bold px-3 py-1.5 animate-bounce">領取橡實幣!</button>`
                    : `<button onclick="switchTab('dungeons')" class="fluffy-btn bg-[#fefae0] text-[#3e2723] text-xs font-bold px-3 py-1.5">前往挑戰</button>`
            }
        </div>
    `).join('');

    const badges = [
        { name: "5級除草證書", unlocked: s.stats.angles > 0, icon: "📐" },
        { name: "特級拉麵主廚", unlocked: s.stats.alchemy > 0, icon: "🍜" },
        { name: "萬聖尋寶達人", unlocked: s.stats.english > 0, icon: "🎃" }
    ];
    document.getElementById('badge-list').innerHTML = badges.map(b => `
        <div class="p-2 rounded-xl border-2 border-[#3e2723] ${b.unlocked ? 'bg-[#fff3b0]' : 'bg-gray-200 opacity-60'}">
            <div class="text-xl mb-0.5">${b.unlocked ? b.icon : '🔒'}</div>
            <div class="text-xs font-bold">${b.name}</div>
        </div>
    `).join('');

    updateTopBar();
}

function renderDungeonPreviews() {
    const s = getState();
    document.getElementById('dungeon-preview-1').innerHTML = renderAMaoSVG('mushroom_bag', false);
    document.getElementById('dungeon-preview-2').innerHTML = renderAMaoSVG('chef', false);
    document.getElementById('dungeon-preview-3').innerHTML = renderAMaoSVG('pumpkin_cape', false);

    if (s.grade === 6) {
        document.getElementById('dg1-sub-tag').innerText = "小六數學：平角與補角推理";
        document.getElementById('dg2-sub-tag').innerText = "小六數學：高階四則分配律";
        document.getElementById('dg3-sub-tag').innerText = "小六英文：進階空間介系詞";
    } else {
        document.getElementById('dg1-sub-tag').innerText = "小四數學：角度與量角器";
        document.getElementById('dg2-sub-tag').innerText = "小四數學：乘除與分配律";
        document.getElementById('dg3-sub-tag').innerText = "小四英文：位置介系詞";
    }
}

function renderDialogueBubble() {
    const s = getState();
    const pool = DIALOGUES_BY_GRADE[s.grade] || DIALOGUES_BY_GRADE[4];
    const d = pool[appData.dialogueIdx % pool.length];
    const alreadyAnswered = s.answeredChatIds.includes(d.id);

    document.getElementById('amao-sound-tag').innerText = d.sound;
    document.getElementById('chat-quota-badge').innerText = `今日有獎問答: ${s.dailyChatCount}/3`;
    document.getElementById('bubble-en').innerText = d.en;
    document.getElementById('bubble-zh').innerText = d.zh;
    document.getElementById('bubble-options').innerHTML = d.options.map((opt) => `
        <button onclick="answerDialogue('${d.id}', ${opt.correct})" class="fluffy-btn bg-[#fefae0] hover:bg-[#f6bd60] text-[#3e2723] text-xs font-bold py-1.5 px-2 flex items-center justify-center gap-1">
            <span>${opt.text}</span>
            ${alreadyAnswered && opt.correct ? '<span class="bg-green-200 text-green-900 px-1 rounded text-[10px]">✓已領</span>' : ''}
        </button>
    `).join('');
}

function answerDialogue(chatId, isCorrect) {
    const s = getState();
    if (isCorrect) {
        const alreadyClaimed = s.answeredChatIds.includes(chatId);
        if (!alreadyClaimed && s.dailyChatCount < 3) {
            s.answeredChatIds.push(chatId);
            s.dailyChatCount++;
            s.coins += 20;
            s.quests[2].done = true;
            appData.dialogueIdx++;
            saveAppData();
            renderHub();
            document.getElementById('amao-sound-tag').innerText = "🎉「Yaha！！答對了！送你 +20 橡實幣！已自動換下一題～」";
        } else {
            appData.dialogueIdx++;
            renderHub();
            document.getElementById('amao-sound-tag').innerText = "✨「答對囉！(這題已領過獎勵或今日滿3次，去討伐副本賺更多橡實幣吧！)」";
        }
    } else {
        document.getElementById('amao-sound-tag').innerText = "💭「嗚啦...？好像不是這個意思喔，再試一次！」";
    }
}

function nextDialogue() {
    appData.dialogueIdx++;
    renderDialogueBubble();
}

function feedAMao() {
    const s = getState();
    if (s.puddings <= 0) {
        document.getElementById('amao-sound-tag').innerText = "🍮「嗚啦！焦糖布丁吃光了，快去副本賺布丁吧！」";
        return;
    }
    s.puddings--;
    s.lv++;
    if (s.affection < 5) s.affection++;
    saveAppData();
    renderHub();
    document.getElementById('amao-sound-tag').innerText = `🍮「Yaha～布丁超好吃！等級升到 Lv.${s.lv} 了！」`;
}

function claimQuest(qId) {
    const s = getState();
    const q = s.quests.find(item => item.id === qId);
    if (q && q.done && !q.claimed) {
        q.claimed = true;
        s.coins += q.rewardCoins;
        saveAppData();
        renderHub();
    }
}

function renderCardPacksView() {
    // 1. 卡包封面夥伴：預設為原始阿毛（若已解鎖 UR 則顯示 UR 阿毛）
    const hasUR = isCardUnlocked("amao_ur_meme67");
    const coverItem = DECOR_DEX.find(d => d.id === (hasUR ? "amao_ur_meme67" : "amao_base")) || DECOR_DEX[0];

    // 2. 在背景注入「紅色 6」與「藍色 7」大字塗鴉
    document.getElementById('pack-visual-icon').innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center overflow-hidden">
            <!-- 背景塗鴉：左側紅色 6、右側藍色 7 -->
            <div class="absolute inset-0 pointer-events-none select-none flex justify-between items-center px-2">
                <!-- 紅色 6 -->
                <span class="text-6xl font-black text-[#ff0055] opacity-35 -rotate-12 translate-y-2 drop-shadow-sm" 
                      style="font-family: 'Zen Maru Gothic', cursive;">
                    6
                </span>
                <!-- 藍色 7 -->
                <span class="text-6xl font-black text-[#3b86ff] opacity-35 rotate-12 -translate-y-1 drop-shadow-sm" 
                      style="font-family: 'Zen Maru Gothic', cursive;">
                    7
                </span>
            </div>

            <!-- 前景阿毛插畫 -->
            <div class="relative z-10 w-full h-full">
                ${renderAMaoSVG(coverItem.decorType, false)}
            </div>
        </div>
    `;

    const s = getState();
    const tierOrder = ["UR", "SSR", "SR", "R", "N"];
    const rarityTheme = {
        "UR":  { 
            bg: "bg-gradient-to-r from-rose-100 via-amber-100 to-cyan-100", 
            badge: "bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-300 text-[#3e2723]", 
            bar: "bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-500" 
        },
        "SSR": { 
            bg: "bg-[#fffbeb]", 
            badge: "bg-amber-400 text-[#3e2723]", 
            bar: "bg-amber-400" 
        },
        "SR":  { 
            bg: "bg-[#f0f9ff]", 
            badge: "bg-sky-300 text-[#3e2723]",   
            bar: "bg-sky-400" 
        },
        "R":   { 
            bg: "bg-[#fff7ed]", 
            badge: "bg-orange-200 text-[#3e2723]", 
            bar: "bg-orange-400" 
        },
        "N":   { 
            bg: "bg-[#fafaf9]", 
            badge: "bg-stone-200 text-[#3e2723]",  
            bar: "bg-stone-500" 
        }
    };

    // 這裡直接輸出 5 個單純的橫幅，完全不再輸出重複的五格方塊
    document.getElementById('pack-probability-list').innerHTML = tierOrder.map(rKey => {
        const spec = PACK_TIER_SPEC[rKey];
        const st = rarityTheme[rKey];
        const unlockedInTier = DECOR_DEX.filter(d => d.rarity === rKey && s.unlockedIds.includes(d.id)).length;

        return `
            <div class="p-3 rounded-xl border-2 border-[#3e2723] ${st.bg} flex items-center gap-3 shadow-sm">
                <div class="w-12 h-12 shrink-0 flex items-center justify-center">
                    ${renderRarityRosetteSVG(rKey)}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <div class="flex items-center gap-1.5">
                            <span class="${st.badge} border border-[#3e2723] text-xs px-2 py-0.5 rounded-md font-black">
                                ${rKey} 階級
                            </span>
                            <span class="font-black text-sm text-[#3e2723] truncate">
                                ${spec.label}
                            </span>
                            <span class="text-[11px] bg-white/80 border border-[#3e2723] px-1.5 py-0.2 rounded font-bold text-stone-600">
                                No.${spec.rangeStr} (共 ${spec.totalSlots} 張)
                            </span>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <span class="text-[11px] font-bold text-stone-600 bg-white/70 px-1.5 py-0.5 rounded border border-stone-300">
                                已收集 ${unlockedInTier}/${spec.totalSlots}
                            </span>
                            <span class="font-black text-sm text-orange-800">
                                ${spec.tierRate}%
                            </span>
                        </div>
                    </div>
                    <p class="text-xs text-stone-600 font-bold mb-1.5">
                        ${spec.desc}
                    </p>
                    <div class="w-full bg-white/90 h-2 rounded-full overflow-hidden border border-[#3e2723]">
                        <div class="${st.bar} h-full" style="width: ${Math.max(4, spec.tierRate)}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function pullSelectedPack() {
    const s = getState();
    const cost = 150;
    if (s.coins < cost) {
        document.getElementById('pack-desc-text').innerHTML = `<span class="text-red-600 font-black">❗ 橡實幣不足 ${cost} 枚喔！快去挑戰【討伐副本】賺取橡實幣吧！</span>`;
        return;
    }
    s.coins -= cost;
    updateTopBar();

    const foil = document.getElementById('pack-foil-card');
    foil.classList.add('animate-pack');

    setTimeout(() => {
        foil.classList.remove('animate-pack');

        const tierRoll = Math.random() * 67;
        let chosenRarity = "N";
        if (tierRoll < 1) chosenRarity = "UR";
        else if (tierRoll < 1 + 3) chosenRarity = "SSR";
        else if (tierRoll < 1 + 3 + 10) chosenRarity = "SR";
        else if (tierRoll < 1 + 3 + 10 + 23) chosenRarity = "R";
        else chosenRarity = "N";

        const pool = DECOR_DEX.filter(d => d.rarity === chosenRarity);
        const wonItem = pool[Math.floor(Math.random() * pool.length)] || DECOR_DEX[0];

        const wasAlreadyUnlocked = isCardUnlocked(wonItem.id);
        if (!wasAlreadyUnlocked) {
            s.unlockedIds.push(wonItem.id);
        }
        appData.lastPulledId = wonItem.id;

        if (wasAlreadyUnlocked) {
            s.puddings += 2;
            document.getElementById('reveal-duplicate-notice').innerText = "✨ 抽到重複卡牌！已自動轉換為「🍮 焦糖布丁 +2」！";
        } else {
            document.getElementById('reveal-duplicate-notice').innerText = "🎉 新手繪卡牌解鎖！已收錄至【最初的 67】圖鑑卡冊！";
        }

        const effRate = getCardEffectiveRate(wonItem);
        document.getElementById('reveal-series-tag').innerText = `【✨ 最初的 67】${wonItem.cardNo} (${wonItem.rarity} 階級配比抽中！單卡機率: ${effRate}%)`;
        document.getElementById('reveal-card-container').innerHTML = renderCollectibleCardHTML(wonItem, true, false, false);
        document.getElementById('reveal-desc').innerText = wonItem.desc;

        saveAppData();
        updateTopBar();
        renderCardPacksView();
        openModal('pack-reveal-modal');
    }, 450);
}

function equipFromModal() {
    const s = getState();
    s.equippedId = appData.lastPulledId;
    saveAppData();
    closeModal('pack-reveal-modal');
    switchTab('center');
}

function filterDex(rarityOrAll) {
    appData.dexFilter = rarityOrAll;
    renderDecorDex();
}

function toggleShowEmptySlots() {
    appData.showAll67Slots = !appData.showAll67Slots;
    const btn = document.getElementById('btn-toggle-slots');
    btn.innerText = appData.showAll67Slots ? "🔍 顯示全部 67 個預留卡位：開" : "🔍 顯示全部 67 個預留卡位：關";
    btn.className = appData.showAll67Slots
        ? "fluffy-btn bg-[#3e2723] text-[#fdf0b6] px-3 py-1.5 text-xs font-black"
        : "fluffy-btn bg-white text-[#3e2723] px-3 py-1.5 text-xs font-black";
    renderDecorDex();
}

function getRarityBySlotNumber(slot) {
    if (slot === 67) return { rarity: "UR", hint: "UR 壓軸主題" };
    if (slot >= 64) return { rarity: "SSR", hint: "SSR 傳奇裝扮預留位" };
    if (slot >= 54) return { rarity: "SR", hint: "SR 特殊/捷運出遊預留位" };
    if (slot >= 31) return { rarity: "R", hint: "R 副本 Boss 預留位" };
    return { rarity: "N", hint: "N 習作題目人物 (爸媽/小明等)" };
}

function renderPlaceholderSlotHTML(slot) {
    const code = `No.${String(slot).padStart(3, '0')}`;
    const info = getRarityBySlotNumber(slot);
    return `
        <div class="amao-illust-card p-3.5 flex flex-col justify-between opacity-60 bg-stone-200/80 border-dashed">
            <div class="flex justify-between items-start">
                <span class="bg-white/80 border-2 border-[#3e2723] px-2.5 py-0.5 rounded-full text-xs font-black text-[#3e2723]">
                    ${code}
                </span>
                <div class="w-10 h-10 -mt-1 -mr-1">
                    ${renderRarityRosetteSVG(info.rarity)}
                </div>
            </div>
            <div class="w-full h-36 my-1 flex flex-col items-center justify-center text-center px-2">
                <div class="text-3xl mb-1 opacity-50">🔒</div>
                <div class="text-xs font-black text-stone-700">${info.hint}</div>
                <div class="text-[11px] font-bold text-stone-500 mt-0.5">隨新題目與出遊擴充登場</div>
            </div>
            <div class="amao-nameplate py-1 px-2 text-center bg-stone-100">
                <span class="font-black text-xs text-stone-500">尚未登場 (${code})</span>
            </div>
        </div>
    `;
}

function renderDecorDex() {
    const s = getState();
    const grid = document.getElementById('decordex-grid');

    if (!appData.showAll67Slots) {
        const list = appData.dexFilter === 'ALL'
            ? [...DECOR_DEX].sort((a, b) => a.slotNo - b.slotNo)
            : DECOR_DEX.filter(d => d.rarity === appData.dexFilter).sort((a, b) => a.slotNo - b.slotNo);

        grid.innerHTML = list.map(item => {
            const isEquipped = item.id === s.equippedId;
            const unlocked = isCardUnlocked(item.id);
            return renderCollectibleCardHTML(item, unlocked, isEquipped, true);
        }).join('');
    } else {
        let cardsHTML = [];
        for (let slot = 1; slot <= 67; slot++) {
            const info = getRarityBySlotNumber(slot);
            if (appData.dexFilter !== 'ALL' && appData.dexFilter !== info.rarity) continue;

            const existingCard = DECOR_DEX.find(d => d.slotNo === slot);
            if (existingCard) {
                const isEquipped = existingCard.id === s.equippedId;
                const unlocked = isCardUnlocked(existingCard.id);
                cardsHTML.push(renderCollectibleCardHTML(existingCard, unlocked, isEquipped, true));
            } else {
                cardsHTML.push(renderPlaceholderSlotHTML(slot));
            }
        }
        grid.innerHTML = cardsHTML.join('');
    }
    updateTopBar();
}

function equipAMao(id) {
    if (isCardUnlocked(id)) {
        getState().equippedId = id;
        saveAppData();
        switchTab('center');
    }
}

// --- 副本 1：雷射除草機 ---
let currentAngleStage = 0;

function initProtractorTicks() {
    const g = document.getElementById('protractor-ticks');
    if (!g) return;
    let html = '';
    for (let deg = 0; deg <= 180; deg += 15) {
        const rad = (deg * Math.PI) / 180;
        const x1 = 200 + 150 * Math.cos(rad);
        const y1 = 200 - 150 * Math.sin(rad);
        const x2 = 200 + 165 * Math.cos(rad);
        const y2 = 200 - 165 * Math.sin(rad);
        const tx = 200 + 182 * Math.cos(rad);
        const ty = 200 - 182 * Math.sin(rad);
        html += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f6bd60" stroke-width="2"/>`;
        if (deg % 30 === 0) {
            html += `<text x="${tx}" y="${ty}" fill="#ffffff" font-size="11" text-anchor="middle" dominant-baseline="middle">${deg}°</text>`;
        }
    }
    g.innerHTML = html;
}

function getAngleStages() {
    return ANGLE_STAGES_BY_GRADE[getState().grade] || ANGLE_STAGES_BY_GRADE[4];
}

function loadAngleStage() {
    const stage = getAngleStages()[currentAngleStage];
    document.getElementById('angle-stage-num').innerText = currentAngleStage + 1;
    document.getElementById('angle-mission-prompt').innerHTML = stage.prompt;
    document.getElementById('angle-type-hint').innerText = `💡 阿毛提示：${stage.hint}`;
    document.getElementById('angle-feedback').innerText = "";

    const rad = (stage.target * Math.PI) / 180;
    const tx = 200 + 145 * Math.cos(rad);
    const ty = 200 - 145 * Math.sin(rad);
    document.getElementById('angle-target-group').setAttribute('transform', `translate(${tx}, ${ty})`);

    document.getElementById('angle-slider').value = 0;
    updateLaserAngle(0);
}

function updateLaserAngle(deg) {
    deg = parseInt(deg, 10);
    document.getElementById('current-angle-display').innerText = `${deg}°`;
    const rad = (deg * Math.PI) / 180;
    const x2 = 200 + 155 * Math.cos(rad);
    const y2 = 200 - 155 * Math.sin(rad);
    document.getElementById('laser-beam').setAttribute('x2', x2);
    document.getElementById('laser-beam').setAttribute('y2', y2);
}

function adjustAngle(delta) {
    const slider = document.getElementById('angle-slider');
    let nextVal = Math.max(0, Math.min(180, parseInt(slider.value, 10) + delta));
    slider.value = nextVal;
    updateLaserAngle(nextVal);
}

function fireLaser() {
    const playerDeg = parseInt(document.getElementById('angle-slider').value, 10);
    const stages = getAngleStages();
    const targetDeg = stages[currentAngleStage].target;
    const diff = Math.abs(playerDeg - targetDeg);

    if (diff === 0) {
        document.getElementById('angle-feedback').innerText = "⚡ Yaha！完美命中清除毒蘑菇！";
        setTimeout(() => {
            currentAngleStage++;
            if (currentAngleStage >= stages.length) {
                const s = getState();
                s.stats.angles++;
                s.quests[0].done = true;
                saveAppData();
                showVictoryModal("【阿毛的雷射除草機】完美通關！", "阿毛順利拿到 5 級除草證書，快拿橡實幣去抽手繪卡包吧！", 300, 2);
            } else {
                loadAngleStage();
            }
        }, 650);
    } else {
        const hintDir = playerDeg < targetDeg ? "角度太小囉，再往左調大一點！" : "角度太大囉，再往右調小一點！";
        document.getElementById('angle-feedback').innerText = `💥 差了 ${diff} 度！${hintDir}`;
    }
}

// --- 副本 2：暴走拉麵大釜 ---
let currentAlchemyStage = 0;
let selectedBerryValue = 25;
let currentPotTotal = 0;
let potFormulaParts = [];

function getAlchemyStages() {
    return ALCHEMY_STAGES_BY_GRADE[getState().grade] || ALCHEMY_STAGES_BY_GRADE[4];
}

function loadAlchemyStage() {
    const stages = getAlchemyStages();
    document.getElementById('alchemy-stage-num').innerText = currentAlchemyStage + 1;
    document.getElementById('alchemy-target').innerText = stages[currentAlchemyStage].target;
    resetAlchemyPot();
}

function selectBerry(val) {
    selectedBerryValue = val;
    [25, 40, 15].forEach(v => {
        document.getElementById(`berry-${v}`).className = v === val 
            ? "fluffy-btn bg-pink-900 border-2 border-[#f6bd60] text-white p-3 text-center"
            : "fluffy-btn bg-stone-800 text-white p-3 text-center";
    });
}

function applyMultiplier(mult) {
    currentPotTotal += selectedBerryValue * mult;
    potFormulaParts.push(`(${selectedBerryValue} × ${mult})`);
    document.getElementById('alchemy-feedback').innerText = "";
    updateAlchemyUI();
}

function resetAlchemyPot() {
    currentPotTotal = 0;
    potFormulaParts = [];
    document.getElementById('alchemy-feedback').innerText = "";
    updateAlchemyUI();
}

function updateAlchemyUI() {
    const target = getAlchemyStages()[currentAlchemyStage].target;
    const pct = Math.min(100, Math.round((currentPotTotal / target) * 100));
    document.getElementById('alchemy-bar').style.width = `${pct}%`;
    document.getElementById('alchemy-current-text').innerText = `目前大釜內：${currentPotTotal} / ${target} g`;
    document.getElementById('alchemy-formula-log').innerText = potFormulaParts.length > 0 
        ? `拉麵配方算式：${potFormulaParts.join(' + ')} = ${currentPotTotal} g`
        : "尚未投入配料（提示：組合配料與倍增卡湊出目標克數！）";
}

function submitAlchemyPot() {
    const stages = getAlchemyStages();
    const target = stages[currentAlchemyStage].target;
    if (currentPotTotal === target) {
        document.getElementById('alchemy-feedback').innerText = "🍜 嗚啦！！份量完美！再來下一碗！";
        setTimeout(() => {
            currentAlchemyStage++;
            if (currentAlchemyStage >= stages.length) {
                const s = getState();
                s.stats.alchemy++;
                s.quests[1].done = true;
                saveAppData();
                showVictoryModal("【阿毛的暴走拉麵大釜】完美通關！", "阿毛吃得肚子圓滾滾的，送你滿滿的橡實幣！", 350, 2);
            } else {
                loadAlchemyStage();
            }
        }, 650);
    } else if (currentPotTotal < target) {
        document.getElementById('alchemy-feedback').innerText = `❗ 還差 ${target - currentPotTotal} 克喔！再加一點配料吧！`;
    } else {
        document.getElementById('alchemy-feedback').innerText = `💥 超過 ${currentPotTotal - target} 克了！請點「倒掉重煮」重新調配！`;
    }
}

// --- 副本 3：萬聖節糖果躲貓貓 ---
let currentEngStage = 0;

function getEngStages() {
    return ENG_STAGES_BY_GRADE[getState().grade] || ENG_STAGES_BY_GRADE[4];
}

function loadEngStage() {
    const stage = getEngStages()[currentEngStage];
    document.getElementById('eng-stage-num').innerText = currentEngStage + 1;
    document.getElementById('eng-clue-sentence').innerHTML = stage.sentence;
    document.getElementById('eng-feedback').innerText = "";

    document.getElementById('eng-spots-grid').innerHTML = stage.options.map((opt, idx) => `
        <button onclick="checkEngSpot(${idx})" class="fluffy-box bg-white text-[#3e2723] p-6 flex flex-col items-center justify-center hover:bg-[#fff3b0] transition">
            <div class="text-5xl mb-3">${opt.icon}</div>
            <div class="font-black text-lg text-[#1d3557]">${opt.label}</div>
            <div class="text-xs text-gray-500 font-bold mt-1">點擊幫阿毛翻找這裡</div>
        </button>
    `).join('');
}

function checkEngSpot(idx) {
    const stages = getEngStages();
    const stage = stages[currentEngStage];
    if (idx === stage.correctIndex) {
        document.getElementById('eng-feedback').innerText = "🎃 Trick or Treat! 找到萬聖節糖果了！Yaha！";
        setTimeout(() => {
            currentEngStage++;
            if (currentEngStage >= stages.length) {
                getState().stats.english++;
                saveAppData();
                showVictoryModal("【萬聖節糖果躲貓貓】完美通關！", "你的英文位置介系詞超強，萬聖南瓜阿毛找到滿滿一籃糖果！", 300, 2);
            } else {
                loadEngStage();
            }
        }, 650);
    } else {
        document.getElementById('eng-feedback').innerText = "💨 嗚啦？這裡沒有糖果喔！再看一次英文介系詞提示！";
    }
}

function startDungeon(type) {
    if (type === 'angles') {
        currentAngleStage = 0;
        switchTab('dungeon-angles');
        loadAngleStage();
    } else if (type === 'alchemy') {
        currentAlchemyStage = 0;
        switchTab('dungeon-alchemy');
        loadAlchemyStage();
    } else if (type === 'english') {
        currentEngStage = 0;
        switchTab('dungeon-english');
        loadEngStage();
    }
}

function showVictoryModal(title, desc, coins, puddings) {
    const s = getState();
    s.coins += coins;
    s.puddings += puddings;
    saveAppData();
    document.getElementById('victory-title').innerText = title;
    document.getElementById('victory-desc').innerText = desc;
    document.getElementById('victory-coins').innerText = `+${coins}`;
    document.getElementById('victory-puddings').innerText = `+${puddings}`;
    openModal('victory-modal');
}

function closeVictoryModal() {
    closeModal('victory-modal');
    switchTab('packs');
}

function saveProfileCustom() {
    const s = getState();
    const newName = document.getElementById('input-prof-name').value.trim();
    const newBday = document.getElementById('input-prof-bday').value.trim();
    if (newName) s.name = newName;
    if (/^\d{2}-\d{2}$/.test(newBday)) s.bday = newBday;
    saveAppData();
    checkDateAndEvents();
    renderHub();
    openModal('parent-modal');
}

function openModal(id) {
    if (id === 'profile-modal') {
        const p1 = appData.profiles.p1;
        const p2 = appData.profiles.p2;
        document.getElementById('prof-name-p1').innerText = p1.name;
        document.getElementById('prof-coins-p1').innerText = `🌰 ${p1.coins}`;
        document.getElementById('prof-dex-p1').innerText = `📖 ${p1.unlockedIds.length}/67 張`;
        document.getElementById('prof-name-p2').innerText = p2.name;
        document.getElementById('prof-coins-p2').innerText = `🌰 ${p2.coins}`;
        document.getElementById('prof-dex-p2').innerText = `📖 ${p2.unlockedIds.length}/67 張`;
    }
    if (id === 'parent-modal') {
        const s = getState();
        document.getElementById('parent-cur-prof-label').innerText = `${s.icon} ${s.name} (${s.grade}年級)`;
        document.getElementById('input-prof-name').value = s.name;
        document.getElementById('input-prof-bday').value = s.bday;

        const p1 = appData.profiles.p1;
        const p2 = appData.profiles.p2;
        document.getElementById('parent-dual-stats').innerHTML = [p1, p2].map(p => `
            <div class="p-3 bg-amber-50 border-2 border-[#3e2723] rounded-xl">
                <div class="font-black text-sm text-[#3e2723] mb-1">${p.icon} ${p.name} (小學 ${p.grade} 年級) — 生日: ${p.bday}</div>
                <div class="grid grid-cols-3 gap-2 text-center bg-white p-2 rounded-lg border border-amber-300">
                    <div>📐 角度通關: <b>${p.stats.angles}次</b></div>
                    <div>🍲 乘除通關: <b>${p.stats.alchemy}次</b></div>
                    <div>🎃 英文通關: <b>${p.stats.english}次</b></div>
                </div>
            </div>
        `).join('');
    }
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

window.addEventListener('DOMContentLoaded', () => {
    loadAppData();
    initProtractorTicks();
    checkDateAndEvents();
    renderHub();
});