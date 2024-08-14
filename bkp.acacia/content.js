const Content = {
    LoadJSON: async (path) => {
        return new Promise((resolve, reject) => {
            fetch(path)
                .then(response => response.json()).then(data => {
                    resolve(data);
                }).catch(() => {
                    reject(null);
                });
        });
    },
    LoadTXT: async (path) => {
        return new Promise((resolve, reject) => {
            fetch(path)
                .then(response => response.text()).then(data => {
                    resolve(data);
                }).catch(() => {
                    reject(null);
                });
        });
    },
    ImageHandler: {
        /**@description Resizes an image and returns the base64 data src*/
        ResizeImg: (imageElement, w, h) => {
            let newImg = new Image();
            let canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(imageElement, 0, 0, w, h);
            newImg.src = canvas.toDataURL();
            return newImg;
        }
    },
    TextHandler: {
        /** @description Verificar o tamanho dos dados, em MB */
        Size: async (data) => {
            let bytes;
            let encoder = new TextEncoder();

            if (typeof (data) == "string") {
                bytes = encoder.encode(data).length;
            } else if (typeof (data) == "number" || typeof (data) == "bigint" || typeof (data) == "boolean") {
                bytes = encoder.encode(JSON.stringify([data])).length;
            } else if (typeof (data) == "object") {
                bytes = encoder.encode(JSON.stringify(data)).length;
            } else {
                return -1;
            }
            return (bytes / (1024 * 1024));
        },
        CurrencyConverter: (txt, format) => {
            let value = txt.replace(/\D/g, '');
            if (value.length === 0) {
                value = '';
                return;
            }
            value = (parseInt(value, 10) / 100).toFixed(2);
            value = value.replace('.', ',');
            if (format) return `R$: ${value}`;
            return value;
        },
    },
    HTMLHandler: {},
    AudioHandler: {},
    BufferHandler: {},
    DataTransferHandler: {},
    IndexedDB: {
        /** @description Create tables if not exists */
        New: (dbName, tableName) => {
            const request = indexedDB.open(dbName, 1);
            request.onupgradeneeded = e => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(tableName)) {
                    db.createObjectStore(tableName, { keyPath: "id" });
                }
            };
        },
    
        /** @description Check if a record exists */
        Check: async (dbName, tableName, id) => {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName);
    
                request.onupgradeneeded = e => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(tableName)) {
                        reject(`Database error: ${e.target.error}`);
                    }
                };
    
                request.onerror = (event) => {
                    reject(`Database error: ${event.target.error}`);
                };
    
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    const transaction = db.transaction(tableName, "readonly");
                    const store = transaction.objectStore(tableName);
                    const query = store.get(id);
    
                    query.onerror = (event) => {
                        reject(`Request error: ${event.target.error}`);
                    };
    
                    query.onsuccess = (event) => {
                        resolve(!!event.target.result);
                    };
                };
            });
        },
    
        /** @description Record or update an object */
        Write: async (dbName, tableName, tableData, objId) => {
            return new Promise((resolve, reject) => {
                Data.New(tableName);
                const request = indexedDB.open(dbName, 1);
                request.onerror = e => {
                    reject(`Request error: ${e.target.error}`);
                };
                request.onsuccess = e => {
                    const db = e.target.result;
                    const store = db.transaction(tableName, "readwrite").objectStore(tableName);
                    const query = store.put({ id: objId, data: tableData });
                    query.onerror = e => {
                        reject(`Request error: ${e.target.error}`);
                    }
                    query.onsuccess = e => {
                        resolve(true);
                    }
                };
            });
        },
    
        /** @description Retrieve an object from the table */
        Read: async (dbName, tableName, id) => {
            return new Promise((resolve, reject) => {
                Data.New(tableName);
                const request = indexedDB.open(dbName, 1);
    
                request.onerror = e => {
                    reject(`Database error: ${e.target.error}`);
                }
    
                request.onsuccess = e => {
                    const db = e.target.result;
                    // Inserir dados:
                    const store = db.transaction(tableName, "readonly").objectStore(tableName);
    
                    const query = store.get(Number(id));
                    query.onerror = (event) => {
                        reject(`Request error: ${event.target.error}`);
                    };
                    query.onsuccess = (event) => {
                        const result = event.target.result
                        resolve(result.data);
                    };
                };
            });
        },
    
        /** @description Delete an object from the table */
        Remove: async (tableName, id) => {
            return new Promise((resolve, reject) => {
                Data.New(tableName);
                const request = indexedDB.open(dbName);
    
                request.onerror = e => {
                    reject(`Database error: ${e.target.error}`);
                };
    
                request.onsuccess = e => {
                    const db = e.target.result;
                    const store = db.transaction(tableName, 'readwrite').objectStore(tableName);
                    const query = store.delete(id);
    
                    query.onerror = e => {
                        reject(`Request error: ${e.target.errorCode}`);
                    };
    
                    query.onsuccess = e => {
                        resolve(true);
                    };
                };
            });
        }
    },
    HTTP: {
        Get: async (path) => {
            let res = await fetch(path, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            return await res.json();
        },
        Post: async (path, _body) => {
            let res = await fetch(path, {
                method: "POST",
                body: JSON.stringify(_body),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            return await res.json();
        },
    }
}
window.Content = Content;