const TELEGRAM_API_BASE = 'https://api.telegram.org';

const buildPaymentSuccessMessage = ({ userName, amount, currency }) => {
	const lines = [
		'Payment successful',
		`Customer: ${userName}`,
		`Amount: ${amount || 0} ${currency}`,
		`Paid at: ${new Date().toISOString()}`
	];

	return lines.join('\n');
};

const sendTelegramMessage = async (message) => {
	const botToken = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TELEGRAM_CHAT_ID;

	if (!botToken || !chatId) {
		return {
			success: false,
			skipped: true,
			message: 'Telegram failed needs botToken and chatId bro'
		};
	}

	const endpoint = `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`;

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			chat_id: chatId,
			text: message
		})
	});

	const rawBody = await response.text();
	let data;

	try {
		data = JSON.parse(rawBody);
	} catch (error) {
		throw new Error(`Telegram returned non-JSON response: ${rawBody}`);
	}

	if (!response.ok || !data.ok) {
		throw new Error(data.description || 'Failed hz bro');
	}

	return {
		success: true,
		telegramMessageId: data.result?.message_id
	};
};

const sendPaymentSuccessAlert = async ({ userName, amount, currency }) => {
	const message = buildPaymentSuccessMessage({ userName, amount, currency });
	return sendTelegramMessage(message);
};

module.exports = {
	sendTelegramMessage,
	sendPaymentSuccessAlert
};