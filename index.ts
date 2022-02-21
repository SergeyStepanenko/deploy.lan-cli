import puppeteer from 'puppeteer'
import dotenv from 'dotenv'

dotenv.config()
;(async () => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	try {
		await page.goto('http://deploy.lan/code/uniweb')

		await login(page)

		await page.screenshot({ path: 'example.png' })
		await browser.close()
	} catch (error) {
		await browser.close()
	}
})()

async function login(page: puppeteer.Page) {
	if (!process.env.LDAP_LOGIN) {
		throw new Error('LDAP_LOGIN is not defined')
	}

	if (!process.env.LDAP_PASSWORD) {
		throw new Error('LDAP_PASSWORD is not defined')
	}

	await page.type('#login', process.env.LDAP_LOGIN)
	await page.type('#password', process.env.LDAP_PASSWORD)

	await Promise.all([
		page.click('button[type=submit]'),
		page.waitForNavigation({ waitUntil: 'networkidle2' }),
	])
}
