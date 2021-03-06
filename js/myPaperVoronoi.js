//import { Path } from 'paper';

var path = require('path');
var remote = require('electron').remote;
var fs = require('fs');
var app = remote.app;

var voronoi = new Voronoi();
var sites = generateBeeHivePoints(view.size / 200, true);
var bbox, diagram;
var oldSize = view.size;
var spotColor = new Color('rgba(180, 180, 180, 0.5)');
var selected = false;
var scaleFactor = 95;

onResize();

// --- Slider ---
var scaleSlider = document.getElementById("scaleSlider");
scaleSlider.onchange = function() {
    scaleFactor = this.value;
    renderDiagram();
}

// --- Random --- randomButton
var randomButton = document.getElementById("randomButton");
randomButton.onclick = function() {
    sites = generateRandomSites(100);
}

function generateRandomSites(number) {
    var points = [];
    for (var i = 0; i < number; i++) {
        var point = new Point(Math.random() * view.size.width, Math.random() * view.size.height);
        points.push(point);
    }
    return points;
}

function onMouseDown(event) {
    sites.push(event.point);
    renderDiagram();
}

function onMouseMove(event) {
    //if (event.count == 0)
    //    sites.push(event.point);
    sites[sites.length - 1] = event.point;
    renderDiagram();
}

function renderDiagram() {
    project.activeLayer.children = [];
    var diagram = voronoi.compute(sites, bbox);
    if (diagram) {
        for (var i = 0, l = sites.length; i < l; i++) {
            var cell = diagram.cells[sites[i].voronoiId];
            if (cell) {
                var halfedges = cell.halfedges,
                    length = halfedges.length;
                if (length > 2) {
                    var points = [];
                    for (var j = 0; j < length; j++) {
                        v = halfedges[j].getEndpoint();
                        points.push(new Point(v));
                    }
                    createPath(points, sites[i]);
                }
            }
        }
    }
}

function removeSmallBits(path) {
    var averageLength = path.length / path.segments.length;
    var min = path.length / 50;
    for (var i = path.segments.length - 1; i >= 0; i--) {
        var segment = path.segments[i];
        var cur = segment.point;
        var nextSegment = segment.next;
        var next = nextSegment.point + nextSegment.handleIn;
        if (cur.getDistance(next) < min) {
            segment.remove();
        }
    }
}

function generateBeeHivePoints(size, loose) {
    var points = [];
    var col = view.size / size;
    for (var i = -1; i < size.width + 1; i++) {
        for (var j = -1; j < size.height + 1; j++) {
            var point = new Point(i, j) / new Point(size) * view.size + col / 2;
            if (j % 2)
                point += new Point(col.width / 2, 0);
            if (loose)
                point += (col / 4) * Point.random() - col / 4;
            points.push(point);
        }
    }
    return points;
}

function createPath(points, center) {
    var path = new Path();
    if (!selected) {
        path.fillColor = spotColor;
    } else {
        path.fullySelected = selected;
    }
    path.closed = true;

    for (var i = 0, l = points.length; i < l; i++) {
        var point = points[i];
        var next = points[(i + 1) == points.length ? 0 : i + 1];
        var vector = 0; //(next - point) / 10;
        path.add({
            point: point + vector,
            handleIn: -vector,
            handleOut: vector
        });
    }
    path.scale(scaleFactor / 100);
    removeSmallBits(path);
    return path;
}

function onResize() {
    var margin = 20;
    bbox = {
        xl: margin,
        xr: view.bounds.width - margin,
        yt: margin,
        yb: view.bounds.height - margin
    };
    for (var i = 0, l = sites.length; i < l; i++) {
        sites[i] = sites[i] * view.size / oldSize;
    }
    oldSize = view.size;
    renderDiagram();
}

function onKeyDown(event) {
    if (event.key == 'space') {

        selected = !selected;
        renderDiagram();
    }

    if (event.key == 's') {
        var voronoiSVG = paper.project.exportSVG({ asString: true });
        var baseFolder = app.getPath('downloads');
        var filePath = path.join(baseFolder, 'test.svg');
        fs.writeFile(filePath, voronoiSVG);
    }

    if (event.key == 'z') {
        sites.pop();
        renderDiagram();
    }
}