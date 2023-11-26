# Firefox Extension to manage bookmarks

This extension allows you to manage your bookmarks as folders and files.

DISCLAIMERS:
* Some bugs are present, like the reset of the view under some circumstances.
  Please, report any bug found in an issue. Please, try to provide an explanation/video on how to reproduce the bug.
   


## Developping
This is not useful for the end-user. Only consider this section if you plan to contribute.

### Build
Define the following environment variables before building.
```bash
export NODE_OPTIONS=--openssl-legacy-provider  # Fix issue with node >=18.0 and Chonky
export INLINE_RUNTIME_CHUNK=false              # Prevent inline script tags
export NODE_ENV=development
```
The reason for that is issue encountered with the build:
* https://stackoverflow.com/questions/55160698/how-to-use-react-without-unsafe-inline-javascript-css-code
* https://stackoverflow.com/questions/29586928/react-minified-exception-occurred


### Documentation
https://chonky.io/storybook/2.x/?path=/story/file-browser-demos--two-instances
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Work_with_the_Bookmarks_API
https://github.com/mdn/webextensions-examples/tree/main/open-my-page-button
https://medium.com/geekculture/how-to-create-your-own-firefox-add-on-with-react-ef34fcddb2ea

### Testing
* https://discourse.mozilla.org/t/introducing-mockzilla-and-mockzilla-webextension-for-easy-web-extension-testing-with-jest/59159
* https://lusito.github.io/mockzilla/deep-mock.html#problem
* https://lusito.github.io/mockzilla-webextension/

### Issue
#### Double click event are not correctly fired by Chonky

https://github.com/TimboKZ/Chonky/issues/193
https://github.com/TimboKZ/Chonky/issues/203

A workaround is done but this is still not great.

#### homepage for build
The `homepage` in `package.json` must be relative to work with the extension
https://stackoverflow.com/questions/46235798/relative-path-in-index-html-after-build



