/* ============================================================================
 * 🟢 [熱區 1] 【✨ 最初的 67】卡包配比與序號架構 (001~067)
 * 以後要新增「爸爸、媽媽、小明 (002~030)」或「捷運出遊卡 (054~063)」，只改這個檔案！
 * ============================================================================ */

const PACK_TIER_SPEC = {
    UR:  { rarity: "UR",  totalSlots: 1,  range: [67, 67], rangeStr: "067",     tierRate: 1.49,  label: "👑 UR 卡包主題迷因", desc: "左右手上下擺動 67 迷因阿毛" },
    SSR: { rarity: "SSR", totalSlots: 3,  range: [64, 66], rangeStr: "064~066", tierRate: 4.48,  label: "🌟 SSR 超稀有裝扮", desc: "極稀有特殊裝扮與出遊大獎" },
    SR:  { rarity: "SR",  totalSlots: 10, range: [54, 63], rangeStr: "054~063", tierRate: 14.93, label: "✨ SR 特殊與捷運出遊", desc: "特殊裝扮與假日捷運出遊系列" },
    R:   { rarity: "R",   totalSlots: 23, range: [31, 53], rangeStr: "031~053", tierRate: 34.33, label: "⚔️ R 副本 Boss 系列", desc: "三大副本 Boss 與關卡守門員" },
    N:   { rarity: "N",   totalSlots: 30, range: [1, 30],  rangeStr: "001~030", tierRate: 44.77, label: "📘 N 習作題目人物", desc: "No.001原始阿毛 & 爸媽/兄妹/小明等題目角色" }
};

const DECOR_DEX = [
    // ================= [N 階：001~030 習作題目人物，目前實裝 No.001] =================
    {
        id: "amao_base", idx: 0, slotNo: 1, cardNo: "No.001", name: "原始阿毛", series: "N 題目人物系列", rarity: "N",
        desc: "【No.001 初始夥伴】最純粹軟綿綿的毛茸茸阿毛！（002~030 將隨習作題目陸續解鎖爸爸、媽媽、哥哥、妹妹、小明等角色！）",
        decorType: "base", pose: "calm", cornerIcon: "📘"
    },

    // ================= [R 階：031~053 副本 Boss 與關卡挑戰系列] =================
    {
        id: "amao_pk_mushroom", idx: 1, slotNo: 31, cardNo: "No.031", name: "毒蘑菇 Boss 阿毛", series: "R 副本 Boss 系列", rarity: "R",
        desc: "【雷射除草機副本 Boss】頭上長出紅底白點大毒菇、背著森林綠葉斜背包的除草大魔王！",
        decorType: "mushroom_bag", pose: "calm_sweat", cornerIcon: "🍄"
    },
    {
        id: "amao_sc_chef", idx: 2, slotNo: 32, cardNo: "No.032", name: "拉麵大釜 Boss 阿毛", series: "R 副本 Boss 系列", rarity: "R",
        desc: "【暴走拉麵大釜副本 Boss】綁著必勝頭巾、掌管乘法分配律巨無霸拉麵鍋的料理長阿毛！",
        decorType: "chef", pose: "cheer_left", cornerIcon: "🍜"
    },
    {
        id: "amao_hw_pumpkin", idx: 3, slotNo: 33, cardNo: "No.033", name: "萬聖南瓜 Boss 阿毛", series: "R 副本 Boss 系列", rarity: "R",
        desc: "【萬聖節躲貓貓副本 Boss】頭戴壞笑傑克南瓜帽、披著蝙蝠披風把糖果藏起來的搗蛋鬼！",
        decorType: "pumpkin_cape", pose: "cheer_left", cornerIcon: "🎃"
    },
    {
        id: "amao_hw_mummy", idx: 4, slotNo: 34, cardNo: "No.034", name: "木乃伊守衛阿毛", series: "R 副本 Boss 系列", rarity: "R",
        desc: "【副本小 Boss】用掉整捲衛生紙把自己纏成木乃伊的迷宮守衛阿毛！",
        decorType: "mummy", pose: "calm_sweat", cornerIcon: "🧻"
    },
    {
        id: "amao_pk_acorn", idx: 5, slotNo: 35, cardNo: "No.035", name: "橡實森林隊長阿毛", series: "R 副本 Boss 系列", rarity: "R",
        desc: "【副本小 Boss】把大橡實殼當成鋼盔戴在頭上的森林巡邏隊長！",
        decorType: "acorn", pose: "calm", cornerIcon: "🌰"
    },

    // ================= [SR 階：054~063 特殊裝扮 & 未來捷運出遊系列] =================
    {
        id: "amao_hw_witch", idx: 6, slotNo: 54, cardNo: "No.054", name: "星光魔女特裝阿毛", series: "SR 特殊與出遊系列", rarity: "SR",
        desc: "【特殊裝扮】戴著鑲有金星的紫色魔女尖帽，準備騎掃帚去星空探險！",
        decorType: "witch", pose: "cheer_left", cornerIcon: "⭐"
    },
    {
        id: "amao_sc_wizard", idx: 7, slotNo: 55, cardNo: "No.055", name: "雷射護目鏡特裝阿毛", series: "SR 特殊與出遊系列", rarity: "SR",
        desc: "【特殊裝扮】戴著高科技量角器雷達護目鏡，假日搭捷運出遊也能精準導航！",
        decorType: "goggles", pose: "yaha_both", cornerIcon: "🚇"
    },

    // ================= [SSR 階：064~066 超稀有傳奇裝扮] =================
    {
        id: "amao_pk_fourleaf", idx: 8, slotNo: 64, cardNo: "No.064", name: "雙重幸運草阿毛", series: "SSR 傳奇裝扮系列", rarity: "SSR",
        desc: "【SSR 超稀有】頭頂長出傳說中的四葉幸運草髮箍，開心地舉起雙手大喊「Yaha!」",
        decorType: "clover_yaha", pose: "yaha_both", cornerIcon: "🍀"
    },
    {
        id: "amao_hw_devil", idx: 9, slotNo: 65, cardNo: "No.065", name: "深淵小惡魔阿毛", series: "SSR 傳奇裝扮系列", rarity: "SSR",
        desc: "【SSR 超稀有】長出紫黑色小惡魔彎角與翅膀、手持三叉戟的傳奇大魔王阿毛！",
        decorType: "devil", pose: "yaha_both", cornerIcon: "🔱"
    },

    // ================= [UR 階：067 卡包壓軸主題「迷因 67 阿毛」] =================
    {
        id: "amao_ur_meme67", idx: 10, slotNo: 67, cardNo: "No.067", name: "迷因 67 阿毛", series: "UR 最初的67主題卡", rarity: "UR",
        desc: "【👑 最初的 67 壓軸 UR】戴著潮流太陽眼鏡，左右手不斷上下交替擺動比出「6 ～ 7 ～」傳說手勢的迷因之王阿毛！",
        decorType: "meme_67", pose: "meme_67", cornerIcon: "6️⃣7️⃣"
    }
];

function getCardEffectiveRate(card) {
    const tier = PACK_TIER_SPEC[card.rarity];
    const activeInTier = DECOR_DEX.filter(d => d.rarity === card.rarity).length || 1;
    return +(tier.tierRate / activeInTier).toFixed(2);
}