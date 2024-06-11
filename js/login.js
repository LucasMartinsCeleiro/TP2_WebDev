function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    // Immediately request geolocation when the page loads
    requestGeolocation();

    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();
        console.log('Form submitted');

        const username = document.getElementById('username').value;
        const avatar = document.getElementById('avatar').src;
        const geolocation = document.getElementById('geolocation').textContent;

        if (username && avatar && geolocation !== "Requesting location...") {
            setCookie('authenticated', 'true', 1); // 1 day expiration
            setCookie('username', username, 1); // 1 day expiration
            setCookie('avatar', avatar, 1); // 1 day expiration
            setCookie('geolocation', geolocation, 1); // 1 day expiration
            window.location.href = 'game.html';
        } else {
            alert("Please enter a username, upload a profile picture, and allow geolocation.");
        }
    };

    function requestGeolocation() {
        console.log('Requesting geolocation...');
        document.getElementById('geolocation').textContent = "Requesting location...";
        document.getElementById('location').style.display = 'block';

        if (navigator.geolocation) {
            console.log('Geolocation is supported');
            navigator.geolocation.getCurrentPosition(success, error, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            console.log('Geolocation is not supported by this browser');
            document.getElementById('geolocation').textContent = "Geolocation is not supported by this browser.";
        }

        function success(position) {
            console.log('Geolocation success');
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Determine the country based on the coordinates
            const country = getCountryByCoordinates(latitude, longitude);
            document.getElementById('geolocation').textContent = country;
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            document.getElementById('geolocation').textContent = `Unknown location (${err.message}).`;
        }
    }

    function getCountryByCoordinates(lat, lon) {
        // Basic example of country boundaries
        const countries = [
            { name: "Switzerland", latMin: 45.817, latMax: 47.808, lonMin: 5.956, lonMax: 10.492 },
            { name: "France", latMin: 41.333, latMax: 51.124, lonMin: -5.225, lonMax: 9.662 },
            { name: "United States", latMin: 24.396308, latMax: 49.384358, lonMin: -125.0, lonMax: -66.93457 },
            { name: "Canada", latMin: 41.6765556, latMax: 83.113889, lonMin: -141.0, lonMax: -52.616667 },
            { name: "Mexico", latMin: 14.5345, latMax: 32.718655, lonMin: -118.364893, lonMax: -86.710571 },
            { name: "Brazil", latMin: -33.742280, latMax: 5.271785, lonMin: -73.985535, lonMax: -34.792356 },
            { name: "Argentina", latMin: -55.05207, latMax: -21.781168, lonMin: -73.56036, lonMax: -53.63745 },
            { name: "United Kingdom", latMin: 49.909613, latMax: 60.845845, lonMin: -8.649357, lonMax: 1.749861 },
            { name: "Germany", latMin: 47.270111, latMax: 55.058347, lonMin: 5.866342, lonMax: 15.041896 },
            { name: "Italy", latMin: 35.491343, latMax: 47.092146, lonMin: 6.602828, lonMax: 18.514306 },
            { name: "Spain", latMin: 27.637598, latMax: 43.792356, lonMin: -18.160127, lonMax: 4.327784 },
            { name: "Russia", latMin: 41.185096, latMax: 82.058623, lonMin: 19.6389, lonMax: 180.0 },
            { name: "China", latMin: 18.153236, latMax: 53.56086, lonMin: 73.675379, lonMax: 135.026311 },
            { name: "India", latMin: 6.554607, latMax: 35.674545, lonMin: 68.111378, lonMax: 97.395561 },
            { name: "Australia", latMin: -54.750292, latMax: -10.062805, lonMin: 112.921114, lonMax: 159.255451 },
            { name: "South Africa", latMin: -46.97043, latMax: -22.126612, lonMin: 16.4515, lonMax: 32.8917 },
            { name: "Japan", latMin: 24.396308, latMax: 45.551483, lonMin: 122.93457, lonMax: 153.986672 },
            { name: "Egypt", latMin: 22.0, latMax: 31.667, lonMin: 25.0, lonMax: 35.0 },
            { name: "Nigeria", latMin: 4.272, latMax: 13.892, lonMin: 2.676, lonMax: 14.678 },
            { name: "Kenya", latMin: -4.676, latMax: 4.62, lonMin: 33.909, lonMax: 41.896 },
            { name: "South Korea", latMin: 33.189, latMax: 38.63, lonMin: 124.6, lonMax: 131.87 },
            { name: "Indonesia", latMin: -11.0, latMax: 6.0, lonMin: 95.0, lonMax: 141.0 },
            { name: "Saudi Arabia", latMin: 16.0, latMax: 32.0, lonMin: 34.0, lonMax: 56.0 },
            { name: "Turkey", latMin: 36.0, latMax: 42.1, lonMin: 26.0, lonMax: 45.0 },
            { name: "Iran", latMin: 25.0, latMax: 40.0, lonMin: 44.0, lonMax: 63.0 },
            { name: "Pakistan", latMin: 24.0, latMax: 37.0, lonMin: 60.0, lonMax: 77.0 },
            { name: "Bangladesh", latMin: 20.0, latMax: 27.0, lonMin: 88.0, lonMax: 93.0 },
            { name: "Thailand", latMin: 5.0, latMax: 21.0, lonMin: 97.0, lonMax: 106.0 },
            { name: "Vietnam", latMin: 8.0, latMax: 24.0, lonMin: 102.0, lonMax: 110.0 },
            { name: "Philippines", latMin: 5.0, latMax: 21.0, lonMin: 117.0, lonMax: 126.0 },
            { name: "Malaysia", latMin: 1.0, latMax: 7.0, lonMin: 100.0, lonMax: 120.0 },
            { name: "Singapore", latMin: 1.16, latMax: 1.47, lonMin: 103.6, lonMax: 104.3 },
            { name: "New Zealand", latMin: -47.3, latMax: -34.4, lonMin: 165.5, lonMax: 179.1 },
            { name: "Chile", latMin: -56.0, latMax: -17.5, lonMin: -75.0, lonMax: -66.0 },
            { name: "Colombia", latMin: -4.0, latMax: 13.0, lonMin: -80.0, lonMax: -66.0 },
            { name: "Peru", latMin: -18.0, latMax: 0.0, lonMin: -82.0, lonMax: -68.0 },
            { name: "Venezuela", latMin: 0.0, latMax: 12.0, lonMin: -73.0, lonMax: -59.0 },
            { name: "Ecuador", latMin: -5.0, latMax: 2.0, lonMin: -82.0, lonMax: -75.0 },
            { name: "Bolivia", latMin: -23.0, latMax: -9.0, lonMin: -69.0, lonMax: -58.0 },
            { name: "Paraguay", latMin: -28.0, latMax: -19.0, lonMin: -62.0, lonMax: -54.0 },
            { name: "Uruguay", latMin: -35.0, latMax: -30.0, lonMin: -58.0, lonMax: -53.0 },
            { name: "Norway", latMin: 57.0, latMax: 71.0, lonMin: 5.0, lonMax: 31.0 },
            { name: "Sweden", latMin: 55.0, latMax: 69.0, lonMin: 11.0, lonMax: 24.0 },
            { name: "Finland", latMin: 59.0, latMax: 70.0, lonMin: 20.0, lonMax: 32.0 },
            { name: "Denmark", latMin: 54.5, latMax: 58.0, lonMin: 8.0, lonMax: 13.0 },
            { name: "Poland", latMin: 49.0, latMax: 55.0, lonMin: 14.0, lonMax: 24.0 },
            { name: "Czech Republic", latMin: 48.5, latMax: 51.0, lonMin: 12.0, lonMax: 19.0 },
            { name: "Slovakia", latMin: 47.7, latMax: 49.6, lonMin: 16.8, lonMax: 22.6 },
            { name: "Hungary", latMin: 45.8, latMax: 48.6, lonMin: 16.0, lonMax: 23.0 },
            { name: "Austria", latMin: 46.4, latMax: 49.0, lonMin: 9.5, lonMax: 17.2 },
            { name: "Netherlands", latMin: 50.7, latMax: 53.6, lonMin: 3.4, lonMax: 7.2 },
            { name: "Belgium", latMin: 49.5, latMax: 51.5, lonMin: 2.5, lonMax: 6.4 },
            { name: "Luxembourg", latMin: 49.4, latMax: 50.2, lonMin: 5.7, lonMax: 6.5 },
            { name: "Ireland", latMin: 51.4, latMax: 55.4, lonMin: -10.5, lonMax: -5.3 },
            { name: "Portugal", latMin: 36.8, latMax: 42.1, lonMin: -9.5, lonMax: -6.2 },
            { name: "Greece", latMin: 34.8, latMax: 41.7, lonMin: 19.4, lonMax: 28.2 },
            { name: "Turkey", latMin: 36.0, latMax: 42.1, lonMin: 26.0, lonMax: 45.0 },
            { name: "Ukraine", latMin: 44.4, latMax: 52.4, lonMin: 22.1, lonMax: 40.2 },
            { name: "Romania", latMin: 43.6, latMax: 48.3, lonMin: 20.2, lonMax: 29.7 },
            { name: "Bulgaria", latMin: 41.2, latMax: 44.2, lonMin: 22.3, lonMax: 28.6 },
            { name: "Croatia", latMin: 42.4, latMax: 46.6, lonMin: 13.5, lonMax: 19.4 },
            { name: "Bosnia and Herzegovina", latMin: 42.6, latMax: 45.3, lonMin: 15.7, lonMax: 19.6 },
            { name: "Serbia", latMin: 42.0, latMax: 46.2, lonMin: 18.8, lonMax: 23.0 },
            { name: "Montenegro", latMin: 41.9, latMax: 43.6, lonMin: 18.4, lonMax: 20.4 },
            { name: "Macedonia", latMin: 40.8, latMax: 42.4, lonMin: 20.4, lonMax: 23.0 },
            { name: "Albania", latMin: 39.6, latMax: 42.7, lonMin: 19.3, lonMax: 21.0 },
            { name: "Slovenia", latMin: 45.4, latMax: 47.0, lonMin: 13.4, lonMax: 16.6 },
            { name: "Lithuania", latMin: 53.9, latMax: 56.4, lonMin: 20.9, lonMax: 26.8 },
            { name: "Latvia", latMin: 55.6, latMax: 58.1, lonMin: 20.9, lonMax: 28.1 },
            { name: "Estonia", latMin: 57.5, latMax: 59.5, lonMin: 21.5, lonMax: 28.2 },
            { name: "Belarus", latMin: 51.2, latMax: 56.2, lonMin: 23.1, lonMax: 32.7 },
            { name: "Moldova", latMin: 45.4, latMax: 48.5, lonMin: 26.6, lonMax: 30.1 }
        ];        

        for (const country of countries) {
            if (lat >= country.latMin && lat <= country.latMax && lon >= country.lonMin && lon <= country.lonMax) {
                return country.name;
            }
        }

        return "Country not found";
    }

    // Drag and drop functionality
    let dropArea = document.getElementById('drop-area');

    dropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('highlight');
    }, false);

    dropArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('highlight');
    }, false);

    dropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('highlight');

        let files = e.dataTransfer.files;
        handleFiles(files);
    }, false);

    dropArea.addEventListener('click', function() {
        document.getElementById('fileElem').click();
    });

    document.getElementById('fileElem').addEventListener('change', function() {
        let files = this.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        if (files.length) {
            let file = files[0];
            let reader = new FileReader();

            reader.onload = function(e) {
                let img = document.getElementById('avatar');
                img.src = e.target.result;
                img.style.display = 'block';
                document.querySelector('#drop-area p').style.display = 'none';
            }

            reader.readAsDataURL(file);
        }
    }
});
