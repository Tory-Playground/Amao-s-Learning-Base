/* ============================================================================
 * 🔒 [冷凍區] 阿毛黃金比例手繪 SVG 與卡牌渲染引擎
 * 身體曲線比例已由孩子們驗收通過，非新增配件請勿修改！
 * ============================================================================ */

function renderRarityRosetteSVG(rarity) {
    const fillMap = {
        "N": "#b8c0ff",
        "R": "#e5a97c",
        "SR": "url(#sr-holo)",
        "SSR": "url(#ssr-gold)",
        "UR": "url(#ur-rainbow)"
    };
    const fill = fillMap[rarity] || "#e5a97c";
    const fontSize = rarity === 'SSR' ? '14' : (rarity === 'UR' ? '16' : '18');
    return `
    <svg viewBox="0 0 60 60" class="w-full h-full overflow-visible" filter="url(#crayon-sketch)">
        <path d="M30 3 L35 8 L42 5 L45 12 L52 12 L52 19 L58 23 L55 30 L58 37 L52 41 L52 48 L45 48 L42 55 L35 52 L30 57 L25 52 L18 55 L15 48 L8 48 L8 41 L2 37 L5 30 L2 23 L8 19 L8 12 L15 12 L18 5 L25 8 Z" 
              fill="${fill}" stroke="#3e2723" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="30" cy="30" r="20" fill="none" stroke="#3e2723" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="30" y="36" font-family="'Zen Maru Gothic', sans-serif" font-weight="900" font-size="${fontSize}" text-anchor="middle" fill="#fffdf5" stroke="#3e2723" stroke-width="3.5" paint-order="stroke">${rarity}</text>
    </svg>`;
}

function renderAMaoSVG(decorType, isSilhouette = false) {
    let backDecor = "";
    let frontDecor = "";
    let extraFloating = "";

    const isHappyOpenMouth = ["pumpkin_cape", "clover_yaha", "devil", "goggles", "meme_67"].includes(decorType);
    const isBothArmsUp = ["clover_yaha", "devil", "goggles"].includes(decorType);
    const isOneArmUp = ["pumpkin_cape", "witch", "chef"].includes(decorType);
    const isMeme67Pose = (decorType === "meme_67");

    const mouthSVG = isHappyOpenMouth ? `
        <path d="M 93 111 Q 100 108 107 111" fill="none" stroke="#3e2723" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M 94 111 Q 100 129 106 111 Z" fill="#591c21" stroke="#3e2723" stroke-width="3" stroke-linejoin="round"/>
        <path d="M 96 118 Q 100 125 104 118 Q 100 115 96 118 Z" fill="#ff8fa3"/>
    ` : `
        <path d="M 93 111 Q 96.5 115 100 110 Q 103.5 115 107 111" fill="none" stroke="#3e2723" stroke-width="3.3" stroke-linecap="round"/>
        <line x1="100" y1="108" x2="100" y2="117" stroke="#3e2723" stroke-width="3.2" stroke-linecap="round"/>
    `;

    let armsSVG = "";
    if (isMeme67Pose) {
        armsSVG = `
            <g class="anim-67-l">
                <path d="M 55 122 Q 26 105 24 118 Q 25 129 52 132" fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.6" stroke-linecap="round"/>
                <path d="M 22 103 L 28 97 M 22 133 L 28 139" stroke="#e63946" stroke-width="2.5" stroke-linecap="round"/>
                <text x="18" y="94" font-family="'Zen Maru Gothic', sans-serif" font-weight="900" font-size="24" fill="#ff0055" stroke="#ffffff" stroke-width="4" paint-order="stroke">6</text>
            </g>
            <g class="anim-67-r">
                <path d="M 145 122 Q 174 128 176 115 Q 175 104 148 112" fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.6" stroke-linecap="round"/>
                <path d="M 178 98 L 172 92 M 178 130 L 172 136" stroke="#3a86ff" stroke-width="2.5" stroke-linecap="round"/>
                <text x="166" y="94" font-family="'Zen Maru Gothic', sans-serif" font-weight="900" font-size="24" fill="#3a86ff" stroke="#ffffff" stroke-width="4" paint-order="stroke">7</text>
            </g>
        `;
    } else if (isBothArmsUp) {
        armsSVG = `
            <path d="M 55 123 Q 37 107 43 97 Q 49 92 59 111" fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M 145 123 Q 163 107 157 97 Q 151 92 141 111" fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.5" stroke-linecap="round"/>
        `;
    } else if (isOneArmUp) {
        armsSVG = `
            <path d="M 55 123 Q 45 133 49 143 Q 55 146 60 135" fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M 145 121 Q 163 103 157 94 Q 151 90 141 109" fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.5" stroke-linecap="round"/>
        `;
    } else {
        armsSVG = `
            <path d="M 55 123 Q 45 133 49 143 Q 55 146 60 135" fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M 145 123 Q 155 133 151 143 Q 145 146 140 135" fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.5" stroke-linecap="round"/>
        `;
    }

    if (decorType === "meme_67") {
        backDecor = `<circle cx="100" cy="110" r="68" fill="none" stroke="url(#ur-rainbow)" stroke-width="3.5" stroke-dasharray="6 4" opacity="0.85"/>`;
        frontDecor = `
            <g transform="translate(0, -1)">
                <polygon points="56,88 96,88 92,103 62,103" fill="#1d1e22" stroke="#3e2723" stroke-width="3" stroke-linejoin="round"/>
                <polygon points="104,88 144,88 138,103 108,103" fill="#1d1e22" stroke="#3e2723" stroke-width="3" stroke-linejoin="round"/>
                <line x1="94" y1="90" x2="106" y2="90" stroke="#3e2723" stroke-width="3.5"/>
                <line x1="65" y1="91" x2="73" y2="100" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="74" y1="91" x2="80" y2="98" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                <line x1="113" y1="91" x2="121" y2="100" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="122" y1="91" x2="128" y2="98" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            </g>
            <g transform="translate(100, 48)">
                <rect x="-24" y="-12" width="48" height="20" rx="8" fill="url(#ur-rainbow)" stroke="#3e2723" stroke-width="3"/>
                <text x="0" y="3" font-family="'Zen Maru Gothic', sans-serif" font-weight="900" font-size="14" text-anchor="middle" fill="#ffffff" stroke="#3e2723" stroke-width="3" paint-order="stroke">67 KING</text>
            </g>
            <path d="M 75 126 Q 100 144 125 126" fill="none" stroke="#ffd166" stroke-width="4" stroke-dasharray="4 2"/>
            <circle cx="100" cy="138" r="9" fill="#ffd166" stroke="#3e2723" stroke-width="2.5"/>
            <text x="100" y="142" font-size="9" font-weight="900" text-anchor="middle" fill="#3e2723">67</text>
        `;
        extraFloating = `<text x="148" y="46" font-family="'Zen Maru Gothic', cursive" font-weight="900" font-size="16" fill="#ff0055" transform="rotate(14 148 46)">Six-Seven!</text>`;
    } else if (decorType === "pumpkin_cape") {
        backDecor = `
            <path d="M 56 122 Q 25 132 22 152 Q 35 146 44 154 Q 52 146 62 150 Z" fill="#3b322c" stroke="#3e2723" stroke-width="3.2" stroke-linejoin="round"/>
            <path d="M 144 122 Q 175 132 178 152 Q 165 146 156 154 Q 148 146 138 150 Z" fill="#3b322c" stroke="#3e2723" stroke-width="3.2" stroke-linejoin="round"/>
        `;
        frontDecor = `
            <path d="M 58 122 Q 100 133 142 122" fill="none" stroke="#3e2723" stroke-width="3.5"/>
            <ellipse cx="94" cy="127" rx="7" ry="4.5" transform="rotate(-15 94 127)" fill="#3b322c" stroke="#3e2723" stroke-width="2.5"/>
            <ellipse cx="106" cy="127" rx="7" ry="4.5" transform="rotate(15 106 127)" fill="#3e2723" stroke="#3e2723" stroke-width="2.5"/>
            <circle cx="100" cy="127" r="3.5" fill="#3b322c" stroke="#3e2723" stroke-width="2.5"/>
            <g transform="translate(0, 2)">
                <ellipse cx="100" cy="54" rx="26" ry="18" fill="#f48c06" stroke="#3e2723" stroke-width="3.5"/>
                <path d="M 88 37 Q 80 54 88 71" fill="none" stroke="#3e2723" stroke-width="2" opacity="0.6"/>
                <path d="M 112 37 Q 120 54 112 71" fill="none" stroke="#3e2723" stroke-width="2" opacity="0.6"/>
                <path d="M 98 36 Q 100 27 104 30" fill="none" stroke="#588157" stroke-width="4.5" stroke-linecap="round"/>
                <polygon points="88,50 93,43 96,51" fill="#3e2723"/>
                <polygon points="104,51 107,43 112,50" fill="#3e2723"/>
                <polygon points="98,54 100,51 102,54" fill="#3e2723"/>
                <path d="M 88 58 L 93 62 L 97 59 L 100 62 L 103 59 L 107 62 L 112 58" fill="none" stroke="#3e2723" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
        `;
    } else if (decorType === "mushroom_bag") {
        frontDecor = `
            <path d="M 56 126 Q 100 142 142 135" fill="none" stroke="#588157" stroke-width="4" stroke-linecap="round"/>
            <path d="M 131 124 Q 157 120 153 145 Q 147 158 131 148 Z" fill="#90a955" stroke="#3e2723" stroke-width="3.2" stroke-linejoin="round"/>
            <path d="M 133 130 Q 144 134 143 143" fill="none" stroke="#4f772d" stroke-width="2"/>
            <g transform="translate(22, -4) rotate(14 100 55)">
                <path d="M 94 64 L 95 45 L 106 45 L 107 64 Z" fill="#faedcd" stroke="#3e2723" stroke-width="3" stroke-linejoin="round"/>
                <path d="M 76 47 Q 100 18 124 47 Z" fill="#e63946" stroke="#3e2723" stroke-width="3.2" stroke-linejoin="round"/>
                <circle cx="90" cy="36" r="4.5" fill="#ffffff"/>
                <circle cx="104" cy="31" r="5" fill="#ffffff"/>
                <circle cx="113" cy="40" r="3.5" fill="#ffffff"/>
            </g>
        `;
        extraFloating = `
            <path d="M 155 62 Q 162 58 160 66 Q 166 65 162 72" fill="none" stroke="#3e2723" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="148" cy="55" r="1.8" fill="#3e2723"/>
        `;
    } else if (decorType === "clover_yaha") {
        frontDecor = `
            <path d="M 76 62 Q 100 54 124 62" fill="none" stroke="#588157" stroke-width="3.5" stroke-linecap="round"/>
            <g transform="translate(-20, -4) rotate(-15 100 45)">
                <path d="M 100 62 L 100 42" stroke="#588157" stroke-width="3.5" stroke-linecap="round"/>
                <circle cx="92" cy="36" r="8" fill="#80b918" stroke="#3e2723" stroke-width="2.8"/>
                <circle cx="108" cy="36" r="8" fill="#80b918" stroke="#3e2723" stroke-width="2.8"/>
                <circle cx="92" cy="48" r="8" fill="#80b918" stroke="#3e2723" stroke-width="2.8"/>
                <circle cx="108" cy="48" r="8" fill="#80b918" stroke="#3e2723" stroke-width="2.8"/>
            </g>
            <g transform="translate(18, 2) rotate(18 100 48)">
                <path d="M 100 62 L 100 46" stroke="#588157" stroke-width="3.2" stroke-linecap="round"/>
                <circle cx="94" cy="42" r="6.5" fill="#80b918" stroke="#3e2723" stroke-width="2.6"/>
                <circle cx="106" cy="42" r="6.5" fill="#80b918" stroke="#3e2723" stroke-width="2.6"/>
                <circle cx="100" cy="51" r="6.5" fill="#80b918" stroke="#3e2723" stroke-width="2.6"/>
            </g>
        `;
        extraFloating = `<text x="164" y="68" font-family="'Zen Maru Gothic', cursive" font-weight="900" font-size="18" fill="#3e2723" transform="rotate(32 164 68)">Yaha!</text>`;
    } else if (decorType === "devil") {
        backDecor = `
            <path d="M44 125 Q15 104 22 135 Q32 140 48 140 Z" fill="#7209b7" stroke="#3e2723" stroke-width="3.2"/>
            <path d="M156 125 Q185 104 178 135 Q168 140 152 140 Z" fill="#7209b7" stroke="#3e2723" stroke-width="3.2"/>
        `;
        frontDecor = `
            <path d="M72 64 Q54 38 78 50 Z" fill="#e63946" stroke="#3e2723" stroke-width="3.2"/>
            <path d="M128 64 Q146 38 122 50 Z" fill="#e63946" stroke="#3e2723" stroke-width="3.2"/>
            <line x1="166" y1="88" x2="166" y2="158" stroke="#e63946" stroke-width="4" stroke-linecap="round"/>
            <path d="M156 96 L166 80 L176 96" fill="none" stroke="#e63946" stroke-width="3.5" stroke-linecap="round"/>
        `;
    } else if (decorType === "witch") {
        frontDecor = `
            <ellipse cx="100" cy="60" rx="46" ry="11" fill="#5a189a" stroke="#3e2723" stroke-width="3.5"/>
            <path d="M72 58 L102 10 L128 58 Z" fill="#7b2cbf" stroke="#3e2723" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M76 52 L124 52" stroke="#fca311" stroke-width="5.5"/>
            <text x="100" y="45" font-size="15" text-anchor="middle">⭐</text>
        `;
    } else if (decorType === "mummy") {
        frontDecor = `
            <rect x="54" y="64" width="92" height="12" rx="5" fill="#ffffff" stroke="#3e2723" stroke-width="3" transform="rotate(-5 100 70)"/>
            <rect x="50" y="128" width="100" height="13" rx="5" fill="#ffffff" stroke="#3e2723" stroke-width="3" transform="rotate(4 100 135)"/>
        `;
    } else if (decorType === "acorn") {
        frontDecor = `
            <path d="M66 62 Q100 30 134 62 Z" fill="#9c6644" stroke="#3e2723" stroke-width="3.5"/>
            <line x1="100" y1="38" x2="100" y2="26" stroke="#3e2723" stroke-width="5" stroke-linecap="round"/>
        `;
    } else if (decorType === "goggles") {
        frontDecor = `
            <rect x="54" y="78" width="92" height="24" rx="11" fill="#4cc9f0" stroke="#3e2723" stroke-width="3.5" opacity="0.9"/>
            <line x1="100" y1="78" x2="100" y2="102" stroke="#3e2723" stroke-width="3.5"/>
            <circle cx="78" cy="90" r="6" fill="#ffffff" opacity="0.65"/>
            <circle cx="122" cy="90" r="6" fill="#ffffff" opacity="0.65"/>
        `;
    } else if (decorType === "chef") {
        frontDecor = `
            <path d="M68 60 Q60 22 100 22 Q140 22 132 60 Z" fill="#ffffff" stroke="#3e2723" stroke-width="3.5"/>
            <rect x="65" y="54" width="70" height="9" rx="4" fill="#e63946" stroke="#3e2723" stroke-width="3"/>
        `;
    }

    return `
    <svg viewBox="0 0 200 195" class="w-full h-full overflow-visible ${isSilhouette ? 'silhouette-svg' : ''}">
        <ellipse cx="100" cy="176" rx="38" ry="8" fill="#3e2723" opacity="0.22" filter="url(#crayon-sketch)"/>
        <path d="M 72 176 L 128 176 M 78 179 L 122 179" stroke="#3e2723" stroke-width="2" opacity="0.3" stroke-linecap="round"/>

        <g filter="url(#sticker-cutout)">
            <g filter="url(#crayon-sketch)">
                ${backDecor}
                <path d="M 133 143 Q 150 139 148 151 Q 151 158 140 159 Q 134 160 130 153 Z" fill="#fffdf7" stroke="#3e2723" stroke-width="3.2" stroke-linejoin="round"/>
                <path d="M 141 146 L 145 144 M 143 151 L 147 151 M 140 155 L 144 157" stroke="#3e2723" stroke-width="1.8" stroke-linecap="round"/>

                <g>
                    <path d="M 81 62 C 76 32, 79 12, 90 12 C 98 12, 100 32, 99 60 Z" fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.6" stroke-linejoin="round"/>
                    <path d="M 85 57 C 82 36, 84 21, 90 21 C 94 21, 95 36, 95 57 Z" fill="url(#ear-pink)"/>
                    <path d="M 101 60 C 100 32, 102 12, 110 12 C 121 12, 124 32, 119 62 Z" fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.6" stroke-linejoin="round"/>
                    <path d="M 105 57 C 105 36, 106 21, 110 21 C 116 21, 118 36, 115 57 Z" fill="url(#ear-pink)"/>
                </g>

                <path d="M 88 155 L 88 169 Q 88 174 93.5 174 Q 99 174 99 169 L 99 157 Z" fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.5" stroke-linejoin="round"/>
                <path d="M 101 157 L 101 169 Q 101 174 106.5 174 Q 112 174 112 169 L 112 155 Z" fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.5" stroke-linejoin="round"/>

                <!-- 🔒 鎖死黃金比例身體曲線 -->
                <path d="M 100 54
                         C 141 54, 158 75, 156 99
                         C 155 111, 148 118, 144 121
                         C 149 138, 138 161, 100 161
                         C 62 161, 51 138, 56 121
                         C 52 118, 45 111, 44 99
                         C 42 75, 59 54, 100 54 Z" 
                      fill="url(#plush-cream)" stroke="#3e2723" stroke-width="3.8" stroke-linejoin="round"/>

                <path d="M 44 93 L 39 91 M 43 99 L 38 99 M 45 105 L 40 107" stroke="#3e2723" stroke-width="2.2" stroke-linecap="round"/>
                <path d="M 156 93 L 161 91 M 157 99 L 162 99 M 155 105 L 160 107" stroke="#3e2723" stroke-width="2.2" stroke-linecap="round"/>
                <path d="M 59 144 L 55 147 M 64 150 L 60 153" stroke="#3e2723" stroke-width="2" stroke-linecap="round"/>
                <path d="M 141 144 L 145 147 M 136 150 L 140 153" stroke="#3e2723" stroke-width="2" stroke-linecap="round"/>
                <path d="M 122 145 L 132 139 M 124 150 L 134 144 M 126 154 L 133 150" stroke="#d4b269" stroke-width="2" stroke-linecap="round" opacity="0.6"/>

                ${armsSVG}

                <path d="M 67 82 Q 77 71 89 77" fill="none" stroke="#3e2723" stroke-width="3.2" stroke-linecap="round"/>
                <path d="M 133 82 Q 123 71 111 77" fill="none" stroke="#3e2723" stroke-width="3.2" stroke-linecap="round"/>

                <g>
                    <ellipse cx="81" cy="96" rx="7.8" ry="8.5" fill="#3e2723"/>
                    <circle cx="81" cy="93.5" r="3.2" fill="#ffffff"/>
                    <path d="M 77.5 99.5 Q 81 102.5 84.5 99.5" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
                    <ellipse cx="119" cy="96" rx="7.8" ry="8.5" fill="#3e2723"/>
                    <circle cx="119" cy="93.5" r="3.2" fill="#ffffff"/>
                    <path d="M 115.5 99.5 Q 119 102.5 122.5 99.5" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
                </g>

                <g>
                    <ellipse cx="64" cy="107" rx="11.5" ry="7" fill="#ff9ebb"/>
                    <path d="M 58 109 L 60 104 M 62 110 L 64 104 M 66 110 L 68 104 M 70 109 L 71.5 105" stroke="#3e2723" stroke-width="2.3" stroke-linecap="round"/>
                    <ellipse cx="136" cy="107" rx="11.5" ry="7" fill="#ff9ebb"/>
                    <path d="M 130 109 L 132 104 M 134 110 L 136 104 M 138 110 L 140 104 M 142 109 L 143.5 105" stroke="#3e2723" stroke-width="2.3" stroke-linecap="round"/>
                </g>

                ${mouthSVG}
                ${frontDecor}
            </g>
        </g>

        ${!isSilhouette ? `
        <g filter="url(#crayon-sketch)" opacity="0.9">
            <path d="M 26 52 L 29 58 L 36 59 L 31 64 L 32 70 L 26 67 L 20 70 L 21 64 L 16 59 L 23 58 Z" fill="#ffe169" stroke="#3e2723" stroke-width="2" stroke-linejoin="round"/>
            <path d="M 38 30 L 40 34 L 44 35 L 41 38 L 42 42 L 38 40 L 34 42 L 35 38 L 32 35 L 36 34 Z" fill="#ffe169" stroke="#3e2723" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M 168 128 C 165 123, 158 125, 160 132 C 162 137, 168 140, 168 140 C 168 140, 174 137, 176 132 C 178 125, 171 123, 168 128 Z" fill="#ffadad" stroke="#3e2723" stroke-width="2" stroke-linejoin="round"/>
            <path d="M 155 148 C 153 144, 148 146, 149 151 C 150 155, 155 157, 155 157 C 155 157, 160 155, 161 151 C 162 146, 157 144, 155 148 Z" fill="#ffadad" stroke="#3e2723" stroke-width="1.8" stroke-linecap="round"/>
            ${extraFloating}
        </g>
        ` : ''}
    </svg>`;
}

function renderCollectibleCardHTML(item, isUnlocked, isEquipped = false, showActionBtn = true) {
    return `
        <div class="amao-illust-card p-3.5 flex flex-col justify-between transition transform hover:-translate-y-1 ${isUnlocked ? '' : 'opacity-80 bg-stone-200'}">
            <div class="flex justify-between items-start z-10">
                <span class="bg-[#fdf8ee] border-2 border-[#3e2723] px-2.5 py-0.5 rounded-full text-xs font-black text-[#3e2723] shadow-sm">
                    ${item.cardNo}
                </span>
                <div class="w-11 h-11 -mt-1 -mr-1">
                    ${renderRarityRosetteSVG(item.rarity)}
                </div>
            </div>

            <div class="w-full h-40 my-1 flex items-center justify-center relative">
                ${renderAMaoSVG(item.decorType, !isUnlocked)}
            </div>

            <div class="mt-1">
                <div class="flex items-center justify-between gap-1.5">
                    <span class="text-base" title="${item.series}">${item.cornerIcon || '🌰'}</span>
                    <div class="amao-nameplate flex-1 py-1 px-2 text-center">
                        <span class="font-black text-base text-[#3e2723] tracking-wide">
                            ${isUnlocked ? item.name : '？？？未知阿毛'}
                        </span>
                    </div>
                    <span class="text-sm bg-[#3e2723] text-[#fdf0b6] px-1.5 py-0.5 rounded font-bold">👾</span>
                </div>

                ${showActionBtn ? `
                <div class="mt-2.5">
                    ${isUnlocked ? `
                        <button onclick="equipAMao('${item.id}')" class="w-full fluffy-btn ${isEquipped ? 'bg-green-600 text-white' : 'bg-[#f6bd60] hover:bg-amber-300 text-[#3e2723]'} text-xs font-black py-1.5">
                            ${isEquipped ? '✓ 目前穿戴在大廳' : '✨ 換上這張阿毛卡'}
                        </button>
                    ` : `
                        <button onclick="switchTab('packs')" class="w-full fluffy-btn bg-stone-300 text-stone-700 text-xs font-bold py-1.5">
                            🎴 去抽卡包解鎖
                        </button>
                    `}
                </div>
                ` : ''}
            </div>
        </div>
    `;
}