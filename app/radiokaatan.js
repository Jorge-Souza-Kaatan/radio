const Radio = {
    Links: {},
    IsPlaying: false,
    IsChecked: false,
    Volume: 1,
    FallbackURL: false,
    TimeControl: async (callback) => {
        const now = new Date();
        const currentMinutes = now.getMinutes();
        
        const nextHalfMinute = (Math.floor(currentMinutes / 30) + 1) * 30;
        let nextHalfHour = new Date(now);
        nextHalfHour.setMinutes(nextHalfMinute % 60);
        if (nextHalfMinute >= 60) {
            nextHalfHour.setHours(now.getHours() + 1);
        }
        nextHalfHour.setSeconds(0);
        nextHalfHour.setMilliseconds(0);
        const timeToNextHalf = nextHalfHour - now;
        setTimeout(() => {
            callback();
            setInterval(callback, 30 * 60 * 1000);
        }, timeToNextHalf);
    },
    Stream: async () => {
        if (!Radio.IsPlaying) {
            const radio = document.getElementById("radio");
            radio.setAttribute("type", "audio/mpeg");
            radio.src = "https://stream.zeno.fm/sklftdr6odruv";
            radio.play();
            Radio.IsPlaying = true;
            radio.addEventListener("ended", App.PlayPause);
            radio.addEventListener("error", App.PlayPause);
            radio.onvolumechange = e => {
                if (document.getElementById('radio').volume == 1) {
                    document.getElementById("mute-btn").querySelector("img").src = "https://cdn-kaatan.azurewebsites.net/files/volume.svg";
                } else {
                    document.getElementById("mute-btn").querySelector("img").src = "https://cdn-kaatan.azurewebsites.net/files/mute.svg";
                }
            }
            return true;
        } else {
            const radio = document.getElementById("radio");
            radio.pause();
            Radio.IsPlaying = false;
            return false;
        }
    },
    SpeakHour: async () => {
        //if (!Radio.IsPlaying || Radio.FallbackURL) return;
        let id = new Date().toLocaleTimeString().split(":").slice(0, -1).join("");
        if (Number(id) > 1259) id = (Number(id) - 1200);
        id = id.toString().padStart(4, "0");
        //
        const link = Links[id];
        console.log(link)
        App.Mute();
        const hr = document.getElementById("hr");
        hr.setAttribute("type", "audio/mpeg");
        hr.src = link;
        hr.play();
        hr.onended = Radio.PlayAds;
    },
    PlayAds: async () => {
        if (!Radio.IsPlaying || Radio.FallbackURL) return;
        App.Mute();
    },
    _: async () => { },
}

const Links = {
    "0000": "https://cdn-kaatan.azurewebsites.net/radio/hora/0000.mp3",
    "0015": "https://cdn-kaatan.azurewebsites.net/radio/hora/0015.mp3",
    "0030": "https://cdn-kaatan.azurewebsites.net/radio/hora/0030.mp3",
    "0045": "https://cdn-kaatan.azurewebsites.net/radio/hora/0045.mp3",
    "0100": "https://cdn-kaatan.azurewebsites.net/radio/hora/0100.mp3",
    "0115": "https://cdn-kaatan.azurewebsites.net/radio/hora/0115.mp3",
    "0130": "https://cdn-kaatan.azurewebsites.net/radio/hora/0130.mp3",
    "0145": "https://cdn-kaatan.azurewebsites.net/radio/hora/0145.mp3",
    "0200": "https://cdn-kaatan.azurewebsites.net/radio/hora/0200.mp3",
    "0215": "https://cdn-kaatan.azurewebsites.net/radio/hora/0215.mp3",
    "0230": "https://cdn-kaatan.azurewebsites.net/radio/hora/0230.mp3",
    "0245": "https://cdn-kaatan.azurewebsites.net/radio/hora/0245.mp3",
    "0300": "https://cdn-kaatan.azurewebsites.net/radio/hora/0300.mp3",
    "0315": "https://cdn-kaatan.azurewebsites.net/radio/hora/0315.mp3",
    "0330": "https://cdn-kaatan.azurewebsites.net/radio/hora/0330.mp3",
    "0345": "https://cdn-kaatan.azurewebsites.net/radio/hora/0345.mp3",
    "0400": "https://cdn-kaatan.azurewebsites.net/radio/hora/0400.mp3",
    "0415": "https://cdn-kaatan.azurewebsites.net/radio/hora/0415.mp3",
    "0430": "https://cdn-kaatan.azurewebsites.net/radio/hora/0430.mp3",
    "0445": "https://cdn-kaatan.azurewebsites.net/radio/hora/0445.mp3",
    "0500": "https://cdn-kaatan.azurewebsites.net/radio/hora/0500.mp3",
    "0515": "https://cdn-kaatan.azurewebsites.net/radio/hora/0515.mp3",
    "0530": "https://cdn-kaatan.azurewebsites.net/radio/hora/0530.mp3",
    "0545": "https://cdn-kaatan.azurewebsites.net/radio/hora/0545.mp3",
    "0600": "https://cdn-kaatan.azurewebsites.net/radio/hora/0600.mp3",
    "0615": "https://cdn-kaatan.azurewebsites.net/radio/hora/0615.mp3",
    "0630": "https://cdn-kaatan.azurewebsites.net/radio/hora/0630.mp3",
    "0645": "https://cdn-kaatan.azurewebsites.net/radio/hora/0645.mp3",
    "0700": "https://cdn-kaatan.azurewebsites.net/radio/hora/0700.mp3",
    "0715": "https://cdn-kaatan.azurewebsites.net/radio/hora/0715.mp3",
    "0730": "https://cdn-kaatan.azurewebsites.net/radio/hora/0730.mp3",
    "0745": "https://cdn-kaatan.azurewebsites.net/radio/hora/0745.mp3",
    "0800": "https://cdn-kaatan.azurewebsites.net/radio/hora/0800.mp3",
    "0815": "https://cdn-kaatan.azurewebsites.net/radio/hora/0815.mp3",
    "0830": "https://cdn-kaatan.azurewebsites.net/radio/hora/0830.mp3",
    "0845": "https://cdn-kaatan.azurewebsites.net/radio/hora/0845.mp3",
    "0900": "https://cdn-kaatan.azurewebsites.net/radio/hora/0900.mp3",
    "0915": "https://cdn-kaatan.azurewebsites.net/radio/hora/0915.mp3",
    "0930": "https://cdn-kaatan.azurewebsites.net/radio/hora/0930.mp3",
    "0945": "https://cdn-kaatan.azurewebsites.net/radio/hora/0945.mp3",
    "1000": "https://cdn-kaatan.azurewebsites.net/radio/hora/1000.mp3",
    "1015": "https://cdn-kaatan.azurewebsites.net/radio/hora/1015.mp3",
    "1030": "https://cdn-kaatan.azurewebsites.net/radio/hora/1030.mp3",
    "1045": "https://cdn-kaatan.azurewebsites.net/radio/hora/1045.mp3",
    "1100": "https://cdn-kaatan.azurewebsites.net/radio/hora/1100.mp3",
    "1115": "https://cdn-kaatan.azurewebsites.net/radio/hora/1115.mp3",
    "1130": "https://cdn-kaatan.azurewebsites.net/radio/hora/1130.mp3",
    "1145": "https://cdn-kaatan.azurewebsites.net/radio/hora/1145.mp3",
    "1200": "https://cdn-kaatan.azurewebsites.net/radio/hora/1200.mp3",
    "1215": "https://cdn-kaatan.azurewebsites.net/radio/hora/1215.mp3",
    "1230": "https://cdn-kaatan.azurewebsites.net/radio/hora/1230.mp3",
    "1245": "https://cdn-kaatan.azurewebsites.net/radio/hora/1245.mp3"
}

Radio.TimeControl(Radio.SpeakHour);