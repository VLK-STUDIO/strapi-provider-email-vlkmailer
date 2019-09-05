# 📫 VLK Mailer

##### A Nodemailer Provider for 🚀 Strapi!

##### Table of contents:

- [🏗 Installation](#-installation)
- [⚙ How to use](#-how-to-use)
  - [🔧 Available configurations](#-available-configurations)
  - [📌 Available options](#-available-options)
- [🎓 Example](#-example)
- [🔗 Links](#-links)

*powered by [VLK Studio](https://www.vlkstudio.com/)*



# 🏗 Installation

Simply run this command in the same location where strapi is installed:

```bash
npm i strapi-provider-email-vlkmailer
```

... and then restart strapi!

```bash
strapi develop
```

# ⚙ How to use

Navigate to ***PLUGINS --> EMAIL*** and go to the configurations by clicking the *gear* (⚙).

Select **VlkMailer** as your default email provider, now you only have to fill in the form with your email configurations (like *host, username, password, etc..*)!

*<u>That's all folks!</u>*

## 🔧 Available configurations

You can set this configuration directly from the Strapi Administration Panel

- **nodemailer_default_from**: The default sender address
- **nodemailer_default_replyto**: The default reply to address
- **host**: The address of the SMTP server
- **port**: The port used for the connections
- **username**: Your username
- **password**: Your password
- **maxConnections**: is the count of maximum simultaneous connections to make against the SMTP server (defaults to 10)
- **maxMessages**: limits the message count to be sent using a single connection (defaults to 100). After *maxMessages* is reached the connection is dropped and a new one is created for the following messages
- **rateDelta**: defines the time measuring period in milliseconds (defaults to 1000, ie. to 1 second) for rate limiting

## 📌 Available options

You can set this options in your code for each email you want to send!

- **to**: The receiver email address
- **from**: The sender email address
- **replyTo**: The email address where user's can text you back!
- **subject**: The subject of the email
- **text**: The text of the email (no HTML here!)
- **html**: The HTML version of the email
- **attachments**: The attachments to your email



# 🎓 Example

Maybe you want to send an email when a new member of your website has complete the registration process, to do this just go to your model (*/api/member/models/Member.js*)

Then edit the **afterCreate** method like this:

```javascript
// After creating a value.
// Fired after an `insert` query.
afterCreate: async (model, attrs, options) => {
  const member = model.attributes;

  return await strapi.plugins['email'].services.email.send({
    to: member.email,
    from: 'info@youremail.com',
    replyTo: 'info@youremail.com',
    subject: 'Welcome!',
    text: `Welcome to our website, ${member.name}`,
    html: '... the html of your email!'
  });
},
```

# 🔗 Links

- [VLK Studio](https://www.vlkstudio.com/)
- [Strapi website](http://strapi.io/)
- [Strapi community on Slack](http://slack.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)
