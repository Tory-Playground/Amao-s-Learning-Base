/* ============================================================================
 * 🟢 [熱區 2] 小四 (4) 與 小六 (6) 雙年級題庫資料層
 * 以後要擴充「英文日常問答」或「三大副本題目」，只改這個檔案！
 * ============================================================================ */

// 1. 大廳阿毛英文問答題庫 (依年級分流)
const DIALOGUES_BY_GRADE = {
    4: [
        {
            id: "g4_d1",
            sound: "🔊「嗚啦～肚子咕嚕咕嚕叫！」",
            en: `"I am so hungry! What can I eat?"`,
            zh: "(我好餓喔！我可以吃什麼呢？)",
            options: [
                { text: "A yummy pudding! 🍮", correct: true },
                { text: "A blue chair! 🪑", correct: false }
            ]
        },
        {
            id: "g4_d2",
            sound: "🔊「Yaha！！看我的量角器！」",
            en: `"A right angle is 90 degrees. How about an acute angle (銳角)?"`,
            zh: "(直角是 90 度，那「銳角」是幾度呢？)",
            options: [
                { text: "Smaller than 90° (<90°)", correct: true },
                { text: "Bigger than 90° (>90°)", correct: false }
            ]
        },
        {
            id: "g4_d3",
            sound: "🔊「嗚啦？我的萬聖節南瓜呢？」",
            en: `"Where is my pumpkin hat?"`,
            zh: "(我的南瓜帽在哪裡呢？)",
            options: [
                { text: "It is ON your head! 🎃", correct: true },
                { text: "It is fifty dollars! 💵", correct: false }
            ]
        },
        {
            id: "g4_d4",
            sound: "🔊「Yaha～我們去拔草吧！」",
            en: `"What time is it now?"`,
            zh: "(現在幾點了呢？)",
            options: [
                { text: "It's Adventure Time! ⏰", correct: true },
                { text: "I like apples! 🍎", correct: false }
            ]
        }
    ],
    6: [
        {
            id: "g6_d1",
            sound: "🔊「Yaha！！上週末超好玩！」",
            en: `"What did you do last weekend?"`,
            zh: "(小六過去式：你上週末去做了什麼呢？)",
            options: [
                { text: "I played games with A-Mao! 🎮", correct: true },
                { text: "I will go tomorrow! 🚀", correct: false }
            ]
        },
        {
            id: "g6_d2",
            sound: "🔊「嗚啦～看我的拉麵食譜！」",
            en: `"How can I get to the Ramen Shop?"`,
            zh: "(小六問路句型：我要怎麼去拉麵店呢？)",
            options: [
                { text: "Go straight and turn right! 🍜", correct: true },
                { text: "Yes, it is very yummy! 😋", correct: false }
            ]
        },
        {
            id: "g6_d3",
            sound: "🔊「Yaha！秋天吹風好舒服～」",
            en: `"Why are you wearing a warm cape?"`,
            zh: "(小六因果問句：你為什麼穿著保暖披風呢？)",
            options: [
                { text: "Because it is windy outside! 🍂", correct: true },
                { text: "It is under the table! 🪑", correct: false }
            ]
        },
        {
            id: "g6_d4",
            sound: "🔊「嗚啦！平角是 180 度！」",
            en: `"A straight angle is 180°. If one part is 110°, what is the other?"`,
            zh: "(平角 180 度，扣掉 110 度還剩幾度呢？)",
            options: [
                { text: "It is 70 degrees (70°)! 📐", correct: true },
                { text: "It is 90 degrees (90°)! 📏", correct: false }
            ]
        }
    ]
};

// 2. 副本一：雷射除草機（角度題庫）
const ANGLE_STAGES_BY_GRADE = {
    4: [
        { target: 60, prompt: "搗蛋毒蘑菇在 <span class='text-[#f6bd60] text-2xl'>60°</span> 位置！", hint: "小於 90° 的角叫做「銳角」喔！" },
        { target: 135, prompt: "搗蛋毒蘑菇在 <span class='text-[#f6bd60] text-2xl'>135°</span> 位置！", hint: "90° 加 45° 等於 135°，這是一個「鈍角」！" },
        { target: 90, prompt: "搗蛋毒蘑菇在 <span class='text-[#f6bd60] text-2xl'>90°</span> 正上方！", hint: "正上方垂直的角叫做「直角」！" }
    ],
    6: [
        { target: 60, prompt: "平角 180° 減去左側補角 <span class='text-[#f6bd60] text-xl'>120°</span>，毒蘑菇在幾度？", hint: "小六角度推理：180° - 120° = 60°！" },
        { target: 135, prompt: "直角 90° 加上半個直角 <span class='text-[#f6bd60] text-xl'>45°</span>，毒蘑菇在幾度？", hint: "小六複合角計算：90° + 45° = 135°！" },
        { target: 150, prompt: "平角 180° 減去銳角 <span class='text-[#f6bd60] text-xl'>30°</span>，毒蘑菇在幾度？", hint: "小六角度推理：180° - 30° = 150°！" }
    ]
};

// 3. 副本二：暴走拉麵大釜（乘除與分配律目標克數）
const ALCHEMY_STAGES_BY_GRADE = {
    4: [{ target: 400 }, { target: 310 }, { target: 520 }],
    6: [{ target: 650 }, { target: 490 }, { target: 780 }]
};

// 4. 副本三：萬聖節糖果躲貓貓（英文空間介系詞題庫）
const ENG_STAGES_BY_GRADE = {
    4: [
        {
            sentence: `The Halloween candy is <span class="underline text-orange-600">under</span> the <span class="underline text-orange-600">bed</span>!`,
            correctIndex: 1,
            options: [
                { label: "ON the bed", icon: "🛏️⬆️" },
                { label: "UNDER the bed", icon: "🛏️⬇️" },
                { label: "IN the box", icon: "📦" }
            ]
        },
        {
            sentence: `A-Mao's pumpkin is <span class="underline text-orange-600">next to</span> the <span class="underline text-orange-600">chair</span>!`,
            correctIndex: 2,
            options: [
                { label: "UNDER the desk", icon: "🪑⬇️" },
                { label: "IN the bag", icon: "🎒" },
                { label: "NEXT TO the chair", icon: "🪑➡️" }
            ]
        },
        {
            sentence: `The pudding is hiding <span class="underline text-orange-600">in</span> the <span class="underline text-orange-600">box</span>!`,
            correctIndex: 0,
            options: [
                { label: "IN the box", icon: "📦" },
                { label: "ON the table", icon: "🍽️⬆️" },
                { label: "UNDER the chair", icon: "🪑⬇️" }
            ]
        }
    ],
    6: [
        {
            sentence: `The golden acorn is hidden <span class="underline text-orange-600">between</span> the <span class="underline text-orange-600">sofa and the lamp</span>!`,
            correctIndex: 0,
            options: [
                { label: "BETWEEN sofa & lamp", icon: "🛋️🍬💡" },
                { label: "BEHIND the sofa", icon: "🛋️👀" },
                { label: "UNDER the lamp", icon: "💡⬇️" }
            ]
        },
        {
            sentence: `Look! The magic book is floating <span class="underline text-orange-600">above</span> the <span class="underline text-orange-600">bookshelf</span>!`,
            correctIndex: 1,
            options: [
                { label: "IN FRONT OF the door", icon: "🚪⬆️" },
                { label: "ABOVE the bookshelf", icon: "✨📖📚" },
                { label: "UNDER the carpet", icon: "🧶⬇️" }
            ]
        },
        {
            sentence: `A-Mao is hiding <span class="underline text-orange-600">behind</span> the <span class="underline text-orange-600">curtain</span>!`,
            correctIndex: 2,
            options: [
                { label: "NEXT TO the window", icon: "🪟➡️" },
                { label: "ON the sofa", icon: "🛋️⬆️" },
                { label: "BEHIND the curtain", icon: "🪟🐰👀" }
            ]
        }
    ]
};