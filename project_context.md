# Schaeffler 2W Showroom - Project Context

This document provides a comprehensive overview of the **Schaeffler 2W Showroom** project. It is intended to be provided as context for any AI assistant to help with future development, debugging, or feature additions.

## 1. Project Overview

**Schaeffler 2W Showroom** is an interactive, 3D web and desktop application that allows users to explore 23 different automotive components of a 2-wheeler (bike). 

### Key Capabilities
- **Immersive 3D Experience:** Uses WebGL to render a detailed bike model.
- **Interactive Highlighting:** Users can hover over either a sidebar menu or directly over the 3D meshes to highlight specific components.
- **Detailed Component Views:** Clicking on a highlighted component opens a dedicated view containing rich technical data, specifications, and 3D models for the individual parts.
- **Cross-Platform:** Built as a responsive web app but easily packaged as a standalone desktop application using Electron (e.g., for trade shows and kiosks).

## 2. Tech Stack

| Technology | Usage |
|---|---|
| **Vite** | Fast frontend build tool and development server. |
| **React 19** | Component-based UI library. |
| **Three.js & R3F** | `three` for core 3D API, `@react-three/fiber` for React declarative 3D, and `@react-three/drei` for helpful 3D abstractions (like `useGLTF`, `ContactShadows`). |
| **GSAP** | Robust animation library (`gsap`, `@gsap/react`), mainly used for smooth UI transitions and potentially 3D camera animations. |
| **Zustand** | Lightweight global state management (`zustand`). Used to synchronize state between the 3D canvas and traditional HTML/React UI. |
| **Electron** | Desktop application wrapper (`electron`, `electron-builder`). Configured to launch a frameless, high-resolution desktop app. |

## 3. Architecture & Directory Structure

```text
d:\GitHub\schafflerBikeV1\
├── .gitignore
├── electron/
│   ├── main.cjs            # Electron entry point (Frameless window setup)
│   └── preload.cjs         # IPC bridge (if applicable)
├── public/                 
│   ├── models/             # Contains 'Grops Bikes1.glb' (main bike model)
│   └── Parts/              # Folder for individual component GLBs
├── src/
│   ├── components/         # Reusable React components
│   │   ├── BikeViewer.jsx  # CORE: Handles the 3D scene, mesh traversal, click/hover handlers, and highlights.
│   │   ├── Navbar.jsx      # Top navigation UI.
│   │   ├── ComponentViewer.jsx # Renders individual component 3D models.
│   │   ├── ErrorBoundary.jsx   # React error catchments.
│   │   ├── Hotspots.jsx    # UI overlays on top of 3D scene.
│   │   ├── InfoPanel.jsx   # Side/Bottom panel displaying text specs.
│   │   └── LoadingScreen.jsx # Custom loader UI for the GLTF.
│   ├── data/
│   │   └── components.js   # SINGLE SOURCE OF TRUTH. Array of 23 component objects (IDs, descriptions, meshes, specs).
│   ├── pages/
│   │   ├── Home.jsx        # Landing route (Shows full entire Bike)
│   │   └── ComponentDetail.jsx # Detail route (Shows isolated part & InfoPanel)
│   ├── store/
│   │   └── useShowroomStore.js # Zustand store. Connects 3D interactions with DOM UI.
│   ├── utils/
│   │   └── meshMapping.js  # Crucial parser for cleaning & fuzzy-matching GLTF mesh names to actual component logic.
│   ├── App.jsx             # React router setup.
│   ├── main.jsx            # React root.
│   └── index.css           # Global vanilla CSS.
├── package.json            # Scripts & dependencies
└── vite.config.js          # Vite config (Handles base resolution, React aliases)
```

## 4. Key Mechanisms & State Management

### A. Zustand State (`useShowroomStore.js`)
Crucial for bridging the gap between the R3F `<Canvas>` and standard HTML `<divs>`.
- `hoveredMeshId`: Set by the 3D canvas when a user's mouse intersects a mesh. Listened to by the UI to highlight sidebar items.
- `hoveredComponent`: Set by the UI when hovering the sidebar. Listened to by the 3D canvas to trigger `.emissive` highlights.
- `selectedComponent`: Tracks the user's active selection to trigger route changes to `/component/:id`.
- Has an explicit separation for `explodeProgress` to manage potential animations without thrashing React re-renders.

### B. 3D Model Traversal & Mapping (`BikeViewer.jsx` & `meshMapping.js`)
When `BikeViewer` mounts, it intercepts the loaded `.glb` scene. 
1. The code traverses every `THREE.Mesh` in the scene.
2. It uses `isMeshMatch(child.name, comp.targetMeshes, comp.id)` from `meshMapping.js` to determine which mesh belongs to which abstract component.
3. If the mesh name doesn't match directly, it iterates upward through `child.parent` groups (e.g. `parent.isGroup`) to see if the group matches.
4. Mapped meshes get tagged with `child.userData.componentId = comp.id`.
5. Bounding boxes are generated to auto-calculate `anchor` points in group-local space for hotspots.

### C. Highlighting Logic (`BikeViewer.jsx`)
To maintain 60 FPS, the app avoids rendering full copies of the bike.
- When an interaction fires, the script iterates through the `scene` and finds standard meshes containing the targeted `userData.componentId`.
- **`ensureOwnMaterial`**: If multiple meshes share the same `Three.Material` reference, modifying one modifies all. The app safely `.clone()`s materials the *first time* they are highlighted.
- **`applyEmissive`**: It edits the `.emissive` hex color and intensity (or `.color` fallback for `MeshBasicMaterial`).
- **`clearAllHighlights`**: A `Set` (`highlightedRef`) stores actively highlighted meshes. Instead of clearing the whole scene, it clears only what's tracking in O(1).

### D. Data Source (`components.js`)
`components.js` is the source of truth for the app's content. Every component requires:
- `id`: unique identifier (`"m4c"`, `"fuel_injector"`).
- `label`: Human-readable name.
- `targetMeshes`: Array of strings used by the system to match the GLTF's hierarchy or node namings.
- `category`: Used to filter the UI (Engine, Chassis, Electrification, Transmission).
- `specs`, `features`, `advantages`: Text data rendered on the `InfoPanel`.
- `model`: Path to the singular version of the GLTF used in the `ComponentDetail` isolated view.
- `anchor`: Vector `[x,y,z]` determining where UI hotspots overlay onto the 3D coordinate space.

## 5. Development workflows

### Running the App
- **Web App Start:** `npm run dev`
- **Electron Start:** `npm run electron:dev` (Uses `concurrently` and `wait-on` to boot the web server, then wraps it in the desktop client).

### Mapping a New / Broken Mesh 
If a 3D component is not turning green when hovered:
1. Ensure the app is running in Development mode (`import.meta.env.DEV` is true).
2. Look at the console. `BikeViewer.jsx` automatically attempts to print lists of unmapped components.
3. Hold `Ctrl` and `Click` directly on the part of the bike that is failing. `BikeViewer.jsx` will intercept this and print the exact, raw Three.js `child.name` to the console.
4. Go into `src/data/components.js` and add a substring of that printed name into the relevant object's `targetMeshes` array.

## 6. Known Potential Vulnerabilities & Future Maintenance Areas

- **Vite Base Path:** In `vite.config.js`, `base` must strictly be `'/'` in development and `'./'` for the Electron build. Touching this can break 3D asset loading across environments.
- **Mesh Hierarchy Vulnerability:** The mapping heavily relies on the exact naming conventions assigned by the 3D artist out of Blender/Maya into the `.glb`. If an artist renames nodes or strips hierarchy during export, the mappings in `components.js` will break silently. `meshMapping.js` handles some noise (like `_primitive0`) but structural changes will require a recalibration.
- **WebGL Performance:** The application iterates over the entire scene quite often inside `useEffect` logic. While fine for load times, avoid running deep `scene.traverse()` or `Box3.setFromObject()` calls inside rapid events or `useFrame`. Use the pre-calculated `userData` fields.
