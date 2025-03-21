// cypress/pages/BasePage.js

class BasePage {
    // Method to navigate to a specific URL
    navigate(url) {
        cy.visit(url);
    }

    // Method to enter text into any input field
    enterText(selector, text, timeout) {
        cy.get(selector, { timeout: timeout})
        .should('be.visible')
        .clear()
        .type(text)
    }

    // Method to click any button
    clickButton(selector, timeout) {
        cy.get(selector, { timeout: timeout})
        .should('be.visible')
        .and('not.be.disabled')
        .click()
    }

    // Method to get the text of an element
    getText(selector) {
        return cy.get(selector).invoke('text')
    }

    // Method to verify that an element contains specific text
    // shouldContainText(selector, text) {
    //     cy.get(selector).should('contain.text', text)
    // }   
}

module.exports = BasePage