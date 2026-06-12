const WA_NUM = '2347015136111';

const buildWALink = (message) =>
  `https://wa.me/${WA_NUM}?text=${encodeURIComponent(message)}`;

const WA_MESSAGES = {
  general: () => `Hello Sarkinmota Autos! I visited your website and I'd like to make an enquiry. Please assist me.`,
  car: (carName) => `Hello, I'm interested in the *${carName}* listed on your website. Please send me more details including availability and payment options.`,
  testDrive: (carName) => `Hello, I'd like to book a test drive for the *${carName}*. Please let me know available dates.`,
  preOrder: () => `Hello, I'd like to pre-order a vehicle through Sarkinmota Autos. Please guide me through the process.`,
  sellSwap: () => `Hello, I'd like to sell or swap my car with Sarkinmota Autos. Please let me know the process.`,
  installment: (carName, monthly) => `Hello, I'm interested in the installment plan for the *${carName}*. I can see the monthly payment is approximately *${monthly}*. Please give me more details.`,
  vip: () => `Hello, I'd like to make a VIP Concierge request. I'm looking for a specific vehicle and would like Sarkinmota Autos to source it for me.`,
  referral: () => `Hello, I'd like to learn more about the Sarkinmota Autos referral bonus program.`,
};

document.addEventListener('DOMContentLoaded', () => {
  // Bind all static WhatsApp buttons
  document.querySelectorAll('[data-wa-message]').forEach(el => {
    const type = el.dataset.waMessage;
    const carName = el.dataset.waCar || '';
    let link = '#';

    if (type === 'general') link = buildWALink(WA_MESSAGES.general());
    else if (type === 'car') link = buildWALink(WA_MESSAGES.car(carName));
    else if (type === 'test-drive') link = buildWALink(WA_MESSAGES.testDrive(carName));
    else if (type === 'preorder') link = buildWALink(WA_MESSAGES.preOrder());
    else if (type === 'swap') link = buildWALink(WA_MESSAGES.sellSwap());
    else if (type === 'vip') link = buildWALink(WA_MESSAGES.vip());

    el.href = link;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  // FAB button
  const fab = document.querySelector('.whatsapp-fab');
  if (fab) {
    fab.href = buildWALink(WA_MESSAGES.general());
    fab.target = '_blank';
    fab.rel = 'noopener noreferrer';
  }
});

window.buildWALink = buildWALink;
window.WA_MESSAGES = WA_MESSAGES;
window.WA_NUM = WA_NUM;
