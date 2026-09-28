// Reference images sent to the image model so every generated Purrito keeps the
// same composition, wrap, foil and lighting as the menu art. Each protein maps to
// its own breed shot; proteins without a kitten photo fall back to DEFAULT.
const img = (file: string) => `/site/images/${file}`;

type PurritoReference = { image: string; breed: string };

const DEFAULT_REFERENCE: PurritoReference = {
  image: img("04_American_Shorthair.png"),
  breed: "American Shorthair",
};

const REFERENCES: Record<string, PurritoReference> = {
  "maine-coon-asado": { image: img("01_Maine_Coon.png"), breed: "Maine Coon" },
  ragdoll: { image: img("02_Ragdoll.png"), breed: "Ragdoll" },
  "american-shorthair": DEFAULT_REFERENCE,
  "bengal-barbacoa": { image: img("05_Bengal.png"), breed: "Bengal" },
  catnitas: { image: img("03_British_Shorthair.png"), breed: "British Shorthair" },
  siamese: { image: img("06_Siamese.png"), breed: "Siamese" },
};

export function referenceFor(proteinId: string | null | undefined): PurritoReference {
  return (proteinId && REFERENCES[proteinId]) || DEFAULT_REFERENCE;
}

// The server only forwards images from this list, so clients can't make it fetch arbitrary URLs.
export function isAllowedReference(path: string): boolean {
  return Object.values(REFERENCES).some((ref) => ref.image === path);
}
