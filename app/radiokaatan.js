const Radio = {
    Links: {},
    IsPlaying: false,
    IsChecked: false,
    Volume: 1,
    URL1: "https://kaatan.loca.lt/radio/stream",
    URL2: "https://stream.zeno.fm/sklftdr6odruv",
    GetLinks: (callback) => {
        fetch("../app/links.json").then(res => res.json()).then(links => {
            Radio.Links = links;
            console.log("Links requested");
            callback();
        }).catch(() => {
            Modal.Error("Erro", "Houve um erro ao iniciar a aplicação. Clique em Reiniciar e tente novamente", true, null);
        });
    },
    GetUrl: async () => {
        try {
            const x = await fetch(Radio.URL1);
            if (x.status == 200) return Radio.URL1;
            throw new Error();
        } catch (error) {
            return Radio.URL2;
        }
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
    Stream: async () => {
        if (!Radio.IsPlaying) {
            const radio = document.getElementById("radio");
            radio.setAttribute("type", "audio/mpeg");
            radio.src = await Radio.GetUrl();
            radio.play();
            Radio.IsPlaying = true;
            radio.addEventListener("ended", App.PlayPause);
            radio.addEventListener("error", App.PlayPause);
            radio.onvolumechange = e => {
                if (document.getElementById('radio').volume == 1) {
                    document.getElementById("mute-btn").querySelector("img").src = "../files/volume.svg";
                } else {
                    document.getElementById("mute-btn").querySelector("img").src = "../files/mute.svg";
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
        if (!Radio.IsPlaying) return;
        let id = new Date().toLocaleTimeString().split(":").join("").slice(0, -2);
        if (Number(id) > 1259) id = (Number(id) - 1200).toString().padStart(4, "0");
        const link = Radio.Links[id];
        console.log(link)
        App.Mute();
        const hr = document.getElementById("hr");
        hr.setAttribute("type", "audio/mpeg");
        hr.src = link;
        hr.play();
        hr.onended = Radio.PlayAds;
    },
    PlayAds: async () => {
        if (!Radio.IsPlaying) return;
        App.Mute();
    },
    _: async () => { },
}

Radio.GetLinks(() => Radio.TimeControl(Radio.SpeakHour));