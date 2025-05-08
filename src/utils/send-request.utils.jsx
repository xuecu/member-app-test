const apiUrl =
	'https://script.google.com/macros/s/AKfycbyOP8PgufP0ITKrrAqH47xQ1606OxG4KhPUWkG1WhE5e9DsGWOqp-qYH4HY4yYK0RU/exec';

async function SendRequest(data) {
	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}, 連接GAS失敗`);

		const result = await response.json();
		return result;
	} catch (error) {
		console.error('錯誤:', error);
		return { success: false, message: error.message };
	}
}

export default SendRequest;
