'use strict'

const nodemailer = require('nodemailer');
const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = {
  provider: 'VLK Mailer',
  name: 'Vlkmailer',
  auth: {
    nodemailer_default_from: {
      label: 'From',
      type: 'text'
    },
    nodemailer_default_replyto: {
      label: 'Reply To',
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
    let attempts = config.attempts && config.attempts > 0 ? config.attempts : 1;
    let transporterConfig = {
      host: config.host,
      port: Number.parseInt(config.port),
      secure: Number.parseInt(config.port) === 465,
      secureConnection: Number.parseInt(config.port) === 465,
      pool: true,
      debug: false,
      logger: true,
      auth: {
        user: config.username,
        pass: config.password
      }
    };

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

    if(transporterConfig.port == 465) {
      transporterConfig.tls = {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    }
    
    const transporter = nodemailer.createTransport(transporterConfig);

    return {
      send: options => {
        return new Promise(async(resolve, reject) => {
          options = options instanceof Object ? options : {};
  
          let message = {
            from: options.from || config.nodemailer_default_from,
            to: options.to || config.nodemailer_default_replyto,
            replyTo: options.replyTo || config.nodemailer_default_replyto,
            subject: options.subject,
            text: options.text || '',
            html: options.html || options.text
          }
  
          if (options.attachments) {
            message.attachments = options.attachments;
          }
  
          while(attempts > 0) {
            try {
              const info = await transporter.sendMail(message);
              return resolve(info);
            } catch(e) {
              if(attempts === 0) {
                return reject(e);
              }
            }
    
            attempts -= 1;
            console.log(`The email to ${message.to} has failed to send for some reason, we are tryng to resend the email`);
            console.log(`Current configurations:`, transporterConfig);
            console.log(`Remainig attempts ${attempts} timestamp:`);
            await sleep(1000);
          }

          return reject({
            message: `Unable to send the email to ${message.to}`
          });
        });
      }
    }
  }
}
