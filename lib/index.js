'use strict'

const nodemailer = require('nodemailer');
const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');

module.exports = {
  provider: 'VLK Mailer',
  name: 'Vlkmailer',
  auth: {
    nodemailer_default_from: {
      label: 'Nodemailer Default From',
      type: 'text'
    },
    nodemailer_default_replyto: {
      label: 'Nodemailer Default Reply-To',
      type: 'text'
    },
    host: {
      label: 'Host',
      type: 'text'
    },
    port: {
      label: 'Port',
      type: 'number'
    },
    username: {
      label: 'Username',
      type: 'text'
    },
    password: {
      label: 'Password',
      type: 'password'
    }
  },
  init: config => {
    let transporter;

    if (config.authMethod === 'ntlm') {
      transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: !!config.secure,
        auth: {
          type: 'custom',
          method: 'NTLM',
          user: config.username,
          pass: config.password
        },
        customAuth: {
          NTLM: nodemailerNTLMAuth
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: !!config.secure,
        auth: {
          user: config.username,
          pass: config.password
        }
      })
    }

    return {
      send: options => {
        return new Promise((resolve, reject) => {
          options = options instanceof Object ? options : {};
          options.from = options.from || config.nodemailer_default_from;
          options.replyTo = options.replyTo || config.nodemailer_default_replyto;
          options.text = options.text || options.html;
          options.html = options.html || options.text;

          let msg = {
            from: options.from,
            to: options.to,
            replyTo: options.replyTo,
            subject: options.subject,
            text: options.text,
            html: options.html
          }
          
          if (options.attachments){
            msg.attachments = options.attachments;
          }

          transporter.sendMail(msg)
            .then(resolve)
            .catch(error => reject(error))
        })
      }
    }
  }
}
