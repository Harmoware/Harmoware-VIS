import * as React from 'react';
export default (function (_a) {
    var viewport = _a.viewport, hovered = _a.hovered;
    // set flags used below to determine if SVG highlight elements should be rendered.
    // if truthy, each flag is replaced with the corresponding element to render.
    var elementInfo = {
        hovered: hovered && hovered.object
    };
    // render additional info about the focused elements (only nodes, not links)
    Object.keys(elementInfo).forEach(function (k) {
        var el = elementInfo[k];
        if (el && el.code && k === 'hovered') {
            elementInfo[k] = (React.createElement("text", { x: hovered.x + 10, y: hovered.y + 0 },
                el.code,
                ":",
                el.name,
                " ",
                el.memo));
        }
        else if (el && el.memo && k === 'hovered') {
            elementInfo[k] = (React.createElement("text", { x: hovered.x + 10, y: hovered.y + 0 }, el.memo));
        }
        else {
            elementInfo[k] = null;
        }
    });
    // Note: node.x/y, calculated by d3 layout,
    // is measured from the center of the layout (of the viewport).
    // Therefore, we offset the <g> container to align.
    return (React.createElement("svg", { width: viewport.width, height: viewport.height, className: "harmovis_overlay" },
        React.createElement("g", { fill: "white", fontSize: "12" }, elementInfo.hovered)));
});
//# sourceMappingURL=interaction-layer.js.map