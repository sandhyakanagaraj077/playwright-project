import { expect } from "@playwright/test";
import loginLocators from "../locators/loginLocators.json";
import adminLocators from "../locators/adminLocators.json";
import pimLocators from "../locators/pimLocators.json";
import myInfoLocators from "../locators/myInfoLocators.json";
import testData from "../testData/testData.json";
export class OrangeHRMPage {
  constructor(page) {
    this.page = page;
    this.testData = testData;
    this.locators = {
      ...loginLocators,
      ...adminLocators,
      ...pimLocators,
      ...myInfoLocators

    };

  }

  async executeStep(step) {
    const action = step.action.toUpperCase();
    const locatorValue = step.locator ? this.locators[step.locator] : null;
    let dataValue = null;
    if (step.data) {
      dataValue =
        this.testData[step.data] !== undefined
          ? this.testData[step.data]
          : step.data;

    }
    // Random Employee ID

    if (dataValue === "EmpID") {
      dataValue = Math.floor(1000 + Math.random() * 9000).toString();
      
    }
    switch (action) {
      case "LAUNCH":
        await this.page.goto(dataValue);
        break;
      case "INPUT":
        await this.page.locator(locatorValue).fill(dataValue);
        break;
      case "CLICK":
        await this.page.locator(locatorValue).click();
        break;
      case "ASSERT":
        await expect(this.page.locator(locatorValue)).toContainText(dataValue);
        break;
      case "UPLOAD":
        await this.page.locator(locatorValue).setInputFiles(dataValue);
        break;
      case "RADIO_SELECT":
        const radioLocator = locatorValue.replace("${value}", dataValue);
        await this.page.locator(radioLocator).click();
        break;
      case "DROPDOWN_SELECT":
        await this.page.locator(locatorValue).click();
        const optionTemplate = this.locators[step.optionLocator];
        const optionLocator = optionTemplate.replace("${value}", dataValue);
        await this.page.locator(optionLocator).click();
        break;
      default:
        throw new Error(`Unknown action: ${action}`);

    }

  }

}
 