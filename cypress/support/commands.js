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

const productName = '<PRODUCT>'
Cypress.Commands.add('cypressAxe', (location, softwareVersion, url, filePath) => {
   cy.injectAxe();
   //output to table in the terminal and tests pass
   cy.checkA11y(null, null, logViolations, true)
   //Accessibility HTML Reporting
   const indicators = {
   //replace the below icons with the commented hex code.
       critical: '⛔', //&#x26D4
       serious: '🔴', //&#x1F534
       moderate: '🟠', //&#1f7e0
       minor: '🔵', //&#x1F535
   }
   function logViolations(violations) {
       terminalLog(violations)
       violations.forEach(violation => {
           const nodes = Cypress.$(violation.nodes.map(node => node.target).join(','))
           let log = {
               name: `[${indicators[violation.impact]} ${violation.impact.toUpperCase()}]`,
               consoleProps: () => violation,
               $el: nodes,
               message: `[${violation.help}](${violation.helpUrl})`
           }
           Cypress.log(log)
           violation.nodes.forEach(({ target }) => {
               Cypress.log({
                   name: 'FIXME',
                   consoleProps: () => violation,
                   $el: Cypress.$(target.join(',')),
                   message: target
               })
           })
       });
   }
   const terminalLog = (violations) => {
       cy.task('log', `\n${'TEST RESULTS'}
     \n${violations.length
           } accessibility violation${violations.length === 1 ? '' : 's'
           } ${violations.length === 1 ? 'was' : 'were'
           } detected\n`)
       const violationData = violations.map(({
           id,
           impact,
           nodes,
           help,
           helpUrl
       }) => ({
           IMPACT: `${indicators[impact]} ${impact.toUpperCase()}`,
           DETAILS: `<p><strong>RuleID: </strong>  ${id} (${help})<br><br>${nodes[0].failureSummary}</p><br><br><a href="${helpUrl}" target="_blank">More Info</a>`,
           ELEMENT: `<p>Occurances: ${nodes.length}<br><br> ${nodes.map(node => node.target).join('<br>')}</p>`,
       }))
       generateReport(violationData)
   }
   function generateTable(json) {
       // each violation found
       let cols = Object.keys(json[0]);
       //Map over columns, make headers,join into string
       let headerRow = cols
           .map(col => `<th>${col}</th>`)
           .join("");
       //map over array of json objs, for each row(obj) map over column values, return a td with the value of that object for its column
       //take that array of tds and join them, then return a row of the tds, finally joins all the rows together
       let rows = json
           .map(row => {
               let tds = cols.map(col => `<td>${row[col]}</td>`).join("");
               return `<tr>${tds}</tr>`;
           })
           .join("");
       // we build the table with the header and rows we generated
       const table = `
       <table>
           <thead>
               <tr>${headerRow}</tr>
           <thead>
           <tbody>
               ${rows}
           <tbody>
       <table>`;
       return table;
   }
   // Manages the counting of issues by a given severity
   // TODO: this needs some cleaning on the HTML report side, since we are adding an emoji to the severities(impact) the search is not optimal and too verbose
   function getTotalIssues(violations, query) {
       let count = 0;
       violations.forEach(violation => {
           if (violation.IMPACT == query) {
               count++;
           };
       })
       return count;
   }
   //
   function generateReport(violations) {
       let table = generateTable(violations);
       let day = new Date();
       let templateFile = `
<!DOCTYPE html>
<html>
   <head>
       <title>${productName} Accessibility Test Results</title>
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <style>
           @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700');
           @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');
           html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,
           address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,
           sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,
           caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,
           figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,
           audio,
           video {
               margin: 0;
               padding: 0;
               border: 0;
               font-size: 100%;
               font: inherit;
               vertical-align: baseline;
           }
           /* HTML5 display-role reset for older browsers */
           article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,
           section {
               display: block;
           }
           a {
               text-decoration: none;
               text-transform: none;
               color: #4A90E2;
           }
           body {
               line-height: 1;
               font-family: lato, Noto Color Emoji, ubuntu, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
               text-rendering: optimizeLegibility;
               -webkit-font-smoothing: antialiased;
               font-size: 19px;
               background-color: #FEFEFE;
               color: #04143A;
           }
           ol,
           ul {
               list-style: none;
           }
           blockquote,
           q {
               quotes: none;
           }
           blockquote:before,
           blockquote:after,
           q:before,
           q:after {
               content: '';
               content: none;
           }
           table {
               border-collapse: collapse;
               border-spacing: 0;
           }
           p {
               color: #15171a;
               font-size: 17;
               line-height: 31px;
           }
           strong {
               font-weight: 600;
           }
           div,
           footer {
               box-sizing: border-box;
           }
           /* Reset ends */
           /*Hero section*/
           .container {
               max-width: 1100px;
               height: auto;
               margin: 60px auto;
           }
           .hero {
               margin: 50px auto;
               position: relative;
           }
           h1.name {
               font-size: 70px;
               font-weight: 300;
               display: inline-block;
           }
           .job-title {
               vertical-align: top;
               background-color: #D9E7F8;
               color: #4A90E2;
               font-weight: 600;
               margin-top: 5px;
               margin-left: 20px;
               border-radius: 5px;
               display: inline-block;
               padding: 15px 25px;
           }
           .email {
               display: block;
               font-size: 24px;
               font-weight: 300;
               color: #81899C;
               margin-top: 10px;
           }
           .lead {
               font-size: 44px;
               font-weight: 300;
               margin-top: 60px;
               line-height: 55px;
           }
           /*hero ends*/
           /*skills & intrests*/
           .sections {
               vertical-align: top;
               display: inline-block;
               width: 49.7%;
               height: 50px;
           }
           .section-title {
               font-size: 20px;
               font-weight: 600;
               margin-bottom: 15px;
           }
           .list-card {
               margin: 30px 0;
           }
           .list-card .exp,
           .list-card div {
               display: inline-block;
               vertical-align: top;
           }
           .list-card .exp {
               margin-right: 15px;
               color: #4A90E2;
               font-weight: 600;
               width: 100px;
           }
           .list-card div {
               width: 70%;
           }
           .list-card h3 {
               font-size: 20px;
               font-weight: 600;
               color: #5B6A9A;
               line-height: 26px;
               margin-bottom: 8px;
           }
           .list-card div span {
               font-size: 16px;
               color: #81899C;
               line-height: 22px;
           }
           /*skill and intrests ends*/
           /* Achievements */
           .cards {
               max-width: 1120px;
               display: block;
               margin-top: 280px;
           }
           .card {
               width: 47.9%;
               height: 200px;
               background-color: #EEF0F7;
               display: inline-block;
               margin: 7px 5px;
               vertical-align: top;
               border-radius: 10px;
               text-align: center;
               padding-top: 50px
           }
           .card-active,
           .card:hover {
               transform: scale(1.02);
               transition: 0.5s;
               background-color: #fff;
               box-shadow: 0 5px 50px -8px #ddd;
               cursor: pointer;
           }
           .skill-level {
               display: inline-block;
               max-width: 160px;
           }
           .skill-level span {
               font-size: 35px;
               font-weight: 300;
               color: #5B6A9A;
               vertical-align: top;
           }
           .skill-level h2 {
               font-size: 95px;
               font-weight: 300;
               display: inline-block;
               vertical-align: top;
               color: #5B6A9A;
               letter-spacing: -5px;
           }
           .skill-meta {
               vertical-align: top;
               display: inline-block;
               max-width: 300px;
               text-align: left;
               margin-top: 15px;
               margin-left: 15px;
           }
           .skill-meta h3 {
               font-size: 20px;
               font-weight: 800;
               color: #5B6A9A;
               margin-bottom: 5px;
           }
           .skill-meta span {
               color: #81899C;
               line-height: 20px;
               font-size: 16px;
           }
           /* Achievements ends */
           /* Timeline styles*/
           ol {
               position: relative;
               display: block;
               margin: 100px 0;
               height: 2px;
               background: #EEF0F7;
           }
           ol::before,
           ol::after {
               content: "";
               position: absolute;
               top: -10px;
               display: block;
               width: 0;
               height: 0;
               border-radius: 10px;
               border: 0 solid #31708F;
           }
           ol::before {
               left: -5px;
           }
           ol::after {
               right: -10px;
               border: 0 solid transparent;
               border-right: 0;
               border-left: 20px solid #31708F;
               border-radius: 3px;
           }
           /* ---- Timeline elements ---- */
           li {
               position: relative;
               display: inline-block;
               float: left;
               width: 25%;
               height: 50px;
           }
           li .line {
               position: absolute;
               top: -47px;
               left: 1%;
               font-size: 20px;
               font-weight: 600;
               color: #04143A;
           }
           li .point {
               content: "";
               top: -7px;
               left: 0;
               display: block;
               width: 8px;
               height: 8px;
               border: 4px solid #fff;
               border-radius: 10px;
               background: #4A90E2;
               position: absolute;
           }
           li .description {
               display: none;
               padding: 10px 0;
               margin-top: 20px;
               position: relative;
               font-weight: normal;
               z-index: 1;
               max-width: 95%;
               font-size: 18px;
               font-weight: 600;
               line-height: 25px;
               color: #5B6A9A;
           }
           .description::before {
               content: '';
               width: 0;
               height: 0;
               border-left: 5px solid transparent;
               border-right: 5px solid transparent;
               border-bottom: 5px solid #f4f4f4;
               position: absolute;
               top: -5px;
               left: 43%;
           }
           .timeline .date {
               font-size: 14px;
               color: #81899C;
               font-weight: 300;
           }
           /* ---- Hover effects ---- */
           li:hover {
               color: #48A4D2;
           }
           li .description {
               display: block;
           }
           /*timeline ends*/
           /* Media queries*/
           @media(max-width: 1024px) {
               .container {
                   padding: 15px;
                   margin: 0 auto;
               }
               .cards {
                   margin-top: 250px;
               }
           }
           @media(max-width: 768px) {
               .container {
                   padding: 15px;
                   margin: 0 auto;
               }
               .cards {
                   margin-top: 320px;
               }
               .card {
                   padding: 15px;
                   text-align: left;
               }
               .card h2 {
                   font-size: 70px;
               }
               .card,
               .sections {
                   width: 100%;
                   height: auto;
                   margin: 10px 0;
                   float: left;
               }
               .timeline {
                   border: none;
                   background-color: rgba(0, 0, 0, 0);
               }
               .timeline li {
                   margin-top: 70px;
                   height: 150px;
               }
           }
           @media(max-width: 425px) {
               h1.name {
                   font-size: 40px;
               }
               .card,
               .sections {
                   width: 100%;
                   height: auto;
                   margin: 10px 0;
                   float: left;
               }
               .timeline {
                   display: none;
               }
               .job-title {
                   position: absolute;
                   font-size: 15px;
                   top: -40px;
                   right: 20px;
                   padding: 10px
               }
               .lead {
                   margin-top: 15px;
                   font-size: 20px;
                   line-height: 28px;
               }
               .container {
                   margin: 0;
                   padding: 0 15px;
               }
               footer {
                   margin-top: 2050px;
               }
           }
           table {
               border: 1px solid #ccc;
               border-collapse: collapse;
               margin: 0;
               padding: 0;
               width: 100%;
               table-layout: fixed;
             }
             table caption {
               font-size: 1.5em;
               margin: .5em 0 .75em;
             }
             table tr {
               background-color: #f8f8f8;
               border: 1px solid #ddd;
               padding: .35em;
             }
             table th,
             table td {
               padding: .625em;
               text-align: center;
               word-wrap: break-word;
             }
             table th {
               font-size: .85em;
               letter-spacing: .1em;
               text-transform: uppercase;
             }
             @media screen and (max-width: 600px) {
               table {
                 border: 0;
               }
               table caption {
                 font-size: 1.3em;
               }
               table thead {
                 border: none;
                 clip: rect(0 0 0 0);
                 height: 1px;
                 margin: -1px;
                 overflow: hidden;
                 padding: 0;
                 position: absolute;
                 width: 1px;
               }
               table tr {
                 border-bottom: 3px solid #ddd;
                 display: block;
                 margin-bottom: .625em;
               }
               table td {
                 border-bottom: 1px solid #ddd;
                 display: block;
                 font-size: .8em;
                 text-align: right;
               }
               table td::before {
                 /*
                 * aria-label has no advantage, it won't be read inside a table
                 content: attr(aria-label);
                 */
                 content: attr(data-label);
                 float: left;
                 font-weight: bold;
                 text-transform: uppercase;
               }
               table td:last-child {
                 border-bottom: 0;
               }
             }
       </style>
   </head>
   <body>
       <div class="container">
           <div class="hero">
               <h1 class="name">
                   <strong>${productName} </strong>
                   Accessibility Test Results
                   <br>
                   </h1>
               <span class="job-title">v${softwareVersion}</span><br>
               <strong>${location} Page</strong>
               <p><br>This testing POC provides a rapid accessibility assessment of a target URL to assist manual accessibility testing. As per Axe-Core library, covers around 55% of the Accessibility assessments usually performed by manual accessibility testing without any false positives.</p>
               <br>
               <p>The following Axe-Core accessibility rules and group of rules are being tested for:</p>
               <div class="email list-card">
                   <p>
                       WCAG 2.2(A), WCAG 2.2(AA), ACT, SECTION 508, EN 301 549 and ACCESSIBILITY BEST PRACTICES.</p>
               </div>
               <h2 class="lead">Summary of Results:</h2>
           </div>
       </div>
       <div class="container">
           <div class="sections">
               <h2 class="section-title"></h2>
               <div class="list-card">
               <span class="exp"></span>
                   <div>
                       <h3>Accessibility Issues found:</h3>
                       <span>${violations.length}</span>
                   </div>
               </div>
           </div>
           <div class="sections">
               <h2 class="section-title"></h2>
               <div class="list-card">
               <span class="exp"></span>
                   <div>
                       <h3>Test Executed On:</h3>
                       <span>${day.toLocaleString("en-GB", { timeZone: "Europe/London", timeZoneName: "short" })}</span>
                   </div>
               </div>
           </div>
           <br><br><br><br>
           <div class="sections">
               <h2 class="section-title"></h2>
               <div class="list-card">
               <span class="exp"></span>
                   <div>
                       <h3>URL:</h3>
                       <span>${url}</span>
                   </div>
               </div>
           </div>
       </div>
       <div class="container cards">
           <div class="card">
               <div class="skill-level">
                   <span></span>
                   <h2>${getTotalIssues(violations, indicators['critical'] + " " + "CRITICAL")}</h2>
               </div>
               <div class="skill-meta">
                   <h3>${indicators['critical']} Critical</h3>
                   <span>Issues that really impact accessibility and should be looked into.</span>
               </div>
           </div>
           <div class="card">
               <div class="skill-level">
                   <h2>${getTotalIssues(violations, indicators['serious'] + " " + "SERIOUS")}</h2>
                   <span></span>
               </div>
               <div class="skill-meta">
                   <h3>${indicators['serious']} Serious</h3>
                   <span>Issues that significantly impact accessibility and should be looked into.</span>
               </div>
           </div>
           <div class="card">
               <div class="skill-level">
                   <h2>${getTotalIssues(violations, indicators['moderate'] + " " + "MODERATE")}</h2>
                   <span></span>
               </div>
               <div class="skill-meta">
                   <h3>${indicators['moderate']} Moderate</h3>
                   <span>Issues that moderately impact accessibility.</span>
               </div>
           </div>
           <div class="card">
               <div class="skill-level">
                   <h2>${getTotalIssues(violations, indicators['minor'] + " " + "MINOR")}</h2>
                   <span></span>
               </div>
               <div class="skill-meta">
                   <h3>${indicators['minor']} Minor</h3>
                   <span>Minor impact issues that would be nice to fix if possible.</span>
               </div>
           </div>
       </div>
       <div class="container resultsTable">
           ${table}
       </div>
       <br><br>
       <footer class="container">
           <span style="font-size: 16px; margin-top: ">2024 P3C Test Team</span>
       </footer>
   </body>
</html>
`;
       let filename = `${filePath}${location}Results.html`;
       let file = {
           filename: filename,
           fileBody: templateFile
       }
       cy.task('generateReport', file, { log: false });
   }
})


