import puppeteer from 'puppeteer';

export module InterfaceHelpers {

	/**
	 * Clears a regular input's value and types a new one.
	 * @param elementHandle Handle to the input element to edit
	 * @param value Value to type in
	 */
	export async function replaceValue(page: puppeteer.Page, selector: string, value: string = '') {

		// Clear input:
		await page.$eval(selector, el => {
			(<HTMLInputElement> el).value = '';
		});

		// Type new value:
		await page.click(selector, { clickCount: 3 });
		await page.type(selector, value);
	}

	/**
	 * Clears a TMDb "Season Number" or "Episode Number" input and types in a new value.
	 *
	 * _This trick is necessary because of the JavaScript TMDb uses with its Number inputs (double inputs + display changing + data binding)._
	 *
	 * @param page
	 * @param value Value to type in the Number input
	 * @param nextInputSelector Selector to the next input. Will be used to back tab (Shift+Tab)
	 */
	export async function setNumberInputValue(page: puppeteer.Page, value: string, nextInputSelector: string) {

		// Focus on next input:
		await page.click(nextInputSelector);

		// Tab back to the Number input:
		await page.keyboard.down('Shift');
		await page.keyboard.press('Tab');
		await page.keyboard.up('Shift');

		// Delete Number input content:
		for (let i = 0 ; i < 5 ; i++) {
			await page.keyboard.press('Delete');
		}

		// Type new Number value:
		await page.keyboard.type(value);

	}

}