export type StudioTravelImage = {
  id: number;
  src: string;
  alt: string;

  /**
   * Horizontal parallax distance in pixels.
   * Images with depth 0 remain fixed.
   */
  depth: number;
};

export type StudioTravelStop = {
  id: number;
  label: string;
  icon: string;

  /**
   * Recreates the source CSS variable:
   * width: calc(var(--index) * responsive-width)
   */
  widthIndex: number;
};

const createTravelImage = (
  id: number,
  alt: string,
  depth: number,
): StudioTravelImage => {
  return {
    id,
    src: `https://admin.tuvanweb.com/uploads/files/Studio/Traveling/${id}.png`,
    alt,
    depth,
  };
};

/**
 * First gallery row:
 * 1–4   → Ha Giang
 * 5–9   → Quang Ninh
 * 10–17 → Da Lat
 *
 * The source alternates depth 0 and 75.
 */
export const studioTravelTopRow: StudioTravelImage[] = [
  ...Array.from(
    {
      length: 4,
    },
    (_, index) => {
      const id = index + 1;

      return createTravelImage(id, "Ha Giang", id % 2 === 0 ? 75 : 0);
    },
  ),

  ...Array.from(
    {
      length: 5,
    },
    (_, index) => {
      const id = index + 5;

      return createTravelImage(id, "Quang Ninh", id % 2 === 0 ? 75 : 0);
    },
  ),

  ...Array.from(
    {
      length: 8,
    },
    (_, index) => {
      const id = index + 10;

      return createTravelImage(id, "Da Lat", id % 2 === 0 ? 75 : 0);
    },
  ),
];

/**
 * Second gallery row:
 * 18–21 → Ha Giang
 * 22–26 → Quang Ninh
 * 27–34 → Da Lat
 *
 * The source alternates depth 100 and 0.
 */
export const studioTravelBottomRow: StudioTravelImage[] = [
  ...Array.from(
    {
      length: 4,
    },
    (_, index) => {
      const id = index + 18;

      return createTravelImage(id, "Ha Giang", id % 2 === 0 ? 100 : 0);
    },
  ),

  ...Array.from(
    {
      length: 5,
    },
    (_, index) => {
      const id = index + 22;

      return createTravelImage(id, "Quang Ninh", id % 2 === 0 ? 100 : 0);
    },
  ),

  ...Array.from(
    {
      length: 8,
    },
    (_, index) => {
      const id = index + 27;

      return createTravelImage(id, "Da Lat", id % 2 === 0 ? 100 : 0);
    },
  ),
];

export const studioTravelStops: StudioTravelStop[] = [
  {
    id: 1,
    label: "Hagiang",
    icon: "/icons/trip.svg",
    widthIndex: 4,
  },
  {
    id: 2,
    label: "Quangninh",
    icon: "/icons/trip2.svg",
    widthIndex: 5,
  },
  {
    id: 3,
    label: "Dalat",
    icon: "/icons/trip3.svg",
    widthIndex: 5,
  },
];
