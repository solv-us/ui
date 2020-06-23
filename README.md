# solv.us ui
The user interface for the solv.us server. The most recent commit is automatically build and accessible at [ui.solv.us](https://ui.solv.us/).

## Setup for production
The easiest way to use the UI is through the online interface, but this is not always the best option. In case you want to run the UI locally, download the ```dist``` folder, place it somewhere on your computer and serve it through a local web-server, for example by using [serve](https://github.com/zeit/serve). 

## Setup for development
If you want to help with the development of the user interface, you'll have to clone the repository:

```
git clone https://github.com/solv-us/ui.git
cd ui
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
