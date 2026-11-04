// File: wallycad.com/core/wally-core.js

window.Wally = window.Wally || {};

window.Wally.parseData = function(inputString) {
    const rawText = inputString.trim();
    if (!rawText) return [];

    // --- DETECTION BLOCK: Route JSON vs Plaintext ---
    if (rawText.startsWith('{') || rawText.startsWith('[')) {
        try {
            const jsonObj = JSON.parse(rawText);
            return window.Wally.translateJSON(jsonObj);
        } catch (e) {
            console.warn("JSON structure detected but parsing failed. Falling back to .wally text.", e);
        }
    }

    // Fallback to standard .wally syntax parser
    return window.Wally.parseWallyText(rawText);
};

// --- SUB-ROUTINE 1: Translate JSON Objects into Core Format ---
window.Wally.translateJSON = function(jsonObj) {
    const parsedGeometry = [];
    
    // Process JSON lines (e.g., from WallyTarget)
    if (jsonObj.lines && Array.isArray(jsonObj.lines)) {
        jsonObj.lines.forEach(lineArr => {
            let coords = [];
            for (let i = 0; i < lineArr.length; i += 2) {
                coords.push({ x: lineArr[i], y: lineArr[i+1] });
            }
            parsedGeometry.push({ tag: "[LINE]", coordinates: coords });
        });
    }
    
    // Process JSON circles
    if (jsonObj.circles && Array.isArray(jsonObj.circles)) {
        jsonObj.circles.forEach(circle => {
            parsedGeometry.push({ 
                tag: "[CIRCLE]", 
                // Store cx, cy, and r sequentially to match coordinate engine expectations
                coordinates: [{ x: circle.cx, y: circle.cy }, { x: circle.r, y: 0 }] 
            });
        });
    }

    return parsedGeometry;
};

// --- SUB-ROUTINE 2: Universal Plaintext Parser ---
window.Wally.parseWallyText = function(rawText) {
    const tokens = rawText.split(/[\s,]+/);
    const parsedGeometry = [];
    let currentSequence = { tag: "[UNTAGGED]", coordinates: [] };
    let tempX = null;

    tokens.forEach(token => {
        if (/^\[.*?\]$/.test(token)) { // Detect tags like [LINE], [WALL]
            if (currentSequence.coordinates.length > 0) parsedGeometry.push(currentSequence);
            currentSequence = { tag: token.toUpperCase(), coordinates: [] };
            tempX = null;
        } else {
            const val = parseFloat(token);
            if (!isNaN(val)) {
                if (tempX === null) {
                    tempX = val;
                } else {
                    currentSequence.coordinates.push({ x: tempX, y: val });
                    tempX = null; 
                }
            }
        }
    });
    
    if (currentSequence.coordinates.length > 0) parsedGeometry.push(currentSequence);
    return parsedGeometry;
};
