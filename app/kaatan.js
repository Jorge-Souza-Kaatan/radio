const App = {
    Main: async () => {
        let _ = document.createElement("span");
        console.log("Radio Kaatan | 100% Brasileira!");
        Renderer.Load("bottom-bar").then(bar => {
            BOTTOMBAR.innerHTML = bar;
        });
        Renderer.Load("home").then(bar => {
            APPVIEW.innerHTML = bar;
        });
        APPVIEW.style.alignItems = "center";
        //_.style.borderBlock = "none";
        APPVIEW.style.borderInline = "none";
    },
    PlayPause: () => {
        if (!Radio.IsPlaying) {
            if (Radio.Stream()) {
                document.getElementById("play-btn").querySelector("img").src = "/files/pause.svg";
                document.getElementById("paused").style.display = "none";
                document.getElementById("playing").style.display = "block";
            }
        } else {
            document.getElementById("play-btn").querySelector("img").src = "/files/play.svg";
            document.getElementById("paused").style.display = "block";
            document.getElementById("playing").style.display = "none";
            Radio.Stream();
        }
    },
    Mute: () => {
        if (document.getElementById('radio') != null) {
            if (document.getElementById('radio').volume == 0) {
                document.getElementById('radio').volume = 1;
                document.getElementById("mute-btn").querySelector("img").src = "/files/volume.svg";
            } else {
                document.getElementById('radio').volume = 0;
                document.getElementById("mute-btn").querySelector("img").src = "/files/mute.svg";
            }
        }
    },
    About: async () => { },
    LOOP: () => {
        setTimeout(App.LOOP, 1999);
    },
    _: async () => { },
}