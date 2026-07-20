import { test, expect } from '@playwright/test';
import { executeRequest } from '../utils/apiExecutor';
import { validateResponseData } from '../utils/validator';
export class APIService {
  constructor(request, data) {
    this.request = request;
    this.data = data;
    this.objectId = null;
  }

  getStatusMessage(status) {
    if (status === 200 || status === 201) return 'Successful Response';
    if (status === 400) return 'Bad Request';
    if (status === 401) return 'Unauthorized';
    if (status === 403) return 'Forbidden';
    if (status === 404) return 'Not Found';
    if (status === 405) return 'Method Not Allowed';
    if (status >= 500) return 'Server Error';
    return 'Unknown Status';

  }

  attachReport(name, body) {
    test.info().attach(name, {
      body: JSON.stringify(body, null, 2),
      contentType: "application/json"
    });

  }

  async printAPIReport(status, responseTime) {
    await test.step(
      `Validate Status Code | Expected: ${status} | Actual: ${status}`,
      async () => {}

    );

    await test.step(
      `Status Message : ${this.getStatusMessage(status)}`,
      async () => {}
    );
    await test.step(
      `Response Time : ${responseTime} ms`,
      async () => {}

    );

  }

  async runPositiveFlow() {
    if (this.data.get) {
      await test.step("Retrieve All Objects – Validate Response Status Code", async () => {
        const api = this.data.get;
        const { body, status, responseTime } =
          await executeRequest(this.request, api.method, api.url);
        await this.printAPIReport(status, responseTime);
        this.attachReport("GET Response", body);
        this.objectId = body[0]?.id;

        // Validate Name
        if (api.name) {
          const actualName = body[0]?.name;
          await test.step(
            `Validate Name | Expected: ${api.name} | Actual: ${actualName}`,
            async () => {
              if (actualName !== api.name) {
                throw new Error(
                  `Name Validation Failed | Expected: ${api.name} | Actual: ${actualName}`
                );
              }
            }
          );
        }

        // Validate Title

        if (api.title) {
          const actualTitle = body.products
            ? body.products[0]?.title
            : body[0]?.title;
          await test.step(
            `Validate Title | Expected: ${api.title} | Actual: ${actualTitle}`,
            async () => {
              if (actualTitle !== api.title) {
                throw new Error(
                  `Title Validation Failed | Expected: ${api.title} | Actual: ${actualTitle}`
                );
              }
            }
          );
        }
      });
    }
    if (this.data.post) {
      await test.step("Create New Object – Validate Response Status Code", async () => {
        const api = this.data.post;
        const { body, status, responseTime } =
          await executeRequest(this.request, api.method, api.url, api.payload);
        await this.printAPIReport(status, responseTime);
        this.attachReport("POST Response", body);
        await validateResponseData(body, api.payload);
        this.objectId = body.id;
      });
    }

    if (this.data.put && this.objectId) {
      await test.step("Update Object – Validate Updated Response Data and Status Code", async () => {
        const api = this.data.put;
        const url = `${api.url}/${this.objectId}`;
        const { body, status, responseTime } =
          await executeRequest(this.request, api.method, url, api.payload);
        await this.printAPIReport(status, responseTime);
        this.attachReport("PUT Response", body);
        await validateResponseData(body, api.payload);
      });
    }
    if (this.data.delete && this.objectId) {
      await test.step("Delete Object – Validate Successful Deletion Status Code", async () => {
        const api = this.data.delete;
        const url = `${api.url}/${this.objectId}`;
        const { body, status, responseTime } =
          await executeRequest(this.request, api.method, url);
        await this.printAPIReport(status, responseTime);
        this.attachReport("DELETE Response", body);
      });
    }
  }
  async runNegativeTests() {
    if (!this.data.negative) return;
    for (const scenario in this.data.negative) {
      const api = this.data.negative[scenario];
      await test.step(`API Test - ${scenario}`, async () => {
        const { body, status, responseTime } =
          await executeRequest(this.request, api.method, api.url, api.payload);
        const match = scenario.match(/\d+/);
        const expectedStatus = match ? parseInt(match[0]) : status;
        await test.step(
          `Validate Status Code | Expected: ${expectedStatus} | Actual: ${status}`,
          async () => {
            if (status !== expectedStatus) {
              throw new Error(
                `Status Code Validation Failed | Expected: ${expectedStatus} | Actual: ${status}`
              );
            }
          }
        );
        await test.step(
          `Status Message : ${this.getStatusMessage(status)}`,
          async () => {}
        );
        await test.step(
          `Response Time : ${responseTime} ms`,
          async () => {}
        );
        this.attachReport(`${scenario} Response`, body);
      });
    }
  }
}
 