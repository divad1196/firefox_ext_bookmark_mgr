import React, { Component, useEffect, useState }  from 'react';
import './App.css';
import FileBrowser from './FileBrowser';


function App() {
  // let fileBrowserStates = Array(2).map(() => {
  //   // [currentFolder, setCurrentFolder] = useState({id: initialFolderId});
  //   return useState({})
  // });
  // const [currentFolder1, setCurrentFolder1] = useState({});
  // const [currentFolder2, setCurrentFolder2] = useState({});
  const initialFolderId = "root________";
  return (<div style={{display: "flex"}}>
      <div style={{ flex: 1, height: "100vh", width: 0, paddingRight: 4 }} >
        {/* <FileBrowser instanceId={1} currentFolder={currentFolder1} setCurrentFolder={setCurrentFolder1}/> */}
        <FileBrowser instanceId={"browser-left"} initialFolderId={initialFolderId}/>
      </div>
      <div style={{ flex: 1, height: "100vh", width: 0, paddingRight: 4 }} >
        {/* <FileBrowser instanceId={2} currentFolder={currentFolder2} setCurrentFolder={setCurrentFolder2}/> */}
        <FileBrowser instanceId={"browser-right"} initialFolderId={initialFolderId}/>
      </div>
    </div>);
}

export default App;
