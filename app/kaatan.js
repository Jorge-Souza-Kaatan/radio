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
                document.getElementById("play-btn").querySelector("img").src = "/radio/files/pause.svg";
                document.getElementById("paused").style.display = "none";
                document.getElementById("playing").style.display = "block";
            }
        } else {
            document.getElementById("play-btn").querySelector("img").src = "/radio/files/play.svg";
            document.getElementById("paused").style.display = "block";
            document.getElementById("playing").style.display = "none";
            Radio.Stream();
        }
    },
    Mute: () => {
        if (document.getElementById('radio') != null) {
            if (document.getElementById('radio').volume == 0) {
                document.getElementById('radio').volume = 1;
                document.getElementById("mute-btn").querySelector("img").src = "/radio/files/volume.svg";
            } else {
                document.getElementById('radio').volume = 0;
                document.getElementById("mute-btn").querySelector("img").src = "/radio/files/mute.svg";
            }
        }
    },
    About: async () => {
        let _ = document.createElement("span");
        Renderer.Load("about").then(about => {
            APPVIEW.innerHTML = about;
        });
        APPVIEW.style.alignItems = "start";
        //_.style.borderBlock = "none";
        APPVIEW.style.borderInline = "var(--ForegroundElementHover) 1px solid";
    },
    Rules: async () => {
        let _ = document.createElement("span");
        Renderer.Load("rules").then(rules => {
            APPVIEW.innerHTML = rules;
        });
        APPVIEW.style.alignItems = "start";
        APPVIEW.style.borderInline = "var(--ForegroundElementHover) 1px solid";
    },
    AddTrackRequest: async () => {
        let _ = document.createElement("span");
        Renderer.Load("add-request").then(addRequest => {
            APPVIEW.innerHTML = addRequest;
        });
        APPVIEW.style.alignItems = "start";
        APPVIEW.style.borderInline = "var(--ForegroundElementHover) 1px solid";
    },
    RemoveTrackRequest: async () => {
        let _ = document.createElement("span");
        Renderer.Load("remove-request").then(removeRequest => {
            APPVIEW.innerHTML = removeRequest;
        });
        APPVIEW.style.alignItems = "start";
        APPVIEW.style.borderInline = "var(--ForegroundElementHover) 1px solid";
    },
    Terms: async () => {
        let _ = document.createElement("span");
        Renderer.Load("terms").then(terms => {
            APPVIEW.innerHTML = terms;
        });
        APPVIEW.style.alignItems = "start";
        APPVIEW.style.borderInline = "var(--ForegroundElementHover) 1px solid";
    },
    Support: async () => {
        let _ = document.createElement("span");
        Renderer.Load("support").then(support => {
            APPVIEW.innerHTML = support;
        });
        APPVIEW.style.alignItems = "start";
        APPVIEW.style.borderInline = "var(--ForegroundElementHover) 1px solid";
    },
    LOOP: () => {
        setTimeout(App.LOOP, 1999);
    },
    _: async () => { },
}