const express = require('express');
const cors = require('cors');

const app = express();
const port = 3031;

async function getExchangeRateToUAH(baseCurrency) {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        const data = await response.json();

        if (data && data.rates && data.rates.UAH) {
            return `1 ${baseCurrency} = ${data.rates.UAH} UAH`;
        } else {
            throw new Error('The exchange rate to UAH was not found.');
        }
    } catch (error) {
        console.error('Error when receiving the exchange rate:', error.message);
        return error.message;
    }
}

async function getWeatherForecast(city) {
    const apiKey = '821c402397646964ee021b16cdee51b0';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            const weatherDataString = `
                Temperature: ${data.main.temp}°C
                Description: ${data.weather[0].description}
                Feels like: ${data.main.feels_like}°C
                Humidity: ${data.main.humidity}%
                Pressure: ${data.main.pressure} hPa
                Wind Speed: ${data.wind.speed} m/s
            `;
            return weatherDataString;
        } else {
            throw new Error('Error getting weather forecast.');
        }
    } catch (error) {
        console.error('Error getting weather forecast:', error.message);
        return 'Error getting weather forecast.';
    }
}

const data = {
    help: {
        text: 'What are you interested in?',
        actions: {
            'Currency rate': {
                text: 'Choose basic currency:',
                actions: {
                    'USD': {
                        text: getExchangeRateToUAH
                    },
                    'EUR': {
                        text: getExchangeRateToUAH
                    },
                    'GBP': {
                        text: getExchangeRateToUAH
                    }
                }
            },
            'Current weather': {
                text: 'Choose your city:',
                actions: {
                    'Kyiv': {
                        text: getWeatherForecast
                    },
                    'Lviv': {
                        text: getWeatherForecast
                    },
                    'Cherkasy': {
                        text: getWeatherForecast
                    },
                    'Odesa': {
                        text: getWeatherForecast
                    },
                    'Dnipro': {
                        text: getWeatherForecast
                    }
                }
            }
        }
    }
};

let currentStep = data;

app.use(express.json());
app.use(cors());

app.post('/', async (req, res) => {
    const { message } = req.body;

    if (currentStep.hasOwnProperty(message)) {
        const action = currentStep[message];
        if (!action.actions) {
            if (typeof action.text === 'function') {
                try {
                    const text = await action.text(message);
                    res.json({ text: `${text}\n\nThanks, Type 'help' to start again` });
                    currentStep = data;
                } catch (error) {
                    res.json({ text: "An error occurred. Try again." });
                }
            } else {
                res.json({ text: `${action.text}\n\nThanks, Type 'help' to start again` });
                currentStep = data;
            }
        } else {
            res.json(action);
            currentStep = action.actions;
        }
    } else {
        if (message === 'help') {
            currentStep = data[message].actions;
            res.json(data.help);
        } else {
            res.json({ text: "Sorry, I didn't understand that." });
        }

    }
});

app.listen(port, () => {
    console.log(`React chatbot server running on http://localhost:${port}`);
});
