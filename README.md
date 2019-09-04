# 📫 VLK Mailer

##### A Nodemailer Provider for 🚀 Strapi!

##### Table of contents:

- [🏗 Installation](#-installation)
- [⚙ How to use](#-how-to-use)
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

## 📌 Available options

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
