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
- **secure**: enable SSL
- **pool**: set to *true* to use pooled connections (defaults to *false*) instead of creating a new connection for every email
- **maxConnections**: is the count of maximum simultaneous connections to make against the SMTP server (defaults to 5)

- **maxMessages**: limits the message count to be sent using a single connection (defaults to 100). After *maxMessages* is reached the connection is dropped and a new one is created for the following messages
- **rateDelta**: defines the time measuring period in milliseconds (defaults to 1000, ie. to 1 second) for rate limiting
- **rateLimit**: limits the message count to be sent in *rateDelta* time. Once *rateLimit* is reached, sending is paused until the end of the measuring period. This limit is shared between connections, so if one connection uses up the limit, then other connections are paused as well. If *rateLimit* is not set then sending rate is not limited



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
    secure: true,
    html: '... the html of your email!'
  });
},
```

# 🔗 Links

- [VLK Studio](https://www.vlkstudio.com/)
- [Strapi website](http://strapi.io/)
- [Strapi community on Slack](http://slack.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)
