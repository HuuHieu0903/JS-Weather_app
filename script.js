const imageIcon = document.querySelector(".image-icon");
const temp = document.querySelector(".temp");
const cityName = document.querySelector(".city-name");
const humidity = document.querySelector(".number-humidity");
const wind = document.querySelector(".number-wind");
const info = document.querySelector(".info");
const loading = document.querySelector(".loading");
const CityInput = document.getElementById("city");
const btnSubmit = document.querySelector(".submit");
const message = document.querySelector(".message");

// Get User City
navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const apiGetUserCity = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const getUserCity = async () => {
        const response = await fetch(apiGetUserCity);
        return response;
    };
    getUserCity()
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network error");
            }
            return response.json();
        })
        .then((data) => {
            const userCity = data.city;
            return userCity;
        })
        // get weather user city
        .then((userCity) => {
            getWeatherCity(userCity)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network error");
                    }
                    return response.json();
                })
                .then((data) => {
                    updateDOM(data);
                    info.classList.add("show");
                    loading.classList.add("hidden");
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

// get weather city user input
btnSubmit.addEventListener("click", () => {
    message.classList.remove("show");
    const city = CityInput.value;
    if (city === "") {
        message.classList.add("show");
        message.textContent = "Please Enter City!!!";
    } else {
        loading.classList.remove("hidden");
        info.classList.remove("show");
        getWeatherCity(city)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network error");
                }
                return response.json();
            })
            .then((data) => {
                updateDOM(data);
                info.classList.add("show");
            })
            .catch(() => {
                message.classList.add("show");
                message.textContent = "Invalid City!!!";
            })
            .finally(() => {
                loading.classList.add("hidden");
            });
    }
});

// get weather city
const getWeatherCity = async (city) => {
    const apiKey = "dd62bdd2654b4937baa23013230909";
    const api = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    const response = await fetch(api);
    return response;
};

// update DOM
const updateDOM = (data) => {
    imageIcon.src = data.current.condition.icon;
    temp.textContent = data.current.temp_c + " °C";
    cityName.textContent = data.location.name;
    humidity.textContent = data.current.humidity + "%";
    wind.textContent = data.current.wind_kph + " km/h";
};
