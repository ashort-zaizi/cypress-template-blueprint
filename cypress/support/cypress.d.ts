declare namespace Cypress {
    interface Chainable<Subject = any> {
      apiGetToken(): Chainable<any>;
    }
}
 