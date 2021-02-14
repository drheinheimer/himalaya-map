const sources = {
    basins: {
        type: 'line',
        layout: {},
        paint: {
            'line-color': '#002bab',
            'line-width': 3,
            'line-opacity': 1.0
        }
    },
    glaciers: {
        type: 'fill',
        layout: {},
        paint: {
            'fill-color': '#fff',
            'fill-opacity': 0.9,
            'fill-outline-color': '#000'
        }
    },
    himatibetmap: {
        type: "line",
        paint: {
            'line-color': 'red',
            'line-width': 2,
            'line-opacity': 0.8
        }
    },
    conveyances: {
        type: "line",
        paint: {
            'line-color': 'blue',
            'line-width': 3,
            'line-opacity': 0.8
        }
    },
    hydropower: {
        type: "symbol",
        icon: "square-red-11.png",
        layout: {
            'icon-image': 'hydropower',
            // 'icon-size': 0.1
        }
    },
    reservoirs: {
        type: "symbol",
        icon: "triangle-blue-15.png",
        layout: {
            'icon-image': 'reservoirs',
            // 'icon-size': 0.1
        }
    },
    outlets: {
        type: "circle"
    },
}

export default sources;