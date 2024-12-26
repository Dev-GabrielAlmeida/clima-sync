const weatherApiKey = "MYAPIKEY";
const erroMsg = document.getElementById('erro-msg');

const getData = async (city) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&lang=enr&units=metric`)
    const dataReceived = await response.json()

    return dataReceived
}

const fetchWeatherData = async (city) => {

    try {
        const apiResponse = await getData(city);

        // Verifica se a resposta da API é válida
        if (!apiResponse || apiResponse.cod !== 200) {
            throw new Error("Cidade não encontrada ou erro na API");
        }

        // Garante que a mensagem de erro fique escondida
        erroMsg.style.visibility = 'hidden';

        // Aguardando a bandeira carregar
        const flagElement = await getFlag(apiResponse.sys.country);

        // Obtem o código do ícone do clima
        const weatherIconCode = apiResponse.weather[0].icon;
        const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

        const weatherInfo = {
            temperature: `${parseInt(apiResponse.main.temp)} °C`,
            location: `<i class="bi bi-geo-alt-fill"></i> ${apiResponse.name}, ${flagElement.outerHTML}`,
            descriptionWeather: apiResponse.weather[0].description,
            humidity: `${apiResponse.main.humidity}<span>%</span>`,
            wind: `${apiResponse.wind.speed}<span>km/h</span>`,
            icon: `<img src="${weatherIconUrl}" alt="Ícone do clima" width="50" height="50">`,
        };

        // Chamando a função para atualizar os dados climaticos
        updateWeatherDisplay(weatherInfo);

    } catch (error) {

        erroMsg.style.visibility = 'visible';
        
        console.error("Erro ao buscar dados do clima:", error);
        return `Erro: ${error.message}`;

    }
}

// Cidade padrão inicial
fetchWeatherData('London');

// Adiciona um ouvinte ao botão de busca
document.getElementById('btnSearchWeather').addEventListener('click', (e) => {
    e.preventDefault();

    const inputCity = document.getElementById('inputCity');
    const city = inputCity.value.trim();

    fetchWeatherData(city);
    cityInput.value = '';
});

// Função para atualizar as informações do clima
const updateWeatherDisplay = (weatherInfo) => {
    Object.keys(weatherInfo).forEach((key) => {
        document.getElementById(key).innerHTML = weatherInfo[key];
    });
}

// Função para buscar a bandeira do local
const getFlag = async (country) => {

    const flagUrl = `https://flagsapi.com/${country}/flat/64.png`;

    // Cria um elemento de imagem
    const imgElement = document.createElement('img');
    imgElement.src = flagUrl;
    imgElement.width = 29;
    imgElement.height = 29;

    return imgElement; // Retorna o elemento de imagem
}
