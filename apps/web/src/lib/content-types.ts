/**
 * Shapes and presets of the bundled content (src/content/*.json), as the CMS
 * defined them.
 */

/** Preset palettes a project or an article can pick. Each has a light and a dark variant. */
export const PROJECT_THEME_IDS = [
  "graphite",
  "grove",
  "ember",
  "nebula",
  "sky",
  "lavender",
  "blush",
  "signal",
  "violet",
  "iris",
  "slate",
  "mono",
  "abyss",
  "atlas",
  "rose",
  "lagoon",
  "storybook",
  "sand",
  "laboratory",
  "sunburst",
] as const;
export type ProjectThemeId = (typeof PROJECT_THEME_IDS)[number];

export const PROJECT_MEDIA_KINDS = ["image", "video"] as const;
export type ProjectMediaKind = (typeof PROJECT_MEDIA_KINDS)[number];

/** "normal" sits inside the page's vertical padding with rounded corners;
 *  "full" runs edge to edge, the full height of the viewport. */
export const PROJECT_MEDIA_SIZES = ["normal", "full"] as const;
export type ProjectMediaSize = (typeof PROJECT_MEDIA_SIZES)[number];

export const PROJECT_DETAIL_LIMITS = {
  descriptionMax: 520,
  descriptionSoftMax: 450,
  ctaLabelMax: 28,
  servicesMax: 8,
  serviceMax: 32,
  mediaMax: 40,
  mediaAltMax: 200,
} as const;

export type ProjectCta = { label: string; url: string };

export type ProjectMediaItem = {
  id: string;
  kind: ProjectMediaKind;
  size: ProjectMediaSize;
  /** A media file key, or a `static/<public-path>` key for bundled art. */
  key: string;
  /** Intrinsic pixel size; 0 means unknown (the page assumes 16:9 until it loads). */
  width: number;
  height: number;
  alt?: string;
  /** A video's still frame (an image key), shown until playback starts. */
  posterKey?: string;
};

export type HomeVideoMode = "none" | "upload";

/** The homepage reel's video. */
export type HomeContent = {
  videoMode: HomeVideoMode;
  videoKey?: string;
  videoName?: string;
  videoSize?: number;
};

/** The lab's address, shown in the footer. */
export const LAB_LOCATION = {
  address:
    "Faculty of Computer Science (FILKOM), Universitas Brawijaya\nBuilding F Room F10.5 and F10.6\nVeteran Street No. 8, Malang, 65145, Indonesia",
  lat: -7.9543,
  lng: 112.6146,
} as const;
