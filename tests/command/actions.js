export class Actions {
  constructor(page) {
    this.page = page;
  }

  async LAUNCH(url) {
    await this.page.goto(url);

  }

  async INPUT(locator, value) {
    await this.page.locator(locator).fill(value);

  }

  async CLICK(locator) {
    const element = this.page.locator(locator);
    await element.waitFor({ state: "visible", timeout: 10000 });
    await element.click();

  }

  async ASSERT(locator, value) {
    const element = this.page.locator(locator);
    await element.waitFor({ state: "visible", timeout: 10000 });
    await element.textContent();

  }

  async UPLOAD(locator, filePath) {
    await this.page.locator(locator).setInputFiles(filePath);

  }

  async RADIO_SELECT(locator, value) {
    const radioLocator = locator.replace("${value}", value);
    await this.page.locator(radioLocator).click();

  }

  async DROPDOWN_SELECT(locator, value, optionLocatorTemplate) {
    await this.page.locator(locator).click();
    const optionLocator = optionLocatorTemplate.replace("${value}", value);
    await this.page.locator(optionLocator).click();

  }

}
 