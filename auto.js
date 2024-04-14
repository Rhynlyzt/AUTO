const fs = require('fs');
const path = require('path');
const login = require('./fb-chat-api/index');
const express = require('express');
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const axios = require('axios');
const script = path.join(__dirname, 'script');
const moment = require("moment-timezone");
const cron = require('node-cron');
const config = fs.existsSync('./data') && fs.existsSync('./data/config.json') ? JSON.parse(fs.readFileSync('./data/config.json', 'utf8')) : creatqeConfig();
const Utils = new Object({
        commands: new Map(),
        handleEvent: new Map(),
        account: new Map(),
        cooldowns: new Map(),
});
fs.readdirSync(script).forEach((file) => {
        const scripts = path.join(script, file);
        const stats = fs.statSync(scripts);
        if (stats.isDirectory()) {
                fs.readdirSync(scripts).forEach((file) => {
                        try {
                                const {
                                        config,
                                        run,
                                        handleEvent
                                } = require(path.join(scripts, file));
                                if (config) {
                                        const {
                                                name = [], role = '0', version = '1.0.0', hasPrefix = true, aliases = [], description = '', usage = '', credits = '', cooldown = '5'
                                        } = Object.fromEntries(Object.entries(config).map(([key, value]) => [key.toLowerCase(), value]));
                                        aliases.push(name);
                                        if (run) {
                                                Utils.commands.set(aliases, {
                                                        name,
                                                        role,
                                                        run,
                                                        aliases,
                                                        description,
                                                        usage,
                                                        version,
                                                        hasPrefix: config.hasPrefix,
                                                        credits,
                                                        cooldown
                                                });
                                        }
                                        if (handleEvent) {
                                                Utils.handleEvent.set(aliases, {
                                                        name,
                                                        handleEvent,
                                                        role,
                                                        description,
                                                        usage,
                                                        version,
                                                        hasPrefix: config.hasPrefix,
                                                        credits,
                                                        cooldown
                                                });
                                        }
                                }
                        } catch (error) {
                                console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
                        }
                });
        } else {
                try {
                        const {
                                config,
                                run,
                                handleEvent
                        } = require(scripts);
                        if (config) {
                                const {
                                        name = [], role = '0', version = '1.0.0', hasPrefix = true, aliases = [], description = '', usage = '', credits = '', cooldown = '5'
                                } = Object.fromEntries(Object.entries(config).map(([key, value]) => [key.toLowerCase(), value]));
                                aliases.push(name);
                                if (run) {
                                        Utils.commands.set(aliases, {
                                                name,
                                                role,
                                                run,
                                                aliases,
                                                description,
                                                usage,
                                                version,
                                                hasPrefix: config.hasPrefix,
                                                credits,
                                                cooldown
                                        });
                                }
                                if (handleEvent) {
                                        Utils.handleEvent.set(aliases, {
                                                name,
                                                handleEvent,
                                                role,
                                                description,
                                                usage,
                                                version,
                                                hasPrefix: config.hasPrefix,
                                                credits,
                                                cooldown
                                        });
                                }
                        }
                } catch (error) {
                        console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
                }
        }
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json());
const routes = [{
        path: '/',
        file: 'index.html'
}, {
        path: '/step_by_step_guide',
        file: 'guide.html'
}, {
        path: '/online_user',
        file: 'online.html'
},{
  path: '/contact',
        file: 'contact.html'
},{
        path: '/random_shoti',
        file: 'shoti.html'
}, {
        path: '/analog',
        file: 'analog.html'
}, {
        path: '/clock',
        file: 'clock.html'
},{
  path: '/time',
        file: 'crazy.html'
},{
        path: '/developer',
        file: 'developer.html'
},{
        path: '/random',
        file: 'random.html'
}, ];
routes.forEach(route => {
        app.get(route.path, (req, res) => {
                res.sendFile(path.join(__dirname, 'public', route.file));
        });
});
app.get('/info', (req, res) => {
        const data = Array.from(Utils.account.values()).map(account => ({
                name: account.name,
                profileUrl: account.profileUrl,
                thumbSrc: account.thumbSrc,
                time: account.time
        }));
        res.json(JSON.parse(JSON.stringify(data, null, 2)));
});
app.get('/commands', (req, res) => {
        const command = new Set();
        const commands = [...Utils.commands.values()].map(({
                name
        }) => (command.add(name), name));
        const handleEvent = [...Utils.handleEvent.values()].map(({
                name
        }) => command.has(name) ? null : (command.add(name), name)).filter(Boolean);
        const role = [...Utils.commands.values()].map(({
                role
        }) => (command.add(role), role));
        const aliases = [...Utils.commands.values()].map(({
                aliases
        }) => (command.add(aliases), aliases));
        res.json(JSON.parse(JSON.stringify({
                commands,
                handleEvent,
                role,
                aliases
        }, null, 2)));
});
app.post('/login', async (req, res) => {
        const {
                state,
                commands,
                prefix,
                admin
        } = req.body;
        try {
                if (!state) {
                        throw new Error('Missing app state data');
                }
                const cUser = state.find(item => item.key === 'c_user');
                if (cUser) {
                        const existingUser = Utils.account.get(cUser.value);
                        if (existingUser) {
                                console.log(`User ${cUser.value} is already logged in`);
                                return res.status(400).json({
                                        error: false,
                                        message: "Active user session detected; already logged in",
                                        user: existingUser
                                });
                        } else {
                                try {
                                        await accountLogin(state, commands, prefix, [admin]);
                                        res.status(200).json({
                                                success: true,
                                                message: 'Authentication process completed successfully; login achieved.'
                                        });
                                } catch (error) {
                                        console.error(error);
                                        res.status(400).json({
                                                error: true,
                                                message: error.message
                                        });
                                }
                        }
                } else {
                        return res.status(400).json({
                                error: true,
                                message: "There's an issue with the appstate data; it's invalid."
                        });
                }
        } catch (error) {
                return res.status(400).json({
                        error: true,
                        message: "There's an issue with the appstate data; it's invalid."
                });
        }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
        console.log(`CONNECTED AUTOBOT BY VINCENT MAGTOLIS DEV${port}`);
});
process.on('unhandledRejection', (reason) => {
        console.error('Unhandled Promise Rejection:', reason);
});
async function accountLogin(state, enableCommands = [], prefix, admin = []) {
        return new Promise((resolve, reject) => {
                login({
                        appState: state
                }, async (error, api) => {
                        if (error) {
                                reject(error);
                                return;
                        }
                        const userid = await api.getCurrentUserID();
                        addThisUser(userid, enableCommands, state, prefix, admin);
                        try {
                                const userInfo = await api.getUserInfo(userid);
                                if (!userInfo || !userInfo[userid]?.name || !userInfo[userid]?.profileUrl || !userInfo[userid]?.thumbSrc) throw new Error('Unable to locate the account; it appears to be in a suspended or locked state.');
                                const {
                                        name,
                                        profileUrl,
                                        thumbSrc
                                } = userInfo[userid];
                                let time = (JSON.parse(fs.readFileSync('./data/history.json', 'utf-8')).find(user => user.userid === userid) || {}).time || 0;
                                Utils.account.set(userid, {
                                        name,
                                        profileUrl,
                                        thumbSrc,
                                        time: time
                                });
                                const intervalId = setInterval(() => {
                                        try {
                                                const account = Utils.account.get(userid);
                                                if (!account) throw new Error('Account not found');
                                                Utils.account.set(userid, {
                                                        ...account,
                                                        time: account.time + 1
                                                });
                                        } catch (error) {
                                                clearInterval(intervalId);
                                                return;
                                        }
                                }, 1000);
                        } catch (error) {
                                reject(error);
                                return;
                        }
                        api.setOptions({
                                listenEvents: config[0].fcaOption.listenEvents,
                                logLevel: config[0].fcaOption.logLevel,
                                updatePresence: config[0].fcaOption.updatePresence,
                                selfListen: config[0].fcaOption.selfListen,
                                forceLogin: config[0].fcaOption.forceLogin,
                                online: config[0].fcaOption.online,
                                autoMarkDelivery: config[0].fcaOption.autoMarkDelivery,
                                autoMarkRead: config[0].fcaOption.autoMarkRead,
                        });
                        try {
                                var listenEmitter = api.listenMqtt(async (error, event) => {
                                        if (error) {
                                                if (error === 'Connection closed.') {
                                                        console.error(`Error during API listen: ${error}`, userid);
                                                }
                                                console.log(error)
                                        }
                                        let database = fs.existsSync('./data/database.json') ? JSON.parse(fs.readFileSync('./data/database.json', 'utf8')) : createDatabase();
                                        let data = Array.isArray(database) ? database.find(item => Object.keys(item)[0] === event?.threadID) : {};
                                        let adminIDS = data ? database : createThread(event.threadID, api);
                                        let blacklist = (JSON.parse(fs.readFileSync('./data/history.json', 'utf-8')).find(blacklist => blacklist.userid === userid) || {}).blacklist || [];
                                        let hasPrefix = (event.body && aliases((event.body || '')?.trim().toLowerCase().split(/ +/).shift())?.hasPrefix == false) ? '' : prefix;
                                        let [command, ...args] = ((event.body || '').trim().toLowerCase().startsWith(hasPrefix?.toLowerCase()) ? (event.body || '').trim().substring(hasPrefix?.length).trim().split(/\s+/).map(arg => arg.trim()) : []);
                                        if (hasPrefix && aliases(command)?.hasPrefix === false) {
                                                api.sendMessage(`Invalid usage this command doesn't need a prefix`, event.threadID, event.messageID);
                                                return;
                                        }
                                        if (event.body && aliases(command)?.name) {
                                                const role = aliases(command)?.role ?? 0;
                                                const isAdmin = config?.[0]?.masterKey?.admin?.includes(event.senderID) || admin.includes(event.senderID);
                                                const isThreadAdmin = isAdmin || ((Array.isArray(adminIDS) ? adminIDS.find(admin => Object.keys(admin)[0] === event.threadID) : {})?.[event.threadID] || []).some(admin => admin.id === event.senderID);
                                                if ((role == 1 && !isAdmin) || (role == 2 && !isThreadAdmin) || (role == 3 && !config?.[0]?.masterKey?.admin?.includes(event.senderID))) {
                                                        api.sendMessage(`You don't have permission to use this command.`, event.threadID, event.messageID);
                                                        return;
                                                }
                                        }
                                        if (event.body && event.body?.toLowerCase().startsWith(prefix.toLowerCase()) && aliases(command)?.name) {
                                                if (blacklist.includes(event.senderID)) {
                                                        api.sendMessage("We're sorry, but you've been banned from using bot. If you believe this is a mistake or would like to appeal, please contact one of the bot admins for further assistance.", event.threadID, event.messageID);
                                                        return;
                                                }
                                        }
                                        if (event.body !== null) {
                                                // Check if the message type is log:subscribe
                                                if (event.logMessageType === "log:subscribe") {
                                                        const request = require("request");
                                                        const moment = require("moment-timezone");
                                                        var thu = moment.tz('Asia/Manila').format('dddd');
                                                        if (thu == 'Sunday') thu = 'Sunday'
                                                        if (thu == 'Monday') thu = 'Monday'
                                                        if (thu == 'Tuesday') thu = 'Tuesday'
                                                        if (thu == 'Wednesday') thu = 'Wednesday'
                                                        if (thu == "Thursday") thu = 'Thursday'
                                                        if (thu == 'Friday') thu = 'Friday'
                                                        if (thu == 'Saturday') thu = 'Saturday'
                                                        const time = moment.tz("Asia/Manila").format("HH:mm:ss - DD/MM/YYYY");                                                                                
                                                        const fs = require("fs-extra");
                                                        const { threadID } = event;

                                        if (event.logMessageData.addedParticipants && Array.isArray(event.logMessageData.addedParticipants) && event.logMessageData.addedParticipants.some(i => i.userFbId == userid)) {
                                        api.changeNickname(`》 ${prefix} 《 ❃ ➠ 𝗖𝗵𝘂𝗿𝗰𝗵𝗶𝗹𝗹𝗯𝗼𝘁`, threadID, userid);

let gifUrls = [
          'https://i.imgur.com/l0cT2mf.mp4',
                'https://i.imgur.com/x1NvBkN.mp4',
                'https://i.imgur.com/D9KKg2F.mp4',
                'https://i.imgur.com/wJBbgsa.mp4',
                'https://i.imgur.com/mz1GdrL.mp4',
                'https://i.imgur.com/H3f2Re5.mp4',
                'https://i.imgur.com/gBYZHdw.mp4'
];

let randomIndex = Math.floor(Math.random() * gifUrls.length);
let gifUrl = gifUrls[randomIndex];
let gifPath = __dirname + '/cac