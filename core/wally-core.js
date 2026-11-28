// File: wallycad.com/core/wally-core.js

window.Wally = window.Wally || {};

/**
 * Main entry point: routes JSON vs Plaintext .wally syntax.
 * @param {string} inputString
 * @param {object} [options]
 * @param {string} [options.delimiter="auto"] - "auto" | "whitespace" | "comma"
 */
window.Wally.parseData = function(inputString, options = {}) {
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

    // Fallback to standard .wally syntax parser with delimiter handling
    return window.Wally.parseWallyText(rawText, options);
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

// --- SUB-ROUTINE 2: Universal Plaintext Parser (Comma vs. Whitespace Handler) ---
window.Wally.parseWallyText = function(rawText, options = {}) {
    const delimiterMode = options.delimiter || window.Wally.detectDelimiter(rawText);
    let tokens = [];

    // Normalize optional grouping wrappers like (0,0) or [10,20] without touching [TAG] headers
    const cleanedText = rawText.replace(/\(([^)]+)\)/g, " $1 ");

    if (delimiterMode === "whitespace") {
        // Strict SDJ whitespace mode: strip commas cleanly and split only on whitespace
        tokens = cleanedText.replace(/,/g, " ").trim().split(/\s+/);
    } else if (delimiterMode === "comma") {
        // Comma-delimited mode: split on commas while keeping [TAG] headers intact
        tokens = cleanedText
            .replace(/(\[[^\]]+\])/g, ",$1,")
            .split(",")
            .map(t => t.trim())
            .filter(Boolean);
    } else {
        // "auto" mode: treat both commas and whitespace as valid separators
        tokens = cleanedText.split(/[\s,]+/).filter(Boolean);
    }

    const parsedGeometry = [];
    let currentSequence = { tag: "[UNTAGGED]", coordinates: [] };
    let tempX = null;

    tokens.forEach(token => {
        if (/^\[.*?\]$/.test(token)) { // Detect tags like [LINE], [WALL]
            if (currentSequence.coordinates.length > 0) parsedGeometry.push(currentSequence);
            currentSequence = { tag: token.toUpperCase(), coordinates: [] };
            tempX = null;
        } else {
            // In strict comma mode, handle a pair like "10 20" inside a comma slot if present
            const subParts = delimiterMode === "comma" ? token.split(/\s+/) : [token];
            subParts.forEach(part => {
                const val = parseFloat(part);
                if (!isNaN(val)) {
                    if (tempX === null) {
                        tempX = val;
                    } else {
                        currentSequence.coordinates.push({ x: tempX, y: val });
                        tempX = null;
                    }
                }
            });
        }
    });
    
    if (currentSequence.coordinates.length > 0) parsedGeometry.push(currentSequence);
    return parsedGeometry;
};

// --- SUB-ROUTINE 3: Delimiter Detection & Conversion Utilities ---
window.Wally.detectDelimiter = function(rawText) {
    const hasComma = rawText.includes(",");
    const hasSpace = /\d\s+\d/.test(rawText);
    if (hasComma && !hasSpace) return "comma";
    if (!hasComma) return "whitespace";
    return "auto";
};

/**
 * Exports parsedGeometry back out as SDJ whitespace ("0 0 100 0"),
 * comma-pairs ("0,0 100,0"), or flat CSV ("0, 0, 100, 0"), preserving [TAGS].
 */
window.Wally.formatGeometry = function(parsedGeometry, format = "whitespace", includeTags = true) {
    return parsedGeometry.map(seq => {
        const flatNums = seq.coordinates.flatMap(pt => [pt.x, pt.y]);
        let body = "";

        if (format === "comma-pairs") {
            body = seq.coordinates.map(pt => `${pt.x},${pt.y}`).join(" ");
        } else if (format === "csv") {
            body = flatNums.join(", ");
        } else {
            body = flatNums.join(" ");
        }

        return (includeTags && seq.tag && seq.tag !== "[UNTAGGED]")
            ? `${seq.tag} ${body}`
            : body;
    }).join("\n");
};

/**
 * UI / Console Helper: Normalizes an input textarea/element between comma and whitespace
 * and optionally triggers a callback or clipboard copy.
 */
window.Wally.handleInputUI = async function(inputSelector, outputSelector = null, options = {}) {
    const {
        delimiter = "auto",
        outputFormat = "whitespace",
        includeTags = true,
        copy = false
    } = options;

    const inEl = typeof inputSelector === "string" ? document.querySelector(inputSelector) : inputSelector;
    if (!inEl) return [];

    const raw = inEl.value ?? inEl.textContent ?? "";
    const detected = window.Wally.detectDelimiter(raw);
    const geometry = window.Wally.parseData(raw, { delimiter });
    const formatted = window.Wally.formatGeometry(geometry, outputFormat, includeTags);

    if (outputSelector) {
        const outEl = typeof outputSelector === "string" ? document.querySelector(outputSelector) : outputSelector;
        if (outEl) {
            if ("value" in outEl) outEl.value = formatted;
            else outEl.textContent = formatted;
        }
    }

    if (copy && navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(formatted);
        } catch (err) {
            console.warn("Wally clipboard copy skipped:", err);
        }
    }

    return { detected, geometry, formatted };
};
