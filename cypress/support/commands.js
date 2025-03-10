/// <reference types="cypress" />

Cypress.Commands.add('apiGetToken', (url) => {
    // Define the API endpoint URL and any required headers
    cy.request({
        method: 'GET',
        url: 'https://example.com/api/token', // Replace with your server's API endpoint
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YWxhZGRpbjpvcGVuc2VzYW1l' // Replace with appropriate credentials if needed
        }
    }).then((response) => {
        // Verify the response status and structure
        expect(response.status).to.eq(200); // Check that the response status is 200 OK
        expect(response.body).to.have.property('token'); // Assuming the token is in the response body

        // Store the token for further requests or tests
        const token = response.body.token;
        cy.log('Token retrieved: ', token);

        // Use the token in further tests, if needed
    });
})

