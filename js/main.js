let dateContainnner, timeContainer;
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thuesday', 'Friday', 'Saturday'];

document.addEventListener("DOMContentLoaded", init);

function init() {
    console.log("Ramu is ready");
    timeContainer = document.getElementsByClassName('time')[0];
    dateContainnner = document.getElementsByClassName('date')[0];

    updateDate();
    window.requestAnimationFrame(updateTime);

    help();

    getBgImage();
}

function help() {
    let options = [];

    for (var site in config) {
        options.push("goto " + site + " " + config[site].param);
    }

    var typed = new Typed('#message', {
        strings: options,
        shuffle: true,
        typeSpeed: 300,
        backDelay: 1000,
        startDelay: 5000,
        showCursor: false,
        loop: true
    });
}

function updateTime() {
    var now = new Date();
    timeContainer.innerHTML = padNum(now.getHours()) + ":" + padNum(now.getMinutes()) + ":" + padNum(now.getSeconds());

    if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        updateDate();
    }

    window.requestAnimationFrame(updateTime);
}

function updateDate() {
    var now = new Date();
    dateContainnner.innerHTML = day[now.getDay()] + " " + padNum(now.getDate()) + nth(now.getDate()) + " " + month[now.getMonth()] + ", " + now.getFullYear();
}

function padNum(num) {
    return (num > 9) ? num : "0" + num;
}

function nth(d) {
    let result = '';
    if (d > 3 && d < 21) {
        result = 'th';
    } else {
        switch (d % 10) {
            case 1:
                result = 'st';
                break;
            case 2:
                result = 'nd';
                break;
            case 3:
                result = 'rd';
                break;
            default:
                result = 'th';
        }
    }
    return '<sup>' + result + '</sup>';
}

function getBgImage() {
    axios.get('https://api.unsplash.com/photos/random?client_id=' + secret.unsplash.API_KEY + '&orientation=landscape')
        .then(response => {
            if (response.data) {
                let data = response.data;
                
                document.body.style.backgroundImage = 'url(' + data.urls.regular + ')';
                document.getElementById('description').innerHTML = data.description;
                document.getElementById('name').innerHTML = data.user.name;
                document.getElementById('link').href = data.user.links.html + '?utm_source=GoToExtension&utm_medium=referral';
            }

        })
        .catch(error => {
            document.body.style.backgroundImage = 'url(./image/default.jpeg)';
            document.getElementById('description').innerHTML = '';
            document.getElementById('name').innerHTML = 'Brandon Griggs';
            document.getElementById('link').href = 'https://unsplash.com/@paralitik' + '?utm_source=GoToExtension&utm_medium=referral';
        })
}