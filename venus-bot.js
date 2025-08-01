// ===== IMPORTS =====
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// ===== Local Storage =====
const DATA_FILE = './data.json';
let data = { users: {}, scores: {}, lastMessageTime: {} };

if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ===== Bot Data =====
const freeChatReplies = [
    "What's poppin' champ? 🏆",
    "Ayo, who woke me up? 😴",
    "Hehehe, you really typed that? 😂",
    "Venus is in the house! 🔥",
    "LOL you're wild for that one 💀",
    "Respectfully… nah 🤣",
    "That’s sus, bro 😏",
    "Oya, bring CODM, make we settle this 🎮",
    "Hold up… did you just say that out loud? 😳",
    "I like your vibe 😎",
    "You're actually funny... sometimes 😂",
    "Ok big brain 🧠",
    "I’m about to roast you 🔥",
    "We outsideee! 🌍",
    "Who called the boss? 👑",
    "Man's not hot 🔥🧥",
    "Say less, I got you 💪",
    "Ehn? What’s that? 🤔",
    "Omo, I dey feel you 😏",
    "Nah fam, you trippin’ 🤯",
    "GGs only ✌️",
    "Ain’t no way you just said that 😭",
    "We move 🚀",
    "Your CODM aim still trash though 🎯",
    "Mmm, interesting... 😏",
    "Cap detected 🧢",
    "Straight facts! 📢",
    "This group sweet die 😎",
    "Venus Bot stays winning 🏆",
];

// ===== Command Data =====
const jokes = [
    "Why don’t skeletons fight each other? They don’t have the guts 😂",
    "Why did the scarecrow win an award? He was outstanding in his field 🌾",
    "What do you call fake spaghetti? An im-pasta 🍝",
    "Why did the math book look sad? Too many problems 📚",
    "Why was the computer cold? It left its Windows open 💻",
    "Why don’t eggs tell jokes? They’d crack each other up 🥚",
    "Why did the football coach go to the bank? To get his quarter back 🏈",
    "Why can’t your nose be 12 inches long? It’d be a foot 👃",
    "What did one wall say to the other? I’ll meet you at the corner 🧱",
    "Why did the bicycle fall over? It was two-tired 🚲",
    "Why don’t some couples go to the gym? Because some relationships don’t work out 💔",
    "Why did the tomato turn red? It saw the salad dressing 🥗",
    "Why did the photo go to jail? It was framed 📸",
    "What do you call cheese that isn't yours? Nacho cheese 🧀",
    "Why was the broom late? It swept in 🧹"
];

const roasts = [
    "You're proof that even evolution takes breaks sometimes 😂",
    "You bring everyone so much joy… when you leave the room 😏",
    "Your CODM aim is like Nigerian NEPA — never consistent ⚡",
    "You're like a cloud. When you disappear, it’s a beautiful day 🌤️",
    "You have something on your face… oh wait, that's just your face 😆",
    "If I had a dollar for every smart thing you said, I’d be broke 💸",
    "Your brain is like a browser… 100 tabs open, 98 frozen 🧠",
    "You have something most people don’t… bad luck 😂",
    "You bring balance to the group — by lowering the average IQ 📉",
    "If laughter is the best medicine, your face must cure the world 🤣",
    "You're living proof that mistakes can be repeated 🔄",
    "You must be a magician — every time you open your mouth, logic disappears 🎩",
    "You're like a cloud server — always down ⛅",
    "You’re like software updates — unnecessary and annoying 📲",
    "Your CODM kills are rarer than PHCN giving 24 hours light 🔌"
];

const tips = [
    "Drink water regularly 💧",
    "Take breaks while working ⏳",
    "Sleep at least 7 hours 😴",
    "Exercise for 30 minutes a day 🏃‍♂️",
    "Eat more fruits and vegetables 🍎",
    "Don’t skip breakfast 🥣",
    "Plan your day in the morning 🗓️",
    "Limit your screen time 📱",
    "Stay positive even on bad days 🌈",
    "Read at least 10 pages of a book 📖",
    "Learn a new skill every month 🛠️",
    "Spend time with family and friends ❤️",
    "Save at least 10% of your income 💰",
    "Avoid processed foods 🍔",
    "Always back up important files 💾"
];

const motivates = [
    "Believe you can and you're halfway there 💪",
    "Push yourself, because no one else will 🚀",
    "Great things never come from comfort zones 🌟",
    "Dream it. Wish it. Do it 💭",
    "Success doesn’t just find you, you find it 🏆",
    "Don’t stop until you’re proud 🙌",
    "The harder you work, the luckier you get 🍀",
    "Your limitation is only your imagination 🧠",
    "Stay positive, work hard, make it happen 🔥",
    "Doubt kills more dreams than failure ever will ❌",
    "Don’t watch the clock; do what it does — keep going ⏱️",
    "Start where you are, use what you have, do what you can 🛠️",
    "Success is the sum of small efforts repeated daily 📈",
    "Stay hungry, stay foolish 😎",
    "Work in silence, let your success make the noise 🤫"
];

const riddles = [
    { q: "What has keys but can’t open locks?", a: "piano" },
    { q: "What has hands but can’t clap?", a: "clock" },
    { q: "What has a head and a tail but no body?", a: "coin" },
    { q: "I’m tall when I’m young, and short when I’m old. What am I?", a: "candle" },
    { q: "What has one eye but can’t see?", a: "needle" },
    { q: "What gets wetter as it dries?", a: "towel" },
    { q: "What has words but never speaks?", a: "book" },
    { q: "The more of me you take, the more you leave behind. What am I?", a: "footsteps" },
    { q: "What has many teeth but can’t bite?", a: "comb" },
    { q: "What belongs to you but is used more by others?", a: "name" },
    { q: "I’m light as a feather, yet the strongest man can’t hold me. What am I?", a: "breath" },
    { q: "The more you take from me, the bigger I get. What am I?", a: "hole" },
    { q: "I’m always running but never move. What am I?", a: "river" },
    { q: "What has an ear but cannot hear?", a: "corn" },
    { q: "I’m always in front of you but can’t be seen. What am I?", a: "future" }
];

const countryGame = [
    { flag: "🇳🇬", answer: "nigeria" },
    { flag: "🇺🇸", answer: "united states" },
    { flag: "🇨🇦", answer: "canada" },
    { flag: "🇧🇷", answer: "brazil" },
    { flag: "🇫🇷", answer: "france" },
    { flag: "🇩🇪", answer: "germany" },
    { flag: "🇮🇹", answer: "italy" },
    { flag: "🇯🇵", answer: "japan" },
    { flag: "🇨🇳", answer: "china" },
    { flag: "🇲🇽", answer: "mexico" },
    { flag: "🇦🇷", answer: "argentina" },
    { flag: "🇿🇦", answer: "south africa" },
    { flag: "🇰🇪", answer: "kenya" },
    { flag: "🇬🇧", answer: "united kingdom" },
    { flag: "🇸🇦", answer: "saudi arabia" }
];

const codmQuiz = [
    { q: "What does CODM stand for?", a: "call of duty mobile" },
    { q: "Which company developed CODM?", a: "timi studios" },
    { q: "What is the max level in CODM multiplayer?", a: "400" },
    { q: "What is the name of CODM's toughest battle royale map?", a: "alcatraz" },
    { q: "Which sniper is known as the most powerful in CODM?", a: "dlq33" },
    { q: "Which class lets you heal faster in BR?", a: "medic" },
    { q: "What is the highest rank in CODM multiplayer?", a: "legendary" },
    { q: "Which SMG has the fastest fire rate?", a: "fennec" },
    { q: "Which scorestreak drops missiles from the sky?", a: "predator missile" },
    { q: "What is the default CODM currency called?", a: "credits" },
    { q: "Which operator skill uses a flamethrower?", a: "purifier" },
    { q: "What is the name of the CODM zombie mode map?", a: "nacht der untoten" },
    { q: "Which perk allows you to move faster?", a: "lightweight" },
    { q: "Which assault rifle is known as the 'no recoil' gun?", a: "grau" },
    { q: "Which grenade produces smoke?", a: "smoke grenade" }
];

// ===== Helper Functions =====
function addScore(userId, points) {
    if (!data.scores[userId]) data.scores[userId] = 0;
    data.scores[userId] += points;
    saveData();
}

function getLeaderboard() {
    let arr = Object.entries(data.scores).map(([id, score]) => ({
        name: data.users[id] || "Unknown",
        score
    }));
    arr.sort((a, b) => b.score - a.score);
    return arr.slice(0, 10);
}

// ===== WhatsApp Client =====
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Venus Esports Bot is ready!');
});

// ===== Your Message Handling Code (UNCHANGED) =====
client.on('message', async msg => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const userId = contact.id._serialized;
    const userName = contact.pushname || contact.number;

    const now = Date.now();
    if (data.lastMessageTime[userId] && now - data.lastMessageTime[userId] < 5000) {
        msg.reply("Chill, can't I rest for 5 seconds?😅");
        return;
    }
    data.lastMessageTime[userId] = now;
    saveData();

    data.users[userId] = userName;
    saveData();

    const text = msg.body.trim().toLowerCase();

    if (!text.startsWith("/")) {
        if (Math.random() < 0.3) {
            msg.reply(freeChatReplies[Math.floor(Math.random() * freeChatReplies.length)]);
        }
        return;
    }

    if (text === "/jokes") msg.reply(jokes.join("\n"));
    else if (text === "/roasts") msg.reply(roasts.join("\n"));
    else if (text === "/tips") msg.reply(tips.join("\n"));
    else if (text === "/motivates") msg.reply(motivates.join("\n"));

    else if (text === "/riddles") {
        let riddle = riddles[Math.floor(Math.random() * riddles.length)];
        msg.reply(`🧩 Riddle: ${riddle.q}\n(Reply with your answer)`);
        data.users[userId + "_riddle"] = riddle.a.toLowerCase();
        saveData();
    }

    else if (text === "/game") {
        let game = countryGame[Math.floor(Math.random() * countryGame.length)];
        msg.reply(`🌍 Guess the country: ${game.flag}`);
        data.users[userId + "_game"] = game.answer.toLowerCase();
        saveData();
    }

    else if (text === "/quiz") {
        let quiz = codmQuiz[Math.floor(Math.random() * codmQuiz.length)];
        msg.reply(`🎮 CODM Quiz: ${quiz.q}`);
        data.users[userId + "_quiz"] = quiz.a.toLowerCase();
        saveData();
    }

    else if (text === "/score") {
        msg.reply(`🏆 ${userName}, your score: ${data.scores[userId] || 0}`);
    }

    else if (text === "/leaderboard") {
        let board = getLeaderboard().map((u, i) => `${i + 1}. ${u.name} - ${u.score} pts`).join("\n");
        msg.reply(`🏆 Leaderboard:\n${board}`);
    }

    else if (text.startsWith("/broadcast") && chat.isGroup && msg.fromMe) {
        let message = msg.body.split(" ").slice(1).join(" ");
        chat.sendMessage(`📢 Broadcast:\n${message}`);
    }

    else if (text === "/resetleaderboard" && msg.fromMe) {
        data.scores = {};
        saveData();
        msg.reply("✅ Leaderboard reset!");
    }

    else {
        if (data.users[userId + "_riddle"] && text === data.users[userId + "_riddle"]) {
            msg.reply("✅ Correct! +10 points");
            addScore(userId, 10);
            delete data.users[userId + "_riddle"];
            saveData();
        }
        if (data.users[userId + "_game"] && text === data.users[userId + "_game"]) {
            msg.reply("✅ Correct! +10 points");
            addScore(userId, 10);
            delete data.users[userId + "_game"];
            saveData();
        }
        if (data.users[userId + "_quiz"] && text === data.users[userId + "_quiz"]) {
            msg.reply("✅ Correct! +10 points");
            addScore(userId, 10);
            delete data.users[userId + "_quiz"];
            saveData();
        }
    }
});

client.initialize();