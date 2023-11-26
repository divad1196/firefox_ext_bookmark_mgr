import bookmarks from "./data.json";


async function convert(bookmarks) {
    let result = [];
    for(let el of bookmarks) {
        result.push({
            id: el.id,
            name: el.title || 'anonymous',
            isDir: el.type === "folder",
            // parentId: el.parentId,
            // children: convert(el.children)
        });
    }
    return result;
}

async function getBookmarks(parentId) {
    let browser = await getBrowser();
    let tree = []
    if (parentId) {
        tree = await browser.bookmarks.getChildren(parentId).catch((error) => []);
    } else {
        tree = await browser.bookmarks.getChildren("root________").catch((error) => []);
        tree = await browser.bookmarks.getTree().catch((error) => []);
    }
    return convert(tree);
}

async function getBookmarkbyId(bookmarkId) {
    let browser = await getBrowser();
    if(bookmarkId)
        return browser.bookmarks.get(bookmarkId).then(convert).then(l => l[0]);
    let res = await getBookmarks().then(l => l[0]);
    return res;
}


async function onBookmarkEvent(callback) {
    let browser = await getBrowser();
    browser.bookmarks.onCreated.addListener(callback);
    browser.bookmarks.onRemoved.addListener(callback);
    browser.bookmarks.onChanged.addListener(callback);
    browser.bookmarks.onMoved.addListener(callback);
    // browser.bookmarks.onChildrenReordered.addListener(callback);
    // browser.bookmarks.onImportBegan.addListener(callback);
    // browser.bookmarks.onImportEnded.addListener(callback);

}

async function getBreadCrumbs(currentFolderId) {
    const browser = await getBrowser();
    let result = [];
    while (currentFolderId) {
        let folder = await browser.bookmarks.get(currentFolderId).then(l => l[0]);
        result.push(folder);
        currentFolderId = folder.parentId;
    }
    return convert(result.reverse());
}

async function getBrowser() {
    return browser;     // eslint-disable-line
}

async function moveBookmark(targetId, parentId, index) {
    let browser = await getBrowser();
    await browser.bookmarks.move(targetId, {
        parentId,
        // index: "folder",  // Cannot be used, folders are sorted alphabetically
    })
    return getBookmarks(parentId);
}



async function createFolder(name, parentId) {
    let browser = await getBrowser();
    let folder = await browser.bookmarks.create({
        title: name,
        parentId,
        type: "folder",  // optional since "url" is not provided
    })
    // return the newly created folder ?
}

async function removeFolder(folderId) {
    let browser = await getBrowser();
    await browser.bookmarks.removeTree(folderId)
}

// async function getBookmarks() {
//     return bookmarks;
// }


export {
    getBookmarks, createFolder, getBreadCrumbs, onBookmarkEvent, getBookmarkbyId, moveBookmark, removeFolder
};