async function fetchCurrencies() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();
    const currencyMap = new Map();

    countries.forEach((country) => {
      if (country.currencies) {
        Object.keys(country.currencies).forEach((currency) => {
          currencyMap.set(currency, `${country.name.common} - ${currency}`);
        });
      }
    });

    // Ensure India (INR) is included
    currencyMap.set("INR", "India - INR");

    const sortedCurrencies = Array.from(currencyMap.entries()).sort((a, b) =>
      a[1].localeCompare(b[1])
    );
    const fromSelect = document.getElementById("fromCurrency");
    const toSelect = document.getElementById("toCurrency");

    sortedCurrencies.forEach(([currency, label]) => {
      const optionFrom = document.createElement("option");
      optionFrom.value = currency;
      optionFrom.textContent = label;
      fromSelect.appendChild(optionFrom);

      const optionTo = document.createElement("option");
      optionTo.value = currency;
      optionTo.textContent = label;
      toSelect.appendChild(optionTo);
    });

    fromSelect.value = "USD";
    toSelect.value = "INR";
  } catch (error) {
    console.error("Error fetching currency data", error);
  }
}

async function convertCurrency() {
  const amount = document.getElementById("amount").value;
  const fromCurrency = document.getElementById("fromCurrency").value;
  const toCurrency = document.getElementById("toCurrency").value;

  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );
    const data = await response.json();
    const rate = data.rates[toCurrency];
    const convertedAmount = (amount * rate).toFixed(2);
    document.getElementById(
      "result"
    ).innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
  } catch (error) {
    console.error("Error fetching exchange rates", error);
    document.getElementById("result").innerText =
      "Error fetching exchange rates";
  }
}

fetchCurrencies();
