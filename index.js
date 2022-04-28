const TelegramApi = require('node-telegram-bot-api');
const { chats, againOptions, gameOptions } = require('./options');

const token = '5316623321:AAHA3WcSI1tLfAt-YgW1pehSWDOhwwBBN8g';

const bot = new TelegramApi(token, {polling: true});

const startGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Угадай число от 0 до 9 или дом снова сгорит', gameOptions);
};

const start = async () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начало работы'},
        {command: '/semen', description: 'Используйте если вы Семен'},
        {command: '/game', description: 'Играть'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот для Семена, если вы Семен используйте команду /semen.')
            }
            if (text === '/semen') {
                await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/6f9/bf3/6f9bf3ed-544f-37cf-b3e1-1779eccbf3d2/192/6.webp')
                return bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/6f9/bf3/6f9bf3ed-544f-37cf-b3e1-1779eccbf3d2/192/10.webp')
            }
            if (text === '/game') {
                return startGame(chatId);
            }

            console.log(msg);
            return bot.sendMessage(chatId, 'Я тебя не понимаю, еблан)');
        } catch (e) {
            return bot.sendMessage(chatId, 'Все, пизда')
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId].toString()) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `Неправильно ${chats[chatId]}, теперь ты снова погорелец`, againOptions);
        }
    });
}
start();