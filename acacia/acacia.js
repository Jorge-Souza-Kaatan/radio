//#region Id Control
const IdControl = {
    Elements: [],
    Id: {
        AcaciaContainer: 0,
        Tooltip: 0,
        ContextMenu: 0,
        Popover: 0,
        Toast: 0,
        DataGrid: 0,
        Modal: 0
    },
    Type: {
        AcaciaContainer: "ac",
        Tooltip: "tt",
        Context: "cm",
        ProfilePopover: "pp",
        Toast: "ts",
        DataGrid: "dg",
        Modal: "md"
    },
    NextId: (type) => {
        return `${type}-${++IdControl.Id[type]}`;
    }
}
//#endregion

//#region CLASS DEFINITIONS
class AcaciaApp extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const head = document.querySelector("head");
        const acaciaCSS = document.createElement("style");
        acaciaCSS.setAttribute("rel", "stylesheet");
        acaciaCSS.setAttribute("href", "/acacia/acacia.css");
        head.appendChild(acaciaCSS);

        const acaciaApp = this;
        const topBar = document.createElement("app-top-bar");
        topBar.id = "top-bar";
        const topBarMenuIcon = document.createElement("img");
        topBarMenuIcon.id = "menu-icon";
        topBarMenuIcon.onclick = Renderer.SideMenu.Show;
        topBarMenuIcon.src = "/files/menu.svg";
        const topBarIconsContainer = document.createElement("icons-container");
        const topBarLogo = document.createElement("img");
        topBarLogo.src = "/files/conjunto_branco.svg"
        topBarLogo.id = "topbar-logo";
        topBarLogo.onclick = async () =>  window.location.reload();
        topBarIconsContainer.appendChild(topBarLogo);
        topBar.appendChild(topBarIconsContainer);
        topBar.appendChild(topBarMenuIcon);
        acaciaApp.appendChild(topBar);
        //
        const app = document.createElement("app-main");
        app.id = "app";
        const bottomBar = document.createElement("app-bottom-bar");
        bottomBar.id = "bottom-bar";
        acaciaApp.appendChild(app);
        acaciaApp.appendChild(bottomBar);

        const leftBar = document.createElement("left-bar");
        leftBar.id = "left-bar";
        const rightBar = document.createElement("right-bar");
        rightBar.id = "right-bar";
        const appView = document.createElement("app-view");
        appView.id = "app-view";
        const splash = document.createElement("splash-screen");
        splash.id = "splash-screen";
        app.appendChild(leftBar);
        app.appendChild(appView);
        app.appendChild(rightBar);

        acaciaApp.appendChild(splash);

        window.ACACIA = acaciaApp;
        window.APP = app;
        window.BOTTOMBAR = bottomBar;
        window.TOPBAR = topBarIconsContainer;
        window.LEFTBAR = leftBar;
        window.RIGHTBAR = rightBar;
        window.APPVIEW = appView;
    }
} customElements.define("acacia-app", AcaciaApp);

class Accordion extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.querySelectorAll('accordion-item').forEach(item => {
            const title = item.querySelector('accordion-title');
            title.classList.add("soft-elastic");
            const content = item.querySelector('accordion-content');
            content.style.display = 'none';
            item.querySelector('accordion-title').onclick = () => {
                const visible = content.style.display != 'none';
                this.querySelectorAll('accordion-item').forEach(item_ => {
                    item_.querySelector('accordion-content').style.display = 'none';
                });
                this.querySelectorAll('accordion-item').forEach(item_ => {
                    const title_ = item_.querySelector('accordion-title')
                    title_.textContent = title_.textContent.replace("▾", "▸");
                    title_.style.marginLeft = "10px";
                });
                // Se o conteúdo clicado não estava visível, exibe-o:
                if (!visible) {
                    content.style.display = 'block';
                    title.textContent = title.textContent.replace("▸", "▾");
                    title.style.marginLeft = "0px";
                }
            };
        });
    }
} customElements.define("kaatan-accordion", Accordion);

class CardBig extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.classList.add("elastic");
        this.classList.add("hoverable");
    }
} customElements.define("card-big", CardBig);

class ButtonRounded extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.classList.add("elastic");
    }
} customElements.define("button-rounded", ButtonRounded);

class ButtonSquared extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.classList.add("elastic");
    }
} customElements.define("button-squared", ButtonSquared);

class TxtLink extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        let ref = this.getAttribute("href");
        if (ref) {
            let target = this.getAttribute("target");
            this.onclick = e => {
                if (target == "_blank") {
                    window.open(ref);
                } else {
                    window.location.replace(ref);
                }
            }
        }
    }
} customElements.define("text-link", TxtLink);

class ToastMini extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        if (this.getAttribute("autoclose") != null) {
            setTimeout(() => {
                try { document.body.removeChild(this) } catch { }
            }, (Number(this.getAttribute("autoclose")) * 1000));
        }
    }
} customElements.define("toast-mini", ToastMini);;

class AppDrawerGroup extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.setAttribute('groupcollapsed', 'false');
    }
} customElements.define("app-drawer-group", AppDrawerGroup);

class GroupTitle extends HTMLElement {
    constructor() {
        super();
        let element = this;
        element.onclick = () => {
            let group = element.parentElement.querySelectorAll("app-drawer-row");
            if (element.parentElement.getAttribute('groupcollapsed') == 'true') {
                group.forEach(el => {
                    el.style.display = 'flex';
                    el.parentElement.setAttribute('groupcollapsed', 'false');
                });
                element.innerHTML = element.innerHTML.replaceAll('▸', '▾');
            } else {
                group.forEach(el => {
                    el.style.display = 'none';
                    el.parentElement.setAttribute('groupcollapsed', 'true');
                });
                element.innerHTML = element.innerHTML.replaceAll('▾', '▸');
            }
            //element = null;
        }
    }
} customElements.define("group-title", GroupTitle);
//#endregion

//#region TOOLTIP
const Tooltip = {
    Tooltip: (txt, element) => {
        const tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');
        tooltip.innerText = txt;
        if (document.getElementsByClassName('tooltip').length > 0) {
            document.body.removeChild(document.getElementsByClassName('tooltip')[0]);
        }
        document.body.appendChild(tooltip);

        const x = event.clientX;
        const y = event.clientY;

        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let left = x + 10;
        let top = y + 10;

        if (left + tooltipWidth > windowWidth) {
            left = x - tooltipWidth - 10;
        }

        if (top + tooltipHeight > windowHeight) {
            top = y - tooltipHeight - 10;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.display = 'block';

        element.addEventListener('mouseout', () => {
            try { document.body.removeChild(tooltip) } catch { }
        });
    },
    Context: (content) => {
        // Creation:
        const context = document.createElement('span');
        context.classList.add('context');
        //
        // Content setting:
        for (const menu of content) {
            let button = document.createElement("button-squared");
            button.onclick = () => ContextFunc(menu.Action);
            let img = document.createElement("img");
            img.src = menu.Ico;
            let span = document.createElement("span");
            span.innerHTML = menu.Title;
            button.appendChild(img);
            button.appendChild(span);
            context.appendChild(button);
        }
        //
        // Viewing setting:
        if (document.getElementsByClassName('context').length > 0) {
            document.body.removeChild(
                document.getElementsByClassName('context')[0]
            );
        }

        let cc = document.createElement("div");
        cc.style.position = "fixed";
        cc.style.top = "0";
        cc.style.left = "0";
        cc.style.width = "100vw";
        cc.style.height = "100vh";
        cc.style.zIndex = "1000";

        cc.appendChild(context);
        document.body.appendChild(cc);
        const x = event.clientX;
        const y = event.clientY;
        const contextWidth = context.offsetWidth;
        const contextHeight = context.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        let left = x + 10;
        let top = y + 10;
        if (left + contextWidth > windowWidth) left = x - contextWidth - 10;
        if (top + contextHeight > windowHeight) top = y - contextHeight - 10;
        context.style.left = `${left}px`;
        context.style.top = `${top}px`;
        context.style.display = 'block';

        cc.addEventListener('click', e => {
            // Verifica se o clique foi fora do elemento filho
            if (!context.contains(e.target)) {
                document.body.removeChild(cc);
            }
        });
        function ContextFunc(callback) {
            callback();
            document.body.removeChild(cc);
        }
    },
    ProfilePopover: (user, element) => {
        const tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');

        let tooltipProfile = document.createElement("tooltip-profile");

        let img = document.createElement("img");
        img.src = user["Thumbnail"];
        let tooltipProfilePic = document.createElement("tooltip-profile-pic");
        tooltipProfilePic.appendChild(img);
        tooltipProfile.appendChild(tooltipProfilePic);

        let tooltipProfileName = document.createElement("profile-name");
        tooltipProfileName.innerHTML = user["Name"];
        let tooltipProfileUsername = document.createElement("profile-username");
        tooltipProfileUsername.innerHTML = user["Username"];
        let tooltipProfileData = document.createElement("profile-data");
        tooltipProfileData.appendChild(tooltipProfileName);
        tooltipProfileData.appendChild(tooltipProfileUsername);
        tooltipProfile.appendChild(tooltipProfileData);
        tooltip.appendChild(tooltipProfile);

        if (document.getElementsByClassName('tooltip').length > 0) document.body.removeChild(document.getElementsByClassName('tooltip')[0]);
        document.body.appendChild(tooltip);
        const x = event.clientX;
        const y = event.clientY;
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        let left = x + 10;
        let top = y + 10;
        if (left + tooltipWidth > windowWidth) left = x - tooltipWidth - 10;
        if (top + tooltipHeight > windowHeight) top = y - tooltipHeight - 10;
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.display = 'block';
        element.addEventListener('mouseout', () => { try { document.body.removeChild(tooltip) } catch { } });
    },
    Toast: (txt, close) => {
        try { document.body.removeChild(document.getElementById("toast-mini")) } catch { };
        let off = document.createElement("toast-mini");
        off.id = "toast-mini";
        off.innerHTML = txt;
        if (close) off.setAttribute("autoclose", close);
        document.body.appendChild(off);
    }
}
//#endregion

//#region MODAL
const Modal = {
    modalId: 0,
    callback: null,
    ESCKey: (e) => {
        if (e.key == "Escape") {
            Modal.Close(Modal.modalId);
            if (Modal.callback != null) Modal.callback();
        }
    },
    Close: (id) => {
        try {
            //let el = document.getElementById("modal-container");
            let el = document.querySelector(`[modal-id=${id}]`);
            document.body.removeChild(el);
            window.removeEventListener("keydown", Modal.ESCKey);
            Modal.modalId--;
        } catch (e) { }
    },

    Waiting: (title, msg, callback = null) => {
        return new Promise(resolve => {
            let modal = document.createElement("div");
            modal.setAttribute("class", "modal-container");
            let id = `modal-id-${++Modal.modalId}`;
            modal.setAttribute("modal-id", id);
    
            modal.id = "modal-container";
            let box = document.createElement("div");
            box.id = "modal-box";
            modal.appendChild(box);
    
            let close = document.createElement("span");
            close.id = "modal-close";
            close.innerHTML = "&times;";
            close.onclick = () => {
                Modal.Close(id);
                resolve(false);
                if (callback != null) callback();
            };
            box.appendChild(close);
    
            let h1 = document.createElement("h1");
            h1.id = "modal-title";
            h1.innerHTML = title;
            box.appendChild(h1);
    
            let anm = document.createElement("div");
            anm.id = "animation-container";
            let img = document.createElement("img");
            img.setAttribute("src", "/acacia/loading.svg");
            anm.appendChild(img);
            box.appendChild(anm);
    
            let p = document.createElement("p");
            p.id = "modal-content";
            p.setAttribute("style", "text-align: center; text-indent: 0;");
            p.innerHTML = msg;
            box.appendChild(p);
            document.body.appendChild(modal);
    
            window.addEventListener("keydown", Modal.ESCKey);
        });
    },

    Message: (title, msg, callback = null) => {
        return new Promise(resolve => {
            let modal = document.createElement("div");
            modal.setAttribute("class", "modal-container");
            modal.id = "modal-container";
            let id = `modal-id-${++Modal.modalId}`;
            modal.setAttribute("modal-id", id);
    
            let modalBox = document.createElement("div");
            modalBox.setAttribute("id", "modal-box");
    
            let modalTitle = document.createElement("h1");
            modalTitle.setAttribute("id", "modal-title");
            modalTitle.innerHTML = title;
    
            let modalContent = document.createElement("p");
            modalContent.setAttribute("id", "modal-content");
            modalContent.innerHTML = msg;
    
            let modalButtonsContainer = document.createElement("div");
            modalButtonsContainer.setAttribute("id", "modal-buttons-container");
    
            let confirmButton = document.createElement("button-squared");
            confirmButton.onclick = () => {
                Modal.Close(id);
                resolve(true);
                if (callback != null) callback();
            };
            confirmButton.innerHTML = "Confirmar";
    
            let span = document.createElement("span");
    
            modalButtonsContainer.appendChild(span);
            modalButtonsContainer.appendChild(confirmButton);
    
            modalBox.appendChild(modalTitle);
            modalBox.appendChild(modalContent);
            modalBox.appendChild(modalButtonsContainer);
    
            modal.appendChild(modalBox);
    
            document.body.appendChild(modal);
            window.addEventListener("keydown", Modal.ESCKey);
        });
    },

    Error: (title, msg, fatal, callback = null) => {
        return new Promise(resolve => {
            let modal = document.createElement("div");
            modal.setAttribute("class", "modal-container");
            modal.id = "modal-container";
            let id = `modal-id-${++Modal.modalId}`;
            modal.setAttribute("modal-id", id);
    
            let modalBox = document.createElement("div");
            modalBox.setAttribute("id", "modal-box");
    
            let modalClose = document.createElement("span");
            modalClose.setAttribute("id", "modal-close");
            modalClose.innerHTML = "&times;";
            modalClose.onclick = () => Modal.Close(id);
    
            let modalTitle = document.createElement("h1");
            modalTitle.setAttribute("id", "modal-title");
            modalTitle.innerHTML = title;
    
            let animationContainer = document.createElement("div");
            animationContainer.setAttribute("id", "animation-container");
    
            let img = document.createElement("img");
            img.setAttribute("src", "/acacia/erro.svg");
    
            animationContainer.appendChild(img);
    
            let modalContent = document.createElement("p");
            modalContent.setAttribute("id", "modal-content");
            modalContent.setAttribute("style", "text-align: center; text-indent: 0;");
            modalContent.innerHTML = msg;
    
            let modalButtonsContainer = document.createElement("div");
            modalButtonsContainer.setAttribute("id", "modal-buttons-container");
    
            let backButton = document.createElement("button-squared");
            backButton.onclick = () => {
                Modal.Close(id);
                resolve(true);
                if (callback != null) callback();
            };
            backButton.innerHTML = "Voltar";
    
            let closeButton = document.createElement("button-squared");
            if (fatal) {
                closeButton.onclick = () => window.location.reload();
                closeButton.innerHTML = "Reiniciar aplicação";
            } else {
                closeButton.innerHTML = "Cancelar";
            }
    
            modalButtonsContainer.appendChild(backButton);
            modalButtonsContainer.appendChild(closeButton);
    
            modalBox.appendChild(modalClose);
            modalBox.appendChild(modalTitle);
            modalBox.appendChild(animationContainer);
            modalBox.appendChild(modalContent);
            modalBox.appendChild(modalButtonsContainer);
    
            modal.appendChild(modalBox);
    
            document.body.appendChild(modal);
            window.addEventListener("keydown", Modal.ESCKey);
        });
    },
    /** @description The action callback is always called */
    Confirm: (title, msg, callback = null) => {
        return new Promise(resolve => {
            let modal = document.createElement("div");
            modal.setAttribute("class", "modal-container");
            modal.id = "modal-container";
            let id = `modal-id-${++Modal.modalId}`;
            modal.setAttribute("modal-id", id);

            let modalBox = document.createElement("div");
            modalBox.setAttribute("id", "modal-box");

            let modalTitle = document.createElement("h1");
            modalTitle.setAttribute("id", "modal-title");
            modalTitle.innerHTML = title;

            let modalContent = document.createElement("p");
            modalContent.setAttribute("id", "modal-content");
            modalContent.innerHTML = msg;

            let modalButtonsContainer = document.createElement("div");
            modalButtonsContainer.setAttribute("id", "modal-buttons-container");

            let confirmButton = document.createElement("button-squared");
            confirmButton.onclick = async () => {
                Modal.Close(id);
                resolve(true);
                if (callback != null) callback();
            };
            confirmButton.innerHTML = "Confirmar";

            let cancelButton = document.createElement("button-squared");
            cancelButton.onclick = async () => {
                Modal.Close(id);
                resolve(false);
                if (callback != null) callback();
            };
            cancelButton.innerHTML = "Cancelar";

            modalButtonsContainer.appendChild(confirmButton);
            modalButtonsContainer.appendChild(cancelButton);

            modalBox.appendChild(modalTitle);
            modalBox.appendChild(modalContent);
            modalBox.appendChild(modalButtonsContainer);

            modal.appendChild(modalBox);

            document.body.appendChild(modal);

            window.addEventListener("keydown", Modal.ESCKey);
        });
    },
    /** @description The action callback is only called if the user confirms */
    ConfirmAction: (title, msg, callback = null) => {
        return new Promise(resolve => {
            let modal = document.createElement("div");
            modal.setAttribute("class", "modal-container");
            modal.id = "modal-container";
            let id = `modal-id-${++Modal.modalId}`;
            modal.setAttribute("modal-id", id);

            let modalBox = document.createElement("div");
            modalBox.setAttribute("id", "modal-box");

            let modalTitle = document.createElement("h1");
            modalTitle.setAttribute("id", "modal-title");
            modalTitle.innerHTML = title;

            let modalContent = document.createElement("p");
            modalContent.setAttribute("id", "modal-content");
            modalContent.innerHTML = msg;

            let modalButtonsContainer = document.createElement("div");
            modalButtonsContainer.setAttribute("id", "modal-buttons-container");

            let confirmButton = document.createElement("button-squared");
            confirmButton.onclick = async () => {
                Modal.Close(id);
                resolve(true);
                if (callback != null) callback();
            };
            confirmButton.innerHTML = "Confirmar";

            let cancelButton = document.createElement("button-squared");
            cancelButton.onclick = async () => {
                Modal.Close(id);
                resolve(false);
            };
            cancelButton.innerHTML = "Cancelar";

            modalButtonsContainer.appendChild(confirmButton);
            modalButtonsContainer.appendChild(cancelButton);

            modalBox.appendChild(modalTitle);
            modalBox.appendChild(modalContent);
            modalBox.appendChild(modalButtonsContainer);

            modal.appendChild(modalBox);

            document.body.appendChild(modal);

            window.addEventListener("keydown", Modal.ESCKey);
        });
    },

    Input: (title, msg, callback = null) => {
        return new Promise((resolve, reject) => {
            let modal = document.createElement("div");
            modal.setAttribute("class", "modal-container");
            modal.id = "modal-container";
            let id = `modal-id-${++Modal.modalId}`;
            modal.setAttribute("modal-id", id);

            let modalBox = document.createElement("div");
            modalBox.setAttribute("id", "modal-box");

            let modalTitle = document.createElement("h1");
            modalTitle.setAttribute("id", "modal-title");
            modalTitle.innerHTML = title;

            let modalContent = document.createElement("p");
            modalContent.setAttribute("id", "modal-content");
            modalContent.innerHTML = msg;

            let modalButtonsContainer = document.createElement("div");
            modalButtonsContainer.setAttribute("id", "modal-buttons-container");

            let confirmButton = document.createElement("button-squared");
            confirmButton.onclick = async () => {
                let res = modalInput.value;
                Modal.Close(id);
                resolve(res);
                if (callback != null) callback();
            };
            confirmButton.innerHTML = "Confirmar";

            let cancelButton = document.createElement("button-squared");
            cancelButton.onclick = async () => {
                Modal.Close(id);
                resolve("");
                if (callback != null) callback();
            };
            cancelButton.innerHTML = "Cancelar";

            modalButtonsContainer.appendChild(confirmButton);
            modalButtonsContainer.appendChild(cancelButton);

            let modalInput = document.createElement("input");
            modalInput.classList = "kaatan-input";

            modalBox.appendChild(modalTitle);
            modalBox.appendChild(modalContent);
            modalBox.appendChild(modalInput);
            modalBox.appendChild(modalButtonsContainer);

            modal.appendChild(modalBox);

            document.body.appendChild(modal);

            window.addEventListener("keydown", Modal.ESCKey);
            function resolveInput(e) {
                if (e.key == "Enter") {
                    Modal.Close(id);
                    resolve(modalInput.value);
                    if (callback != null) callback();
                    window.removeEventListener("keydown", resolveInput);
                }
            }
            window.addEventListener("keydown", resolveInput);
            modalInput.focus();
        });
    },
    Window: (title, content) => {
        let modal = document.createElement("acacia-container");
        modal.id = "modal-container";
        let id = `modal-id-${++Modal.modalId}`;
        modal.setAttribute("modal-id", id);

        let modalWnd = document.createElement("grid-column");
        modalWnd.setAttribute("id", "modal-window");

        let modalTitleBar = document.createElement("span");
        modalTitleBar.style.display = "grid";
        modalTitleBar.style.gridTemplateColumns = "1fr auto";
        modalTitleBar.style.alignItems = "center";
        modalTitleBar.style.width = "100%";
        
        let close = document.createElement("span");
        close.id = "modal-close";
        close.innerHTML = "&times;";
        close.onclick = () => Modal.Close(id);
        
        let modalTitle = document.createElement("text-subheading");
        modalTitle.setAttribute("id", "modal-title");
        modalTitle.innerHTML = title;
        modalWnd.appendChild(modalTitle);
        modalTitleBar.appendChild(modalTitle);
        modalTitleBar.appendChild(close);
        modalWnd.appendChild(modalTitleBar);
        let contentElement = document.createElement("grid-column");
        contentElement.innerHTML = content;
        modalWnd.appendChild(contentElement);

        modal.appendChild(modalWnd);

        document.body.appendChild(modal);
        window.addEventListener("keydown", Modal.ESCKey);
    }
}
//#endregion

//#region DATAGRID
const DataGrid = {
    allSelected: false,
    selectionCount: 0,
    selectedValues: [],
    sourceLength: 0,

    showDataGrid: (gridID, sourceArr) => {
        DataGrid.sourceLength = sourceArr.length;
        let headers = document.createElement("data-grid-headers");
        headers.onclick = () => DataGrid.selectAll(gridID);
        let head = document.createElement("data-grid-head");
        let input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("id", `${gridID}-chk`);
        head.append(input);
        headers.append(head);

        for (const i of Object.keys(sourceArr[0])) {
            let head = document.createElement("data-grid-head");
            head.innerHTML = i.toString();
            headers.append(head);
        }
        document.getElementById(gridID).appendChild(headers);

        let index = 0;
        for (const obj in sourceArr) {
            let row = document.createElement("data-grid-row");
            let cell = document.createElement("data-grid-cell");
            let input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("id", `${gridID}-chk-${index}`);
            ++index;
            cell.append(input);
            row.append(cell);

            for (const x of Object.values(sourceArr[obj])) {
                let cell = document.createElement("data-grid-cell");
                cell.innerHTML = x.toString();
                row.append(cell);
            }
            row.setAttribute("id", `${gridID}-${obj}`);
            row.onclick = () => DataGrid.selectRow(`${gridID}-${obj}`, `${gridID}`);
            document.getElementById(gridID).appendChild(row);
        }
    },

    selectRow: (rowID, gridID) => {
        let row = document.getElementById(rowID);
        let cells = row.querySelectorAll("data-grid-cell");
        let headers = document.querySelectorAll(`data-grid#${gridID} data-grid-headers data-grid-head`);
        let input = document.querySelector(`#${rowID} input[type="checkbox"]`);
        let obj = {};
        if (input.checked) {
            input.checked = false;
        } else {
            input.checked = true;
        }
        let index = 1;
        for (const i of headers) {
            if (i !== headers.item(0)) {
                let key = i.innerHTML;
                let value = cells.item(index).innerHTML;
                ++index;
                obj[key] = value;
            }
        }
        DataGrid.selectedRows(gridID);
    },

    selectedRows: (gridID) => {
        DataGrid.selectedValues = [];
        let headers = document.querySelectorAll(`data-grid#${gridID} data-grid-headers data-grid-head`);
        let rows = document.querySelectorAll(`data-grid#${gridID} data-grid-row`);

        for (const row of rows) {
            let input = row.querySelector(`input[type="checkbox"]`);
            let cells = row.querySelectorAll("data-grid-cell");
            if (input.checked) {
                let obj = {};
                let index = 1;
                for (const i of headers) {
                    if (i !== headers.item(0)) {
                        let key = i.innerHTML;
                        let value = cells.item(index).innerHTML;
                        ++index;
                        obj[key] = value;
                    }
                }
                DataGrid.selectedValues.push(obj);
            }
        }
        DataGrid.selectionCount = DataGrid.selectedValues.length;
        if (DataGrid.selectedValues.length == DataGrid.sourceLength) {
            DataGrid.allSelected = true;
        } else {
            DataGrid.allSelected = false;
        }
        console.log("Todos selecionado: " + DataGrid.allSelected + "\n Selecionados: " + DataGrid.selectionCount);
        return DataGrid.selectedValues;
    },

    selectAll: (gridID) => {
        DataGrid.selectedValues = [];
        let headers = document.querySelectorAll(`data-grid#${gridID} data-grid-headers data-grid-head`);
        let rows = document.querySelectorAll(`data-grid#${gridID} data-grid-row`);
        let inputAll = document.querySelector(`data-grid #${gridID}-chk`);
        if (inputAll.checked) {
            inputAll.checked = false
        } else {
            inputAll.checked = true;
        }
        for (const row of rows) {
            let input = row.querySelector(`input[type="checkbox"]`);
            let cells = row.querySelectorAll("data-grid-cell");
            if (inputAll.checked) {
                input.checked = true;
                let obj = {};
                let index = 1;
                for (const i of headers) {
                    if (i !== headers.item(0)) {
                        let key = i.innerHTML;
                        let value = cells.item(index).innerHTML;
                        ++index;
                        obj[key] = value;
                    }
                }
                DataGrid.selectedValues.push(obj);
            } else {
                input.checked = false
            }
        }
        DataGrid.selectionCount = DataGrid.selectedValues.length;
        if (DataGrid.selectedValues.length == DataGrid.sourceLength) {
            DataGrid.allSelected = true;
        } else {
            DataGrid.allSelected = false;
        }
        console.log(JSON.stringify(DataGrid.selectedValues, false, 6));
        return DataGrid.selectedValues;
    }
}
//#endregion

class Acacia {
    SideMenuContent;
    constructor(appName = "Acácia App", acceptDrop = false, hideBottomBar = false, sideMenuContent = null, callback = null) {
        this.SideMenuContent = sideMenuContent || null;
        const head = document.querySelector("head");
        head.querySelector("title").innerText = appName;
        document.body.appendChild(document.createElement("acacia-app"));
        window.SideMenuContent = this.SideMenuContent;
        Renderer.Home(acceptDrop, hideBottomBar, callback);
    }
}

window.Modal = Modal;
window.Tooltip = Tooltip;
window.DataGrid = DataGrid;
window.IdControl = IdControl;