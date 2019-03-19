var IDbManager = (function (){
    const dbName = "ProjectNotesDB";
    const storeName = "project-notes";

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

    var db, data, proj;
    
    // Main functionality
    if (!window.indexedDB) {
        window.alert("Your browser doesn't support a stable version of IndexedDB.");
    } else {
        var request = window.indexedDB.open(dbName, 3);

        request.onupgradeneeded = function (event) {
            db = event.target.result;
            // console.log(db);
            if (!db.objectStoreNames.contains(storeName)) {
                var os = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
                console.log(os);
            }
        };
        request.onsuccess = function (event) {
            // console.log('sucsess');
            db = event.target.result;
            // console.log(db);
            // showContent();
        }
        request.onerror = function (event) {
            //DO something;
        };
    };

    return {
        showContent: function () {
            console.log(data);
        },
        getData: function () {
            var tr = db.transaction([storeName], "readonly");
            var store = tr.objectStore(storeName);
            console.log(store);
            var requestAll = store.getAll();
            console.log(requestAll);
            // var d;
            requestAll.onsuccess = function (event) {
                data = event.target.result;
            }
        },
        exportData: function () {
            var dataToString = JSON.stringify(data);
            var exportFileDbName = 'projects-notes-db';
            download(exportFileDbName, dataToString);
            // console.log(dataToString);
        },
        download: function (filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        importDb: function (evt) {
            var x = document.getElementById("input-file");
            if ('files' in x) {
                var file = x.files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    var content = e.target.result;
                    var importedData = JSON.parse(content);
                    var tr = db.transaction([storeName], "readwrite");
                    var store = tr.objectStore(storeName);
                    for (let index = 0; index < importedData.length; index++) {
                        const element = importedData[index];
                        var req = store.add(element);
                    }
                }
                reader.readAsText(file)
            }
        },
        addProject: function (dataObject) {
            // console.log("accessed");
            var tr = db.transaction([storeName], "readwrite");
            var store = tr.objectStore(storeName);
            
            //Adding
            var req = store.add(dataObject);
            // console.log(req);
            req.onsuccess = () => {
                console.log('project created');
                // getData();
            };
            req.onerror = () => { console.log("something went wrong") };
        },
        getProject:function () {
            var tr = db.transaction([storeName], "readwrite");
            var store = tr.objectStore(storeName);
            var projectGetRequest = store.get(2);
            // console.log(projectToEdit);
            projectGetRequest.onsuccess = function (e) {
                proj = e.target.result;
                console.log(proj);
            }
        },
        editProject: function (editedData) {
            // var tr = db.transaction([storeName], "readwrite");
            // var store = tr.objectStore(storeName);
            // // console.log(proj.id);
            // // proj.client = "VM Petroleum";
    
            // store.put(editedData);
        },
        deleteProject:function (id) {
            var tr = db.transaction([storeName], "readwrite");
            var store = tr.objectStore(storeName);

            store.delete(2);
            
        },
        clearDb:function () {
            console.log('deleting');
            // console.log(db);
            console.log(window.indexedDB);
            var reqDelete = window.indexedDB.deleteDatabase(dbName);
            location.reload();
        }
    };

    
})();

