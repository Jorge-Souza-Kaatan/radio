const Radio = {
    Links: {},
    IsPlaying: false,
    IsChecked: false,
    Volume: 1,
    FallbackURL: false,
    GetLinks: (callback) => {
        fetch("/radio/app/links.json").then(res => res.json()).then(links => {
            Radio.Links = links;
            console.log("Links requested");
            callback();
        }).catch(() => {
            Modal.Error("Erro", "Houve um erro ao iniciar a aplicação. Clique em Reiniciar e tente novamente", true, null);
        });
    },
    
    /** @description OBSOLETTE! */
    /*
    GetUrl: async () => {
        try {
            const x = await fetch(Radio.URL1);
            if (x.status == 200) {
                Radio.FallbackURL = false;
                return Radio.URL1;
            }
            throw new Error();
        } catch (error) {
            Radio.FallbackURL = true;
            return Radio.URL2;
        }
    },
    */
    
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
                    document.getElementById("mute-btn").querySelector("img").src = "/radio/files/volume.svg";
                } else {
                    document.getElementById("mute-btn").querySelector("img").src = "/radio/files/mute.svg";
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
        if (!Radio.IsPlaying || Radio.FallbackURL) return;
        App.Mute();
    },
    _: async () => { },
}

Radio.GetLinks(() => Radio.TimeControl(Radio.SpeakHour));