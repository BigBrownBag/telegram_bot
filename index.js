const TelegramApi = require('node-telegram-bot-api');
const { chats, againOptions, gameOptions } = require('./options');
const sequelize = require('./db');
const UserModel = require('./model');

const token = '5398915397:AAECroH_AxICbCJyt2euYfrZKcU-pI_NmfQ';

const bot = new TelegramApi(token, {polling: true});

const startGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Угадай число от 0 до 9', gameOptions);
};

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        console.log('db connection error')
    }

    bot.setMyCommands([
        {command: '/start', description: 'Начало работы'},
        {command: '/game', description: 'Играть'},
        {command: '/info', description: 'Информация'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                await UserModel.create({chatId})
                return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот, используйте команду /game.')
            }
            if (text === '/info') {
                const user = await UserModel.findOne({chatId});
                return bot.sendMessage(chatId, `${msg.from.first_name || ''} ${msg.from.last_name || ''} - ${user.right} | ${user.wrong}` )
            }
            if (text === '/game') {
                return startGame(chatId);
            }

            console.log(msg);
            return bot.sendMessage(chatId, 'Я тебя не понимаю');
        } catch (e) {
            return bot.sendMessage(chatId, 'Ошибочка')
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        const user = await UserModel.findOne({chatId});

        if (data === chats[chatId].toString()) {
            user.right += 1;
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал ${chats[chatId]}`, againOptions);
        } else {
            user.wrong +=1;
            await bot.sendMessage(chatId, `Неправильно ${chats[chatId]}, попробуй еще`, againOptions);
        }
        await user.save();
    });
}
start();