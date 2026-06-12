let tenure = 24;
let calcData = {};

document.addEventListener('DOMContentLoaded', async () => {
  loadCarPicker();
  bindSliders();
  bindTenure();
  readURLParams();
  calculate();
  bindWAButton();
});

async function loadCarPicker() {
  try {
    const cars = await apiFetch('/api/cars?status=Available');
    const picker = document.getElementById('carPicker');
    if (!picker) return;
    cars.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.price_ngn;
      opt.textContent = `${c.name} — ${formatNGN(c.price_ngn)}`;
      picker.appendChild(opt);
    });
    picker.addEventListener('change', () => {
      if (!picker.value) return;
      const slider = document.getElementById('priceSlider');
      if (slider) { slider.value = picker.value; slider.dispatchEvent(new Event('input')); }
    });
  } catch {}
}

function readURLParams() {
  const p = new URLSearchParams(window.location.search);
  if (p.get('price')) {
    const slider = document.getElementById('priceSlider');
    if (slider) { slider.value = parseInt(p.get('price')); slider.dispatchEvent(new Event('input')); }
  }
}

function bindSliders() {
  const priceSlider = document.getElementById('priceSlider');
  const downSlider = document.getElementById('downSlider');
  const rateSlider = document.getElementById('rateSlider');

  priceSlider?.addEventListener('input', () => {
    document.getElementById('priceDisplay').textContent = formatNGN(priceSlider.value);
    calculate();
  });
  downSlider?.addEventListener('input', () => {
    document.getElementById('downDisplay').textContent = `${downSlider.value}%`;
    calculate();
  });
  rateSlider?.addEventListener('input', () => {
    document.getElementById('rateDisplay').textContent = `${rateSlider.value}%`;
    calculate();
  });
}

function bindTenure() {
  document.querySelectorAll('.tenure-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tenure-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tenure = parseInt(btn.dataset.months);
      document.getElementById('tenureDisplay').textContent = `${tenure} Months`;
      calculate();
    });
  });
}

function calculate() {
  const price = parseFloat(document.getElementById('priceSlider')?.value || 85000000);
  const downPct = parseFloat(document.getElementById('downSlider')?.value || 40) / 100;
  const annualRate = parseFloat(document.getElementById('rateSlider')?.value || 15) / 100;
  const months = tenure;

  const down = price * downPct;
  const loan = price - down;
  const monthlyRate = annualRate / 12;
  let monthly;

  if (monthlyRate === 0) {
    monthly = loan / months;
  } else {
    monthly = loan * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  const totalRepay = monthly * months;
  const totalInterest = totalRepay - loan;
  const principalPct = Math.round((loan / totalRepay) * 100);

  calcData = { price, down, loan, monthly, totalRepay, totalInterest, months, principalPct };

  // Update UI
  document.getElementById('monthlyResult').textContent = formatNGN(Math.round(monthly));
  document.getElementById('monthlySubtext').textContent = `for ${months} months`;
  document.getElementById('totalRepay').textContent = formatNGN(Math.round(totalRepay));
  document.getElementById('totalInterest').textContent = formatNGN(Math.round(totalInterest));
  document.getElementById('effectiveRate').textContent = `${((totalInterest / loan) * 100).toFixed(1)}%`;
  document.getElementById('sumPrice').textContent = formatNGN(price);
  document.getElementById('sumDown').textContent = formatNGN(Math.round(down));
  document.getElementById('sumLoan').textContent = formatNGN(Math.round(loan));
  document.getElementById('chartCenterVal').textContent = `${principalPct}%`;

  drawPieChart(principalPct);
  buildAmortTable(loan, monthlyRate, monthly, months);
}

function drawPieChart(principalPct) {
  const canvas = document.getElementById('pieChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 80, cy = 80, r = 65, innerR = 45;
  ctx.clearRect(0, 0, 160, 160);

  const principalAngle = (principalPct / 100) * Math.PI * 2;
  const interestAngle = Math.PI * 2 - principalAngle;

  // Principal (gold)
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + principalAngle);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 160, 160);
  grad.addColorStop(0, '#C9A84C');
  grad.addColorStop(1, '#E8C96A');
  ctx.fillStyle = grad;
  ctx.fill();

  // Interest (dark)
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, -Math.PI / 2 + principalAngle, -Math.PI / 2 + Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = '#2A2A2A';
  ctx.fill();

  // Inner circle (donut)
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim() || '#161616';
  ctx.fillStyle = bgColor;
  ctx.fill();
}

function buildAmortTable(loan, monthlyRate, monthly, months) {
  const tbody = document.getElementById('amortBody');
  if (!tbody) return;
  let balance = loan;
  let rows = '';
  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principal = monthly - interest;
    balance = Math.max(0, balance - principal);
    rows += `<tr><td>${i}</td><td>${formatNGN(Math.round(monthly))}</td><td>${formatNGN(Math.round(principal))}</td><td>${formatNGN(Math.round(interest))}</td><td>${formatNGN(Math.round(balance))}</td></tr>`;
  }
  tbody.innerHTML = rows;
}

function bindWAButton() {
  document.getElementById('waSendBtn')?.addEventListener('click', () => {
    const msg = `Hello Sarkinmota Autos!\n\nI calculated my installment plan:\n• Vehicle Price: ${formatNGN(calcData.price)}\n• Down Payment: ${formatNGN(Math.round(calcData.down))}\n• Loan Amount: ${formatNGN(Math.round(calcData.loan))}\n• Monthly Payment: ${formatNGN(Math.round(calcData.monthly))}\n• Tenure: ${calcData.months} months\n• Total Repayment: ${formatNGN(Math.round(calcData.totalRepay))}\n\nPlease guide me on how to proceed. My bratha!`;
    window.open(buildWALink(msg), '_blank');
  });
}
