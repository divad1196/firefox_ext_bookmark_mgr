import React, { Component, useEffect, useReducer, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { getBookmarks, createFolder, getBreadCrumbs, onBookmarkEvent, getBookmarkbyId, moveBookmark, removeFolder } from './utils';
// import { FullFileBrowser, FileBrowser, FileActionHandler, ChonkyActions } from 'chonky';
import {
    FullFileBrowser,
    ChonkyActions,
    ChonkyFileActionData,
    FileArray,
    FileBrowser,
    FileContextMenu,
    FileData,
    FileHelper,
    FileList,
    FileNavbar,
    FileToolbar,
    setChonkyDefaults,
} from 'chonky';
/*
    Currently NOT working.
    The goal is to simplify the implementation by working using events.
*/

function until(array, criteria) {
    let result = [];
    for (let e of array) {
        if (criteria(e)) {
            break;
        }
        result.push(e);
    }
    return result;
}
// let newBreadcrumbs = [
//     ...until(breadcrumbs, e => e.id === target.id),
//     data.payload.targetFile
//   ];
function getActionHandler() {
    let lastSingleClick = Date.now();
    let doubleClickDelay = 300;
    const handleAction = (
        data,
        currentFolder, setCurrentFolder
    ) => {
        // Fixme: calling setCurrentFolder "reset" the other browser
        // I then need to do one click on the other browser so it can detect double clicks again

        if (data.id === ChonkyActions.OpenFiles.id) {
            let target = data.payload.targetFile;
            setCurrentFolder(target.id);
        } else if (data.id === ChonkyActions.MouseClickFile.id) {
            let file = data.payload.file;
            if (data.payload.clickType === "double") {
                setCurrentFolder(file.id);
            } else {
                // Fix issue:
                // https://github.com/TimboKZ/Chonky/issues/193
                // https://github.com/TimboKZ/Chonky/issues/203
                let now = Date.now();
                if(now - lastSingleClick < doubleClickDelay) {
                    setCurrentFolder(file.id);
                }
                lastSingleClick = now;
            }
        } else if (data.id === ChonkyActions.CreateFolder.id) {
            // Create a folder
            let folder = prompt("Folder name");
            if (folder) {
                createFolder(folder, currentFolder.id);
            }
        } else if (data.id === ChonkyActions.EndDragNDrop.id) {
            // Move the files
            const dest = data.payload.destination;
            const elements = data.payload.selectedFiles;
            for (let el of elements) {
                if (dest.id === el.id) return;
                moveBookmark(el.id, dest.id);
            }
        } else if (data.id === ChonkyActions.DeleteFiles.id) {
            // Delete the files
            const elements = data.state.selectedFilesForAction;
            for (let el of elements) {
                removeFolder(el.id);
            }
        }
    };
    return handleAction;
}

async function getAll(currentFolderId) {  // useReducer ?
    let folder = await getBookmarkbyId(currentFolderId);
    let bookmarks = await getBookmarks(currentFolderId);
    let breadcrumbs = await getBreadCrumbs(currentFolderId);
    return { folder, bookmarks, breadcrumbs };
}

function BookmarkBrowser(props) {
    const initialFolderId = props.initialFolderId;
    const instanceId = props.instanceId;
    // const {currentFolder, setCurrentFolder: _setCurrentFolder} = props;
    // const [currentFolderId, setCurrentFolderId] = React.useState(initialFolderId);
    const [currentFolder, _setCurrentFolder] = React.useState({ id: initialFolderId });
    const setCurrentFolder = (folderId) => {
        _setCurrentFolder({ id: folderId })
    };

    const [bookmarks, setBookmarks] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState([]);


    //   const setCurrentFolder = (folderId) => {
    //     getAll(folderId).then(({folder, bookmarks, breadcrumbs}) => {
    //         setBookmarks(bookmarks);
    //         // setBreadcrumbs(breadcrumbs);
    //     });
    //   }
    //   const refresh = () => {
    //     getAll(folderId).then(({folder, bookmarks, breadcrumbs}) => {
    //         setBookmarks(bookmarks);
    //         setBreadcrumbs(breadcrumbs);
    //     });
    //   };


    onBookmarkEvent(() => {
        setCurrentFolder(currentFolder.id)
    }, []);
    useEffect(() => {
        getAll(currentFolder.id).then(({ bookmarks, breadcrumbs }) => {
            setBookmarks(bookmarks);
            setBreadcrumbs(breadcrumbs);
        });
    }, [currentFolder]);
    // Breadcrumbs: https://chonky.io/docs/2.x/basics/folder-chain
    const handleAction = React.useMemo(getActionHandler, []);
    const onFileAction = React.useCallback((data) => handleAction(
        data,
        currentFolder, setCurrentFolder
    ), [currentFolder]);

    const fileActions = React.useMemo(
        () => [
            ChonkyActions.CreateFolder, // Adds a button to the toolbar
            // ChonkyActions.UploadFiles, // Adds a button
            // ChonkyActions.DownloadFiles, // Adds a button
            // ChonkyActions.CopyFiles, // Adds a button and a shortcut: Ctrl+C
            ChonkyActions.DeleteFiles, // Adds a button and a shortcut: Delete
        ],
        []
    );
    // return (

    //     <FileBrowser
    //         instanceId={instanceId}
    //         files={bookmarks}
    //         folderChain={breadcrumbs}
    //         fileActions={fileActions}
    //         onFileAction={onFileAction}
    //     >
    //         <FileNavbar />
    //         <FileToolbar />
    //         <FileList />
    //         <FileContextMenu />
    //     </FileBrowser>
    // );
    return (
        <FullFileBrowser
            instanceId={instanceId}
            files={bookmarks}
            folderChain={breadcrumbs}
            fileActions={fileActions}
            onFileAction={onFileAction}
        />
    );
}

export default BookmarkBrowser ;
