# 📫 VLKMailer

##### A Nodemailer Provider for 🚀 Strapi that helps you to send email!

##### Table of contents:

- [🏗 Installation](#-installation)
- [⚙ How to use](#-how-to-use)
- [🎓 Example](#-example)
- [🔗 Links](#-links)

powered by [VLK Studio](https://www.vlkstudio.com/)

## 🏗 Installation

Simply run this command in the same location where strapi is installed:

```bash
npm i strapi-provider-email-vlkmailer
```

... and then restart strapi!

```bash
strapi develop
```

## ⚙ How to use

Navigate to **PLUGINS --> EMAIL** and go to the configurations by clicking the gear (⚙).

Select **VlkMailer** as your default email provider, now you only have to compile the form with your SMTP credentials! (host, username, etc..)

That's all folks!

## 🎓 Example

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
    secure: true,
    html: '... the html of your email!'
  });
},
```

## 🔗 Links

- [Strapi website](http://strapi.io/)
- [Strapi community on Slack](http://slack.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)
