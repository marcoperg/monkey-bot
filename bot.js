const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config()

// MONKE ID -> 120363048885794578@g.us
const MONKEY_CHAT_IDX = process.env.MONKEY_CHAT_IDX.split(' ');
const MONKEY_LIST = ['mono', 'monkey', 'monke', 'monki'];

const client = new Client({
	    authStrategy: new LocalAuth(),
		     puppeteer: { headless: true }
});

client.on('qr', (qr) => {
	qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
	console.log('Client is ready!');
});

function checkMoneky(string) {
	for (const word of MONKEY_LIST) {
		if (string.includes(word))
			return true;
	}
	return false;
}

client.on('message_create', msg => {
	if (msg.body == '!get_id') {
		console.log(msg.from);
		msg.reply(msg.from);
	}
});

client.on('message', msg => {
	if (MONKEY_CHAT_IDX.includes(msg.from)) {
		if (msg.type == 'chat' && !checkMoneky(msg.body)) {
			msg.delete(true);
		}
	}
});

client.on('authenticated', () => {
	console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
	// Fired if session restore was unsuccessful
	console.error('AUTHENTICATION FAILURE', msg);
});

client.initialize();