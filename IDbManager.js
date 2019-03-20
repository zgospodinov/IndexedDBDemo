var IDbManager = (function () {
  let dbName = 'defaultDb'
  let storeName = 'default-store'
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
  // Main functionality
  var db, data, proj
  function initiateDataBase (dbn, dbstoren) {
    // console.log('initialization of db')
    if (dbn !== undefined) {
      dbName = dbn  
    }
    if (dbstoren !== undefined) {
      storeName = dbstoren
    }
    if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB.")
    } else {
      var request = window.indexedDB.open(dbName, 3)
      request.onupgradeneeded = function (event) {
        db = event.target.result
        // console.log(db)
        if (!db.objectStoreNames.contains(storeName)) {
          var os = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true })
        // console.log(os)
        }
      }
      request.onsuccess = function (event) {
        // console.log('sucsess')
        db = event.target.result
      // console.log(db)
      // showContent()
      }
      request.onerror = function (event) {
        // DO something
      }
    }
  }
  return {
    objectDataAdded: false,
    initDb: function (IDB_NAME, IDB_STORE_NAME) {
      initiateDataBase(IDB_NAME, IDB_STORE_NAME)
    },
    showContent: function () {
      console.log(data)
    },
    getData: function () {
      var tr = db.transaction([storeName], 'readonly')
      var store = tr.objectStore(storeName)
      return store.getAll()
    },
    exportData: function () {
      //   this.getData()
      var tr = db.transaction([storeName], 'readonly')
      var store = tr.objectStore(storeName)
      var requestAll = store.getAll()
      var idbMan = this
      requestAll.onsuccess = function (event) {
        var records = event.target.result
        var dataToString = JSON.stringify(records)
        var exportFileDbName = 'projects-notes-db'
        console.log(dataToString)
        idbMan.download(exportFileDbName, dataToString)
      }
    },
    download: function (filename, text) {
      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', filename)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    importDb: function (file) {
      // console.log(file)
      var reader = new FileReader()
      reader.onload = function (e) {
        var content = e.target.result
        var importedData = JSON.parse(content)
        var tr = db.transaction([storeName], 'readwrite')
        var store = tr.objectStore(storeName)
        // console.log(store)
        for (let index = 0; index < importedData.length; index++) {
          const element = importedData[index]
          store.add(element)
        }
      }
      reader.readAsText(file)
    },
    addProject: function (dataObject) {
      var tr = db.transaction([storeName], 'readwrite')
      var store = tr.objectStore(storeName)
      var req = store.add(dataObject)
      // console.log(req)
      req.onsuccess = () => {
        console.log('project created')
      }
      req.onerror = () => {
        console.log('something went wrong')}
      objectDataAdded = true
    },
    getProject: function () {
      var tr = db.transaction([storeName], 'readwrite')
      var store = tr.objectStore(storeName)
      var projectGetRequest = store.get(2)
      // console.log(projectToEdit)
      projectGetRequest.onsuccess = function (e) {
        proj = e.target.result
        console.log(proj)
      }
    },
    editProject: function (editedData) {
      var tr = db.transaction([storeName], 'readwrite')
      var store = tr.objectStore(storeName)
      store.put(editedData)
    },
    deleteProject: function (id) {
      var tr = db.transaction([storeName], 'readwrite')
      var store = tr.objectStore(storeName)
      var reqKeyes = store.getAllKeys()
      reqKeyes.onsuccess = function (e) {
        if (e.target.result.includes(id)) {
          var reqDelete = store.delete(id)
          reqDelete.onsuccess = function () {
            console.log('object deleted')
          }
        } else {
          console.log('Invalid id')
        }
      }
    },
    clearDb: function () {
      var reqDelete = window.indexedDB.deleteDatabase(dbName)
      location.reload()
    }
  }
})()
