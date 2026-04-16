import { create } from 'zustand';

export const useShowroomStore = create((set) => ({
  // Currently selected component id
  selectedComponent: null,
  setSelectedComponent: (id) => set({ selectedComponent: id }),

  // Is the detail panel open
  detailOpen: false,
  setDetailOpen: (v) => set({ detailOpen: v }),

  // Camera is transitioning
  cameraTransitioning: false,
  setCameraTransitioning: (v) => set({ cameraTransitioning: v }),

  // Hotspot hover
  hoveredComponent: null,
  setHoveredComponent: (id) => set({ hoveredComponent: id }),

  // Loading progress
  loadingProgress: 0,
  setLoadingProgress: (v) => set({ loadingProgress: v }),

  // Active filter category
  activeCategory: 'All',
  setActiveCategory: (cat) => set({ activeCategory: cat }),
}));
