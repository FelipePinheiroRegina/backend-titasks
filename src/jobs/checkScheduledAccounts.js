const knex = require("../database/knex");
const nodemailer = require('nodemailer');
const { format } = require('date-fns');
require('dotenv').config();

// Configuração do Nodemailer
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função para enviar e-mail
async function sendEmail(userEmail, account, user) {
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Lembrete de Conta Agendada',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="text-align: center; color: #333;">Lembrete de Conta Agendada</h2>
            <p style="font-size: 16px; color: #555;">Olá ${user.name}, Tudo bem?</p>
            <p style="font-size: 16px; color: #555;">
                Aqui estão os detalhes da sua conta agendada:
            </p>
            <ul style="font-size: 16px; color: #555;">
                <li>Conta: ${account.title}</li>
                <li>Descrição: ${account.description}</li>
                ${account.price ? `<li>Preço: ${account.price}</li>` : ''}
                <li>Vencimento: ${format(new Date(account.scheduled), 'dd/MM/yyyy')}</li>
            </ul>
            <p style="font-size: 16px; color: #555;">Atenciosamente,</p>
            <p style="font-size: 16px; color: #232129; background-color: #5AE4A8;">T.I TASKS</p>
            <div style="text-align: center; margin-top: 20px;">
                <a href="http://192.168.70.215/" style="display: inline-block; padding: 10px 20px; background-color: #5AE4A8; color: #232129; text-decoration: none; border-radius: 5px;">Visite nosso site</a>
            </div>
        </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado para:', userEmail);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
}

// Função para verificar contas agendadas
async function checkScheduledAccounts() {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');

    const accounts = await knex('schedule')
      .whereRaw('date(scheduled) = ?', [today]);

    for (const account of accounts) {
      const user = await knex('users')
        .where('id', account.user_id)
        .first(); // Usando .first() para obter o primeiro resultado

      if (user && user.email) {
        await sendEmail(user.email, account, user);
      } else {
        console.error(`Usuário não encontrado para account id: ${account.id}`);
      }
    }
  } catch (error) {
    console.error('Erro ao verificar contas agendadas:', error);
  }
}

// Job do cron para verificar contas a cada dia às 8:00 AM   '*/30 * * * * *'
const { CronJob } = require('cron');
const job = new CronJob('0 8 * * *', async function() {
  console.log('Verificando contas agendadas...');
  await checkScheduledAccounts();
}, null, true, 'America/Sao_Paulo');

job.start();
