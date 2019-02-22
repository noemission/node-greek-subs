# greek-subs
Nodejs module to find greek subs

You can give a path to a movie file or a search term and this module will search, download and unzip the subtitles.

## Install
`npm i greek-subs`

## Usage

```js
const GreekSubs = require('greek-subs')

const subs = new GreekSubs('Spiderman 1 2002 1080p x264.mkv');

subs.search()
    .then(subs => {
        // subs is an array of file system paths
    })
```
## Life cycle events

```js
subs.on('search::start', data => {
    // Triggered before every search attempt 

    /* data = {
        searchModule,
        query      
    }*/
})
subs.on('search::finished', data => {
    // Triggered after every search attempt 

    /* data = {
        searchModule,
        query,
        results // If results is empty, search will retry with a different query
    }*/
})
subs.on('search::error', data => {
    // Triggered when a search attempt failed

    /* data = {
        searchModule,
        query,
        error // This query failed, search will continue with a different query
    }*/
})

subs.on('download::start', data => {
    // Triggered before attempting to download a zipped subtitle

    /* data = {
        searchModule,
        url      
    }*/
})
subs.on('download::finish', data => {
    // Triggered on a successful download 

    /* data = {
        searchModule,
        url,
        result // The unzipped buffer      
    }*/
})
subs.on('download::error', data => {
    // Triggered when a download attempt failed

    /* data = {
        searchModule,
        url,
        error // This download failed, although the module will try to get the next more relevant subtitle
    }*/
})
```
