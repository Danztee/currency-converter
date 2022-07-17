const dropList = document.querySelectorAll('.drop-list select'),
  fromCurrency = document.querySelector('.from select'),
  toCurrency = document.querySelector('.to select'),
  getButton = document.querySelector('form button');

for (let i = 0; i < dropList.length; i++) {
  for (currencyCode in countryList) {
    let selected;
    if (i == 0) {
      selected = currencyCode == 'USD' ? 'selected' : '';
    } else if (i == 1) {
      selected = currencyCode == 'NGN' ? 'selected' : '';
    }
    let optionTag = ` <option value="${currencyCode}" ${selected}>${currencyCode}</option>`;
    dropList[i].insertAdjacentHTML('beforeend', optionTag);
  }
  dropList[i].addEventListener('change', e => {
    loadFlag(e.target);
  });
}

function loadFlag(element) {
  for (code in countryList) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector('img');
      imgTag.src = `https://flagcdn.com/48x36/${countryList[
        code
      ].toLowerCase()}.png`;
    }
  }
}

getButton.addEventListener('click', e => {
  e.preventDefault();
  getExchangeRate();
});

const exchangeIcon = document.querySelector('.drop-list .icon');
exchangeIcon.addEventListener('click', () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

async function getExchangeRate() {
  const amount = document.querySelector('.amount input');
  const exchangeRatetTxt = document.querySelector('.exchange-rate');
  let amountval = amount.value;
  if (amountval == '' || amountval == '0' || isNaN(amount.value)) {
    amount.value = '1';
    amountval = '1';
  }
  try {
    exchangeRatetTxt.innerHTML = 'getting exchange rate...';
    const apiKey = '5ad1658155b06ca06aeecd02';
    let request = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`
    );
    let data = await request.json();
    let exchangeRate = data.conversion_rates[toCurrency.value];
    let totalExchangeRate = (amountval * exchangeRate).toFixed(2);
    exchangeRatetTxt.innerHTML = `${amountval} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
  } catch (error) {
    exchangeRatetTxt.innerHTML = `${error}...`;
  }
}
