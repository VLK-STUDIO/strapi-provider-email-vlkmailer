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
    let attempts = config.attempts || 1;
    let transporterConfig = {
      host: config.host,
      port: config.port,
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
  
          transporterConfig = {
            ...transporterConfig,
            secure: !!options.secure,
            pool: !!options.pool,
            maxConnections: options.maxConnections || '5', 
            maxMessages: options.maxConnections || '100',
            rateDelta: options.maxConnections || '1000'
          };
  
          if(options.maxConnections) {
            transporterConfig.rateLimit = options.maxConnections;
          }
          
          const transporter = nodemailer.createTransport(transporterConfig);
  
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
            console.log(`The mail failed to send for some reason, we are tryng to resend the email`);
            console.log(`Remainig attempts ${attempts} timestamp:`);
            await sleep(1000);
          }
        });
      }
    }
  }
}
