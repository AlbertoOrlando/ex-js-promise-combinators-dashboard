async function getDashboardData(query) {
    try {
        // Esegui le 3 fetch in parallelo
        const [destinationsRes, weathersRes, airportsRes] = await Promise.allSettled([
            fetch(`http://localhost:5050/destinations?search=${query}`),
            fetch(`http://localhost:5050/weathers?search=${query}`),
            fetch(`http://localhost:5050/airports?search=${query}`)
        ]);

        // Stampa un messaggio di errore per ogni richiesta fallita
        if (destinationsRes.status === "rejected") {
            console.error(`Errore nella richiesta Destinations:`, destinationsRes.reason);
        }
        if (weathersRes.status === "rejected") {
            console.error(`Errore nella richiesta Weathers:`, weathersRes.reason);
        }
        if (airportsRes.status === "rejected") {
            console.error(`Errore nella richiesta Airports:`, airportsRes.reason);
        }

        // Converti le risposte in JSON
        const [destinationsData, weathersData, airportsData] = await Promise.allSettled([
            destinationsRes.value ? destinationsRes.value.json() : Promise.resolve([]),
            weathersRes.value ? weathersRes.value.json() : Promise.resolve([]),
            airportsRes.value ? airportsRes.value.json() : Promise.resolve([])
        ]);

        const destinations = destinationsData.value || [];
        const weathers = weathersData.value || [];
        const airports = airportsData.value || [];

        // Estrai i primi elementi di ogni array
        const destination = destinations[0] || {};
        const weather = weathers[0] || {};
        const airport = airports[0] || {};

        // Crea l'oggetto aggregato
        const dashboardData = {
            city: destination.name,
            country: destination.country,
            temperature: weather.temperature,
            weather: weather.weather_description,
            airport: airport.name
        };

        // Stampa in console un messaggio ben formattato
        console.log(`Dati per "${query}":
    Città: ${dashboardData.city}, ${dashboardData.country}
    Meteo: ${dashboardData.temperature}°, ${dashboardData.weather}
    Aeroporto principale: ${dashboardData.airport}`);

        // Restituisci i dati
        return dashboardData;
    } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
        throw error;
    }
}

// Test della funzione con la query "london"
getDashboardData("london");