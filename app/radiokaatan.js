const Radio = {
    Links: {},
    IsPlaying: false,
    IsChecked: false,
    Volume: 1,
    URL1: "https://kaatan.loophole.site/radio/stream",
    URL2: "https://stream.zeno.fm/sklftdr6odruv",
    GetLinks: (callback) => {
        fetch("/radio/app/links.json").then(res => res.json()).then(links => {
            Radio.Links = links;
            console.log("Links requested");
            callback();
        });
    },
    TimeControl: async (callback) => {
        const now = new Date();
        const nextQuarterMinute = Math.ceil(now.getMinutes() / 15) * 15;
        let nextQuarterHour = new Date(now);
        nextQuarterHour.setMinutes(nextQuarterMinute % 60);
        if (nextQuarterMinute === 60) {
            nextQuarterHour.setHours(now.getHours() + 1);
        }
        nextQuarterHour.setSeconds(0);
        nextQuarterHour.setMilliseconds(0);
        const timeToNextQuarter = nextQuarterHour - now;
        setTimeout(() => {
            callback();
            setInterval(callback, 15 * 60 * 1000);
        }, timeToNextQuarter);
    },
    Stream: () => {
        if (!Radio.IsPlaying) {
            let radio = document.createElement("audio");
            radio.id = "radio";
            radio.style.display = 'none';
            radio.controls = null;
            radio.autoplay = true;
            radio.setAttribute("type", "audio/mpeg");
            radio.src = Radio.URL1;
            document.body.appendChild(radio);
            radio.play();
            Radio.IsPlaying = true;
            radio.addEventListener("ended", App.PlayPause);
            radio.addEventListener("error", App.PlayPause);
            radio.onvolumechange = e => {
                if (document.getElementById('radio').volume == 1) {
                    document.getElementById("mute-btn").querySelector("img").src = "/radio/files/volume.svg";
                } else {
                    document.getElementById("mute-btn").querySelector("img").src = "/radio/files/mute.svg";
                }
            }
            return true;
        } else {
            document.body.removeChild(document.getElementById('radio'));
            Radio.IsPlaying = false;
            return false;
        }
    },
    SpeakHour: async () => {
        if (!Radio.IsPlaying) return;
        let id = new Date().toLocaleTimeString().split(":").join("").slice(0, -2);
        if (Number(id) > 1259) id = (Number(id) - 1200).toString().padStart(4, "0");
        const link = Radio.Links[id];
        //
        App.Mute();
        //
        let audioElement = document.createElement("audio");
        audioElement.setAttribute("autoplay", true);
        audioElement.style.display = 'none';
        audioElement.controls = null;
        audioElement.autoplay = true;
        audioElement.setAttribute("type", "audio/mpeg");
        audioElement.src = link;
        document.body.appendChild(audioElement);
        audioElement.play();
        audioElement.onended = Radio.PlayAds;
    },
    PlayAds: async () => {
        if (!Radio.IsPlaying) return;
        App.Mute();
    },
    _: async () => { },
}
Radio.GetLinks(() => Radio.TimeControl(Radio.SpeakHour));

