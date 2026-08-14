# WALLY V1.0.10 | OPERATIONS MANUAL

**ENTERPRISE:** LKA / Last Known Address
**SYSTEM:** JavaScript Vector Engine & jsPDF Plotter

---

**Welcome to Wally.**

You have bypassed the bloated, subscription-trapped CAD industry. This is a pure, frictionless 2D drafting engine driven by Cartesian math. Buy it once. Own it forever. Run it completely offline.

---

## 1. THE CORE WORKFLOW (SPAWN & MODIFY)

Wally does not use "click-and-drag" drawing. It uses a precision spawn-and-modify sequence. To create custom geometry, follow this flow:

1. **TYPE:** Select your entity type from the top toolbar or CLI (e.g., **WALL**). This spawns a default shape onto the canvas and opens its data.
2. **PROPERTIES:** Change the thickness (T), radius, or text in the left panel. The shape will scale in real-time.
3. **COORD'S:** Click into the Coordinates (X,Y) box and type or paste your exact cartesian matrix. The canvas will instantly update.

---

## 2. CANVAS NAVIGATION

* **PAN (Move Camera):** Click and drag the Right Mouse Button. *(Alternatively, hold the **ALT** key + Left-Click, or use the Middle-Click wheel).*
* **ZOOM:** Scroll the mouse wheel up or down.
* **SELECT:** Left-Click any entity to open its data in the Properties panel.

---

## 3. THE COMMAND LINE (CLI)

Wally is driven primarily by the Command Line at the bottom of the screen.

| Command | Function |
| --- | --- |
| **LINE** | Spawns a standard 0-thickness geometric path. |
| **WALL** | Spawns a thickened polyline structure. |
| **CIRCLE** | Spawns a native circle. Width = Radius. Depth = Tube Wall. |
| **DIM** | Spawns a dimension measurement tool. |
| **TEXT** | Spawns a text annotation label. |
| **STAIR** | Spawns a parametric stair tread array. |
| **X,Y** | Type a coordinate (e.g., **15,25**) to append a point to the active path. |
| **ERASE** | Deletes the currently selected entity (or press **DEL**). |
| **ZOOM E** | Zoom Extents. Automatically scales to fit your geometry. |
| **DXF** | Compiles visible layers into a 2D AutoCAD file for CNC/Laser. |
| **HAL** | Toggles the high-contrast presentation view. |
| **SCRIPT** | Opens the Macro Interpreter to batch-generate geometry from a `.dat` file. |
