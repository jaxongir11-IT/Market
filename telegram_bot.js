/**
 * PRO RETAIL - Telegram Bot Server
 * Bot: Market 777 (@Market_777N1bot)
 * Token: 8850538304:AAGFHfgltTcyJuouxKG9dDsL3l4OsMf67zQ
 * Chat ID: 6543902937 (_SANGINOV_11)
 * Zero dependency - toza Node.js da ishlaydi.
 */

const https = require('https');

const BOT_TOKEN = '8850538304:AAGFHfgltTcyJuouxKG9dDsL3l4OsMf67zQ';
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;
const DEFAULT_CHAT_ID = '6543902937';

let offset = 0;

function sendTelegramApi(method, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const url = new URL(`${API_BASE}/${method}`);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ ok: false });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function sendMessage(chatId, text, keyboard = null) {
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  };

  if (keyboard) {
    payload.reply_markup = keyboard;
  }

  return sendTelegramApi('sendMessage', payload);
}

const MAIN_KEYBOARD = {
  keyboard: [
    [{ text: '📊 Bugungi Savdo Hisoboti' }, { text: '📒 Qarz Daftari (Nasiya)' }],
    [{ text: '🆔 Mening Chat ID' }, { text: '🏪 Web Kassani Ochish' }],
    [{ text: '❓ Yordam va Qo\'llanma' }]
  ],
  resize_keyboard: true
};

async function handleMessage(msg) {
  if (!msg || !msg.chat) return;

  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();
  const userName = msg.from ? (msg.from.first_name || '_SANGINOV_11') : '_SANGINOV_11';

  console.log(`[Telegram] [${new Date().toLocaleTimeString()}] ${userName} (${chatId}): ${text}`);

  if (text === '/start' || text.toLowerCase() === 'start') {
    const welcomeText = 
      `👋 <b>Assalomu alaykum, ${userName}!</b>\n\n` +
      `🏪 <b>PRO RETAIL — Kassa va Do'kon Boshqaruv Botiga xush kelibsiz!</b>\n\n` +
      `🔑 <b>Sizning Chat ID raqamingiz:</b> <code>${chatId}</code>\n\n` +
      `✅ <b>Ulanish holati:</b> Muvaffaqiyatli ulangan!\n` +
      `Kassa terminalingizdan qilingan har bir savdo cheki, nasiya va qarz to'lovlari shu chatga avtomatik kelib turadi.`;

    await sendMessage(chatId, welcomeText, MAIN_KEYBOARD);
    return;
  }

  if (text === '🆔 Mening Chat ID' || text === '/id') {
    await sendMessage(chatId, `🆔 <b>Sizning Telegram Chat ID:</b>\n\n<code>${chatId}</code>\n\n<i>Kassa sozlamalarida shu raqam ulab qo'yilgan.</i>`, MAIN_KEYBOARD);
    return;
  }

  if (text === '📊 Bugungi Savdo Hisoboti' || text === '/hisobot') {
    await sendMessage(chatId, 
      `📊 <b>Bugungi Kassa Hisoboti:</b>\n\n` +
      `🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}\n` +
      `🏪 <b>Do'kon:</b> PRO RETAIL\n\n` +
      `💡 <i>Kassada yangi savdo amalga oshirilishi bilan barcha tovarlar, narxlar va to'lov turlari avtomatik shu yerga keladi!</i>`, 
      MAIN_KEYBOARD
    );
    return;
  }

  if (text === '📒 Qarz Daftari (Nasiya)' || text === '/qarzlar') {
    await sendMessage(chatId, 
      `📒 <b>Qarz Daftari (Nasiyalar):</b>\n\n` +
      `Kassada yangi nasiya yozilganda yoki mijoz qarzini to'laganda bot darhol sizga mijoz ismi, telefon raqami va summasini xabar qiladi!`, 
      MAIN_KEYBOARD
    );
    return;
  }

  if (text === '🏪 Web Kassani Ochish' || text === '/kassa') {
    await sendMessage(chatId, 
      `🏪 <b>PRO RETAIL Web Terminal:</b>\n\n` +
      `Kassa terminalingizni brauzerda <b>index-3.html</b> yoki <b>indexm2.html</b> orqali oching.\n` +
      `Shtrix-kod skaneri, chek chiqarish va Telegram bildirishnomalari to'liq faol!`, 
      MAIN_KEYBOARD
    );
    return;
  }

  if (text === '❓ Yordam va Qo\'llanma' || text === '/help') {
    await sendMessage(chatId, 
      `📖 <b>Kassa Boti Qo'llanmasi:</b>\n\n` +
      `1. <b>Sizning Chat ID:</b> <code>${chatId}</code>\n` +
      `2. Kassa dasturidagi Telegram tugmasi orqali sozlamalarni ko'rishingiz mumkin.\n` +
      `3. Savdo amalga oshganda bot sizga tovarlar ro'yxati va tushgan pulni yuboradi.\n` +
      `4. Savollar bo'lsa administratorga murojaat qiling.`, 
      MAIN_KEYBOARD
    );
    return;
  }

  await sendMessage(chatId, 
    `Sizning Chat ID: <code>${chatId}</code>\n\nPastdagi menyu tugmalaridan birini tanlang yoki /start bosing.`, 
    MAIN_KEYBOARD
  );
}

async function startPolling() {
  console.log('====================================================');
  console.log('🤖 PRO RETAIL Telegram Boti ishga tushirildi!');
  console.log('Bot: Market 777 (@Market_777N1bot)');
  console.log(`Ulangan foydalanuvchi Chat ID: ${DEFAULT_CHAT_ID}`);
  console.log('====================================================\n');

  while (true) {
    try {
      const res = await sendTelegramApi('getUpdates', {
        offset: offset,
        timeout: 25
      });

      if (res && res.ok && Array.isArray(res.result)) {
        for (const update of res.result) {
          offset = update.update_id + 1;
          if (update.message) {
            await handleMessage(update.message);
          }
        }
      }
    } catch (err) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

startPolling();
