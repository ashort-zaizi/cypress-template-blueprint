declare namespace Cypress {
    interface Chainable<Subject = any> {
      apiGetToken(value: string): Chainable<string>;
      cypressAxe(value: string, value: string, value: string, value: string): Chainable<string, string, string, string>;
    }
}
 