# greek-subs
Nodejs module to find greek subs

You can give a path to a movie file or a search term and this module will search, download and unzip the subtitles.

## Install
`npm i greek-subs`

## Usage

```
const GreekSubs = require('greek-subs')

const subs = new GreekSubs('Spiderman 1 2002 1080p x264.mkv');

subs.search()
    .then(subs => {
        // subs is an array of file system paths
    })
```
## Life cycle events

```
subs.on('search::start', data => {
    /* data = {
        searchModule,
        query      
    }/*
})
subs.on('search::finished', data => {
    /* data = {
        searchModule,
        query,
        results // If results is empty, search will retry with a different query
    }/*
})
subs.on('search::error', data => {
    /* data = {
        searchModule,
        query,
        error // This query failed, search will continue with a different query
    }/*
})

subs.on('download::start', data => {
    /* data = {
        searchModule,
        url      
    }/*
})
subs.on('download::finish', data => {
    /* data = {
        searchModule,
        url,
        result // The unzipped buffer      
    }/*
})
subs.on('download::error', data => {
    /* data = {
        searchModule,
        url,
        error // This download failed, although the module will try to get the next more relevant subtitle
    }/*
})
```
