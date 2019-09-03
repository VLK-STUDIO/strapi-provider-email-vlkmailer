'use strict'

const nodemailer = require('nodemailer');
const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

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
    },
    attempts: {
      label: 'Attempts',
      type: 'number',
    }
  },
  init: config => {
    let transporterConfig = {
      host: config.host,
      port: config.port,
      auth: {
        user: config.username,
        pass: config.password
      }
    };

    let attempts = config.attempts || 0;

    if (config.authMethod === 'ntlm') {
      transporterConfig = {
        ...transporterConfig,
        auth: {
          type: 'custom',
          method: 'NTLM',
          user: config.username,
          pass: config.password
        },
        customAuth: {
          NTLM: nodemailerNTLMAuth
        }
      };
    }

    function response(options) {
      return new Promise(async(resolve, reject) => {
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
        
        if (options.attachments) {
          msg.attachments = options.attachments;
        }

        transporterConfig = {
          ...transporterConfig,
          secure: !!options.secure,
          pool: !!options.pool,
          maxConnections: options.maxConnections || '10', 
          maxMessages: options.maxConnections || '100',
          rateDelta: options.maxConnections || '1000',
          rateLimit: options.maxConnections || '100'
        };
        
        const transporter = nodemailer.createTransport(transporterConfig);

        try {
          const info = await transporter.sendMail(msg);
          resolve(info);
        } catch(e) {
          if(attempts === 0) {
            return reject(e);
          }
          attempts -= 1;
          await sleep(1000);
          response(options);
        }
      });
    }

    return {
      send: response
    }
  }
}
