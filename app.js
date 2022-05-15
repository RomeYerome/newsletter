// Require Express to simplify node servers
const express = require('express');

// Require body-parser to parse form inputs
const bodyParser = require('body-parser');

// Require axios to make https requests
const axios = require('axios');


// Create instance of Express
const app = express();

// Define port for heroku
const port = process.env.PORT;

// Require mailchimp library
const mailchimp = require("@mailchimp/mailchimp_marketing");

const apiKey = "6e67bade093ae2c56d294f1466c93662-us13";
const myListID = "83dac6f39c";




// power express app to use bodyParser qs library
app.use(bodyParser.urlencoded({extended:true}));

// Instruct express to serve static files in public folder
app.use(express.static('public'));

// Set home get request
app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/signup.html");
})





// Set post request for home route
app.post("/", (req, res)=>{
    let fName = req.body.fName;
    let lName = req.body.lName;
    let email = req.body.email;

    console.log(fName, lName, email);

    mailchimp.setConfig({
        apiKey: apiKey,
        server: "us13",
    });

    // Connect to mailchimp API
    async function pingMailchimp() {
        const response = await mailchimp.ping.get();
        console.log(response);
    }

    pingMailchimp();


    // Add contacts/Members to Audience/Lists
    const listId = myListID;
    const subscribingUser = {
        firstName: fName,
        lastName: lName,
        email: email,
    };

    async function addContact() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });

        console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);

        console.log(response);
        if (response) {
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "failure.html");
        }

    }

    addContact();


    //


    // res.redirect("/");
})



// Set up server to listen on port
app.listen(port || 3000, ()=>{
    console.log("Server running on port 3000");
})













// Create lists with mailchimp api non free plans
// mailchimp.setConfig({
//     apiKey: apiKey,
//     server: "us13",
// });
// const event = {
//     name: "aMagicExperience Meetup"
// };
//
// const footerContactInfo = {
//     company: "aMagicExperience",
//     address1: "675 Ponce de Leon Ave NE",
//     address2: "Suite 5000",
//     city: "Atlanta",
//     state: "GA",
//     zip: "30308",
//     country: "US"
// };
//
// const campaignDefaults = {
//     from_name: "Gettin' Together",
//     from_email: "events@amagicexperience.com",
//     subject: "aMagicExperience Meetup",
//     language: "EN_US"
// };
//
// async function createList() {
//     const response = await mailchimp.lists.createList({
//         name: event.name,
//         contact: footerContactInfo,
//         permission_reminder: "permission_reminder",
//         email_type_option: true,
//         campaign_defaults: campaignDefaults
//     });
//
//     console.log(`Successfully created an audience. The audience id is ${response.id}.`);
// }
//
// createList();




// Batch add members to list
// const run = async () => {
//     const response = await client.lists.batchListMembers(listId, {
//         members: [{
//             email_address: subscribingUser.email,
//             status: "subscribed",
//             merge_fields: {
//                 FNAME: subscribingUser.firstName,
//                 LNAME: subscribingUser.lastName
//         }],
//     });
//     console.log(response);
// };
//
// run();
