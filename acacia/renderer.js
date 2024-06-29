const Renderer = {
    Load: async (viewName) => {
        return new Promise((resolve, reject) => {
            fetch(`views/${viewName}`)
                .then(response => response.text()).then(htmlContent => {
                    resolve(htmlContent);
                }).catch(() => {
                    reject(null);
                });
        });
    },
    Home: async (acceptDrop, hideBottomBar, callback = null) => {
        if (Renderer.SideMenu.IsVisible) await Renderer.SideMenu.Show();
        window.oncontextmenu = e => {
            e.preventDefault();
            return false;
        }

        if (acceptDrop) {
            window.removeEventListener('dragenter', Renderer.DropFiles);
            window.addEventListener('dragenter', Renderer.DropFiles);
        }

        window.removeEventListener('pointerdown', Renderer.SideMenu.StartDrag);
        window.removeEventListener('mousedown', Renderer.SideMenu.StartDrag);
        window.removeEventListener('touchstart', Renderer.SideMenu.StartDrag);
        window.addEventListener('pointerdown', Renderer.SideMenu.StartDrag);
        window.addEventListener('mousedown', Renderer.SideMenu.StartDrag);
        window.addEventListener('touchstart', Renderer.SideMenu.StartDrag);

        if (hideBottomBar) {
            Renderer.Layout.TopLayout();
        } else {
            Renderer.Layout.BottomTopLayout();
        }
        APPVIEW.innerHTML = "";
        Renderer.Load("home").then(home => {
            APPVIEW.innerHTML = home;
            setTimeout(() => {
                document.querySelector("acacia-app").removeChild(document.getElementById("splash-screen"));
                if (callback != null) callback();
                setInterval(Renderer.Layout.Verify, 999);
            }, 999);
        });
    },
    DropFiles: async () => {
        window.removeEventListener('dragenter', Renderer.DropFiles);
        try {
            document.body.removeChild(document.querySelector("acacia-container"));
        } catch { }
        let x = document.createElement("acacia-container");
        document.body.appendChild(x);
        const dropContent = await Renderer.Load("drop-files");
        x.outerHTML = dropContent;

        //


        const dropArea = document.getElementById('drop-area');

        // Adiciona as classes de hover quando o usuário passa o arquivo sobre a área de soltar
        dropArea.addEventListener('dragenter', (e) => {
            e.preventDefault();
            dropArea.classList.add('hover');
        });

        // Remove as classes de hover quando o usuário sai da área de soltar
        dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('hover');
        });

        // Impede o comportamento padrão do navegador ao soltar o arquivo sobre a área de soltar
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        // Quando o usuário solta o arquivo sobre a área de soltar
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('hover');

            // Obtém os arquivos soltos pelo usuário
            const files = e.dataTransfer.files;

            // Matrizes para armazenar diferentes tipos de arquivos
            let images = [];
            let audios = [];
            let videos = [];
            let documents = [];

            // Itera sobre os arquivos e os classifica em suas respectivas matrizes
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    images.push(file);
                } else if (file.type.startsWith('audio/')) {
                    audios.push(file);
                } else if (file.type.startsWith('video/')) {
                    videos.push(file);
                } else {
                    documents.push(file);
                }
            }

            // Exibe os arquivos armazenados
            console.log('Imagens:', images);
            console.log('Áudios:', audios);
            console.log('Vídeos:', videos);
            console.log('Documentos:', documents);
            document.body.removeChild(document.getElementById("drop-container"));
        });
    },
    Layout: {
        IsPortraitLayout: true,
        ColorMyLayout: false,
        Verify: () => {
            if (window.innerWidth > window.innerHeight) {
                Renderer.Layout.Landscape();
            } else {
                Renderer.Layout.Portrait();
            }
            if (Renderer.Layout.ColorMyLayout) {
                BOTTOMBAR.style.backgroundColor = "green";
                TOPBAR.style.backgroundColor = "red";
                LEFTBAR.style.backgroundColor = "blue";
                RIGHTBAR.style.backgroundColor = "yellow";
                APPVIEW.style.backgroundColor = "black";
            } else {
                BOTTOMBAR.style.backgroundColor = "transparent";
                TOPBAR.style.backgroundColor = "transparent";
                LEFTBAR.style.backgroundColor = "transparent";
                RIGHTBAR.style.backgroundColor = "transparent";
                APPVIEW.style.backgroundColor = "transparent";
            }
        },
        Landscape: () => {
            APP.style.gridTemplateColumns = "25% 1fr 20%";
            APPVIEW.style.gridColumn = "2";
            LEFTBAR.style.display = "flex";
            RIGHTBAR.style.display = "flex";
            Renderer.Layout.IsPortraitLayout = false;
        },
        Portrait: () => {
            APP.style.gridTemplateColumns = "100%";
            APPVIEW.style.gridColumn = "1";
            LEFTBAR.style.display = "none";
            RIGHTBAR.style.display = "none";
            Renderer.Layout.IsPortraitLayout = true;
        },
        /**@description Shows Bottom and Top Bars */
        BottomTopLayout: () => {
            ACACIA.style.gridTemplateRows = "30px 1fr 40px";
            document.querySelector("#top-bar").style.display = "grid";
            BOTTOMBAR.style.display = "flex";
            APPVIEW.style.height = "calc(100vh - 70px)";
        },
        /**@description Shows only Top Bar */
        TopLayout: () => {
            ACACIA.style.gridTemplateRows = "30px 1fr";
            document.querySelector("#top-bar").style.display = "grid";
            BOTTOMBAR.style.display = "none";
            APPVIEW.style.height = "calc(100vh - 30px)";
        },
        /**@description Hides Bottom and Top Bars */
        CleanLayout: () => {
            ACACIA.style.gridTemplateRows = "1fr";
            document.querySelector("#top-bar").style.display = "none";
            BOTTOMBAR.style.display = "none";
            APPVIEW.style.height = "100vh";
        },
        /* Functions bellow are on Learn App */
        MainTopBar: () => {
            window.TOPBAR.innerHTML = "";
            const ids = ["menu-kt-logo", "", "menu-profile-pic", "menu-mini"];
            const imgsSrc = ["files/conjunto_branco.svg", "", "files/default.svg", "files/menumini.svg"];
            const actions = ["", "", "MyProfile", "MyLearning", ""];
            for (let i = 0; i < 5; i++) {
                const span = document.createElement("span");
                if (ids[i] != "") span.id = ids[i];
                if (i > 1) span.classList.add("menu-button");
                if (actions[i] != "") span.onclick = Renderer[actions[i]];

                const img = document.createElement("img");
                if (imgsSrc[i] != "") {
                    img.src = imgsSrc[i];
                    span.appendChild(img);
                }

                window.TOPBAR.appendChild(span);
            }

            document.getElementById("menu-kt-logo").onclick = e => window.location.reload();
            document.getElementById("menu-mini").onclick = Renderer.Layout.ShowSideMenu;
            document.getElementById("menu-profile-pic").onmouseover = () => Tooltip.Tooltip("Meu perfil", document.getElementById("menu-profile-pic"));
            document.getElementById("menu-learn-pic").onmouseover = () => Tooltip.Tooltip("Meu aprendizado", document.getElementById("menu-learn-pic"));

        },
        BackTopBar: (callback = () => { }) => {
            window.TOPBAR.innerHTML = "";
            const ids = ["menu-back-btn", "", "menu-profile-pic", "menu-learn-pic", "menu-mini"];
            const imgsSrc = ["files/arrow.svg", "", "files/default.svg", "files/book.svg", "files/menumini.svg"];
            const actions = ["", "", "MyProfile", "MyLearning", ""];
            for (let i = 0; i < 5; i++) {
                const span = document.createElement("span");
                if (ids[i] != "") span.id = ids[i];
                if (i > 1) span.classList.add("menu-button");
                if (actions[i] != "") span.onclick = Renderer[actions[i]];

                const img = document.createElement("img");
                if (imgsSrc[i] != "") {
                    img.src = imgsSrc[i];
                    span.appendChild(img);
                }

                window.TOPBAR.appendChild(span);
            }

            document.getElementById("menu-kt-logo").onclick = e => window.location.reload();
            document.getElementById("menu-mini").onclick = Renderer.Layout.ShowSideMenu;
            document.getElementById("menu-back-btn").onclick = callback;
            document.getElementById("menu-profile-pic").onmouseover = () => Tooltip.Tooltip("Meu perfil", document.getElementById("menu-profile-pic"));
            document.getElementById("menu-learn-pic").onmouseover = () => Tooltip.Tooltip("Meu aprendizado", document.getElementById("menu-learn-pic"));
        },
        ClearTopBar: (callback = () => { }) => {
            window.TOPBAR.innerHTML = "";
            //
            const topBarLogo = document.createElement("img");
            topBarLogo.src = "files/conjunto_branco.svg"
            topBarLogo.id = "topbar-logo";
            topBarLogo.onclick = () => window.location.reload();
            TOPBAR.appendChild(topBarLogo);

            //

            /*
            const ids = ["menu-kt-logo", "", "menu-mini"];
            const imgsSrc = ["files/conjunto_branco.svg", "", "files/menumini.svg"];
            for (let i = 0; i < 3; i++) {
                const span = document.createElement("span");
                if (ids[i] != "") span.id = ids[i];
                if (i > 1) span.classList.add("menu-button");

                const img = document.createElement("img");
                if (imgsSrc[i] != "") {
                    img.src = imgsSrc[i];
                    span.appendChild(img);
                }
                window.TOPBAR.appendChild(span);
            }

            document.getElementById("menu-mini").onclick = Renderer.Layout.ShowSideMenu;
            document.getElementById("menu-kt-logo").onclick = e => window.location.reload();
            */
        }
    },
    SideMenu: {
        IsVisible: false,
        StartDragX: false,
        StartDragY: false,
        Show: async () => {
            if (Renderer.SideMenu.IsVisible) {
                try {
                    document.body.removeChild(document.querySelector("side-menu"));
                } catch { }
                Renderer.SideMenu.IsVisible = !Renderer.SideMenu.IsVisible;
            } else {
                // Getting properties
                const Links = window.SideMenuContent.Links;
                const ShowProfileSection = window.SideMenuContent.ShowProfileSection;
                const ProfileSection = window.SideMenuContent.ProfileSection;

                Renderer.SideMenu.IsVisible = !Renderer.SideMenu.IsVisible;
                const sideMenu = document.createElement("side-menu");
                sideMenu.id = "side-menu";
                //const smContent = await Renderer.Load("sidemenu");
                const smOutside = document.createElement("side-menu-outside");
                smOutside.onclick = Renderer.SideMenu.Show;
                sideMenu.appendChild(smOutside);
                //
                const smContainer = document.createElement("side-menu-container");
                sideMenu.appendChild(smContainer);
                const smTitleBar = document.createElement("title-bar");
                const closeBtn = document.createElement("close-button");
                closeBtn.onclick = Renderer.SideMenu.Show;
                const closeBtnImg = document.createElement("img");
                closeBtnImg.src = "files/close.svg";
                closeBtn.appendChild(closeBtnImg);
                smTitleBar.appendChild(closeBtn);
                smContainer.appendChild(smTitleBar);
                //
                if (ShowProfileSection) {
                    const smProfile = document.createElement("side-menu-profile");
                    smProfile.onclick = () => {
                        ProfileSection.Action();
                        Renderer.SideMenu.Show();
                    }
                    const profilePic = document.createElement("side-menu-profile-pic");
                    const profilePicImg = document.createElement("img");
                    profilePicImg.src = ProfileSection.ProfilePic;
                    profilePic.appendChild(profilePicImg);
                    smProfile.appendChild(profilePic);
                    const profileData = document.createElement("profile-data");
                    const sideName = document.createElement("side-name");
                    sideName.innerText = ProfileSection.ProfileName;
                    const sideUsername = document.createElement("side-username");
                    sideUsername.innerText = ProfileSection.ProfileUsername;
                    profileData.appendChild(sideName);
                    profileData.appendChild(sideUsername);
                    smProfile.appendChild(profileData);
                    smContainer.appendChild(smProfile);
                }
                //
                const smItemsContainer = document.createElement("side-menu-items-container");
                Links.forEach(link => {
                    const item = document.createElement("side-menu-item");
                    item.classList.add("elastic");
                    item.onclick = () => {
                        link.LinkAction();
                        Renderer.SideMenu.Show();
                    }
                    const itemIcon = document.createElement("img");
                    itemIcon.src = link.LinkIcon;
                    const itemTitle = document.createElement("text-label");
                    itemTitle.innerText = link.LinkTile.length > 20 ? link.LinkTile.substring(0, 20) : link.LinkTile;
                    item.appendChild(itemIcon);
                    item.appendChild(itemTitle);
                    smItemsContainer.appendChild(item);
                });
                smContainer.appendChild(smItemsContainer);
                //
                document.body.appendChild(sideMenu);
            }
        },
        StartDrag: (event) => {
            if (event.clientX >= window.innerWidth / 2) {
                Renderer.SideMenu.StartDragX = event.clientX;
                Renderer.SideMenu.StartDragY = event.clientY;
                window.addEventListener('mouseup', Renderer.SideMenu.EndDrag);
                window.addEventListener('pointerup', Renderer.SideMenu.EndDrag);
                window.addEventListener('touchend', Renderer.SideMenu.EndDrag);
            }
        },
        EndDrag: (event) => {
            window.removeEventListener('mouseup', Renderer.SideMenu.EndDrag);
            window.removeEventListener('pointerup', Renderer.SideMenu.EndDrag);
            window.removeEventListener('touchend', Renderer.SideMenu.EndDrag);
            if (Renderer.SideMenu.IsVisible) return;
            const distanceX = Math.abs(event.clientX - Renderer.SideMenu.StartDragX);
            const distanceY = Math.abs(event.clientY - Renderer.SideMenu.StartDragY);
            if (distanceX >= 75 && distanceY <= 50) Renderer.SideMenu.Show();
        },
    },
    VCard: {
        VCardContent: {
            HTML: "",
            Userid: "",
            Username: "",
            Name: "",
            Profilelink: "",
            Thumb: "",
        },
        Import: async () => {
            return new Promise((resolve, reject) => {
                let input = document.createElement('input');
                input.type = "file";
                input.addEventListener('input', function (event) {
                    let file = event.target.files[0];
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        let fake = document.createElement("div");
                        Renderer.VCard.VCardContent.HTML = atob(e.target.result);
                        fake.innerHTML = Renderer.VCard.VCardContent.HTML;
                        Renderer.VCard.VCardContent.Userid = fake.querySelector("#userid").innerText;
                        Renderer.VCard.VCardContent.Username = fake.querySelector("#k-prf-username").innerText;
                        Renderer.VCard.VCardContent.Name = fake.querySelector("#k-prf-name").innerText;
                        Renderer.VCard.VCardContent.Profilelink = fake.querySelector("#profile-link").innerText;
                        Renderer.VCard.VCardContent.Thumb = fake.querySelector("#k-prf-pic-img").src;
                        fake = null;
                        Renderer.VCard.Show(Renderer.VCard.VCardContent);
                        resolve(Renderer.VCard.VCardContent);
                    };
                    reader.readAsText(file);
                });
                input.click();
            });
        },
        Show: async (vcardData) => {
            console.log(vcardData)
            let cardContainer = document.createElement("acacia-container");
            let vcard = await Renderer.Load("vcard");
            cardContainer.innerHTML = vcard;
            cardContainer.querySelector("#userid").innerText = vcardData.Userid;
            cardContainer.querySelector("#k-prf-username").innerText = vcardData.Username;
            cardContainer.querySelector("#k-prf-name").innerText = vcardData.Name;
            cardContainer.querySelector("#profile-link").innerText = vcardData.Profilelink;
            cardContainer.querySelector("#k-prf-pic-img").src = vcardData.Thumb;
            cardContainer.querySelector("#k-vcard-btns").style.display = "block";
            cardContainer.querySelector("#vcard-btn-profile").href = vcardData.Profilelink;
            cardContainer.querySelector("#vcard-btn-share").href = "javascript:void(0)";
            cardContainer.querySelector("#vcard-btn-share").onclick = e => Renderer.VCard.Save(vcardData);
            cardContainer.querySelector("#vcard-btn-copy").onclick = e => {
                Tooltip.Toast("Nome de usuário copiado para a área de trasferência", 5);
                navigator.clipboard.writeText(vcardData.Username);
            };
            let x = document.createElement("span");
            x.style = "display: grid; place-items: center; position: fixed; right: 0; top: 0; font-size: 40px; z-index: 1000; background-color: #DD2080; color: white; padding: 0 10px 0 10px; cursor: pointer;";
            x.innerHTML = "&#10006;";
            cardContainer.appendChild(x);
            cardContainer.querySelector("#vcard-btn-copy").href = "javascript:void(0)";
            x.onclick = e => document.body.removeChild(cardContainer);
            document.body.appendChild(cardContainer);
        },
        Save: async (vcardData) => {
            let x = await Renderer.Load("vcard");
            let fake = document.createElement("div");
            fake.innerHTML = x;
            fake.querySelector("#userid").innerText = vcardData.Userid;
            fake.querySelector("#k-prf-username").innerText = vcardData.Username;
            fake.querySelector("#k-prf-name").innerText = vcardData.Name;
            fake.querySelector("#profile-link").innerText = vcardData.Profilelink;
            fake.querySelector("#k-prf-pic-img").src = vcardData.Thumb;
            const cardContent = btoa(fake.innerHTML);
            fake = null;
            const a = document.createElement("a");
            a.download = vcardData.Username + ".kaatanvcard";
            a.href = URL.createObjectURL(new Blob([cardContent], { type: "text/plain" }));
            a.click();
        },
        Share: () => { },
    },
    Emojis: {
        Insert: (textBox, emoji) => {
            var posicaoCursor = textBox.selectionStart;
            var textoAntes = textBox.value.substring(0, posicaoCursor);
            var textoDepois = textBox.value.substring(posicaoCursor);
            textBox.value = textoAntes + emoji + textoDepois;
            textBox.selectionStart = textBox.selectionEnd = posicaoCursor + emoji.length;
        },
        heart: [
            '❤', '🧡', '💓', '💔', '💕', '💖', '💗', '💘', '💙', '💚', '💛', '💜', '💝', '💞', '💟', '🖤', '🤍', '🤎', '💌', '💒', '💋', '👄', '💏', '💑'
        ],
        smiles: [
            '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈', '😉', '😊', '😋', '😌', '😍', '😎', '😏', '😐', '😑', '😒', '😓', '😔', '😕', '😖', '😗', '😘', '😙', '😚', '😛', '😜', '😝', '😞', '😟', '😠', '😡', '😢', '😣', '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬', '😭', '😮', '😯', '😰', '😱', '😲', '😳', '😴', '😵', '😶', '😷'
        ],
        "smiles-extra": [
            '😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿', '🙀', '🙈', '🙉', '🙊', '🙁', '🙂', '🙃', '🙄', '🤐', '🤑', '🤒', '🤓', '🤔', '🤕', '🤗', '🤠', '🤢', '🤣', '🤤', '🤥', '🤧', '🤨', '🤩', '🤪', '🤫', '🤭', '🤮', '🤯', '🥰', '🥱', '🥳', '🥴', '🥵', '🥶', '🥺', '🧐'
        ],
        hands: [
            '✋', '👋', '🖐', '🖖', '🤚', '☝', '👆', '👇', '👈', '👉', '🖕', '✊', '👊', '👍', '👎', '🤛', '🤜', '✌', '👌', '🤏', '🤘', '🤙', '🤞', '🤟', '✍', '👏', '👐', '💅', '🤝', '🤝', '🤲', '🤳'
        ],
        people: [
            '👮', '👯', '👰', '👲', '👳', '👷', '👸', '🕴', '🕵', '💁', '💂', '💃', '🤴', '🤵', '👪', '👫', '👬', '👭', '💏', '💑', '🤰', '🤱', '👤', '👥', '👦', '👧', '👨', '👩', '👱', '👴', '👵', '👶', '🕺', '🧍', '🧎', '🧑', '🧒', '🧓', '🧔', '🧕', '🧖', '🧗', '🧘', '🦰', '🦱', '🦲', '🦳', '💆', '💇', '🙅', '🙆', '🙇', '🙋', '🙌', '🙍', '🙎', '🙏', '🤦', '🤱', '🤷', '🧏', '🙈', '🙉', '🙊', '🎅', '👹', '👺', '👻', '👼', '👽', '👾', '👿', '💀', '🤖', '🤡', '🤶', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '👀', '👁', '👂', '👃', '👄', '👅', '👣', '💪', '🦴', '🦵', '🦶', '🦷', '🦻', '🦼', '🦽', '🦾', '🦿', '🧠'
        ],
        celebration: ['🎀',
            '🎁', '🎂', '🎃', '🎄', '🎅', '🎆', '🎇', '🎈', '🎉', '🎊', '🎋', '🎌', '🎍', '🎎', '🎏', '🎐', '🎑', '🎒', '🎓', '🎔', '🎕', '🎖', '🎗', '🧧', '🧨', '🎟', '🎠', '🎡', '🎢', '🎨', '🎪', '🎫', '🎭', '💯'
        ]
    }
}
window.Renderer = Renderer;