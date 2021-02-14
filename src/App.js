import React, {useEffect, useState} from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import './App.css';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Button, Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";
import {CheckBox} from "@material-ui/icons";
import sources from './sources';

const initialView = {lng: 79.736, lat: 30.4, zoom: 7};
let map;


const addSource = (map, key, source) => {
    const data = `/data/${key}.geojson`;
    map.addSource(key, {type: 'geojson', data});
    map.addLayer(
        {
            'id': key,
            'type': source.type,
            'source': key,
            'paint': source.paint || {},
            'layout': source.layout || {}
        }
    )
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

const App = (props) => {

    const classes = useStyles();
    const theme = useTheme();

    const [view, setView] = useState(initialView);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZHJoZWluaGVpbWVyIiwiYSI6ImNpeGFueGdtdTAwOWQyeXFmcjIxNGxhdGsifQ.ezx3wWVzhdqh9Esn1q_mfA';
        map = new mapboxgl.Map({
            container: 'mapbox',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [initialView.lng, initialView.lat],
            zoom: initialView.zoom
        });

        map.addControl(new mapboxgl.NavigationControl());

        map.on('move', () => {
            const newView = {
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            };
            setView(newView);
        });

        map.on('load', () => {
            Object.keys(sources).forEach(key => {
                const source = sources[key];
                if (source.type === 'symbol') {
                    map.loadImage(`/icons/${source.icon}`, (error, image) => {
                        map.addImage(key, image);
                        addSource(map, key, source);
                    });
                } else {
                    addSource(map, key, source);
                }
            })
        });

        map.on('click', function (e) {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['hydropower'] // replace this with the name of the layer
            });

            if (!features.length) {
                return;
            }

            const feature = features[0];

            const popup = new mapboxgl.Popup({offset: [0, -15]})
                .setLngLat(feature.geometry.coordinates)
                .setHTML('<h3>' + feature.properties.title + '</h3><p>' + feature.properties.description + '</p>')
                .addTo(map);
        });

        // new mapboxgl.Marker()
        //     .setLngLat([79.73568772471732, 30.400077489299015])
        //     .setPopup(new mapboxgl.Popup({offset: 25}).setText(
        //         'Approximate source of flood.'
        //     ))
        //     .addTo(map);

        new mapboxgl.Marker()
            .setLngLat([79.73568772471732, 30.400077489299015])
            .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(
                "Approximate source of flood. " +
                "(<a href='https://theprint.in/science/satellite-images-reveal-550m-scar-left-by-uttarakhand-landslide-in-nanda-ghunti-glacier/603123/'>source</a>)"
            ))
            .addTo(map);

        // new mapboxgl.Marker()
        //     .setLngLat([79.693055245675, 30.48755135276432])
        //     .setPopup(new mapboxgl.Popup({offset: 25}).setText(
        //         'Raini village, Chamoli district, Uttarakhand.'
        //     ))
        //     .addTo(map);

    }, []);

    return (
        <div className="App">

            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMenuOpen(!menuOpen)}>
                        <MenuIcon/>
                    </IconButton>
                    {/*<Typography variant="h6" className={classes.title}>*/}
                    {/*    News*/}
                    {/*</Typography>*/}
                    {/*<Button color="inherit">Login</Button>*/}
                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={menuOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <IconButton onClick={() => setMenuOpen(false)}>
                    <ChevronLeftIcon/>
                </IconButton>
                <FormGroup style={{padding: 10}}>
                    {Object.keys(sources).map(key => {
                        const source = sources[key];
                        return <FormControlLabel
                            key={key}
                            control={<Checkbox checked={true} onChange={null} name={key}/>}
                            label={<div>
                                {source.type === 'symbol' ?
                                    <img width={25} height={25} aria-label={key} src={`/icons/${source.icon}`}/> : null}
                                <span>{key}</span>
                            </div>}
                        />
                    })}
                </FormGroup>
                <div>
                    Source attribution forthcoming.
                </div>
            </Drawer>

            <div id="mapbox" style={{position: "absolute", top: 64, bottom: 0, left: menuOpen ? drawerWidth : 0, right: 0}}/>
        </div>
    );
}

export default App;
