export type MenuItem = {
  id: string;
  name: string;
  img: string;
  /** Wide artwork used for the stacked burrito illustration. */
  layer?: string;
  detail?: string;
  detail2?: string;
  price: number;
};

const img = (file: string) => `/site/images/${file}`;
const layerImg = (file: string) => `/site/images/build/${file}`;

export const TORTILLA_IMG = layerImg("tortilla.png");

export const PROTEINS: MenuItem[] = [
  { id: "maine-coon-asado", name: "Maine Coon Asado", img: img("01_Maine_Coon.png"), detail: "180 cal", price: 10.95 },
  { id: "ragdoll", name: "Ragdoll", img: img("02_Ragdoll.png"), detail: "150 cal", price: 10.45 },
  { id: "american-shorthair", name: "American Shorthair", img: img("04_American_Shorthair.png"), detail: "170 cal", price: 10.45 },
  { id: "bengal-barbacoa", name: "Bengal Barbacoa", img: img("05_Bengal.png"), detail: "210 cal", price: 11.45 },
  { id: "catnitas", name: "Catnitas", img: img("03_British_Shorthair.png"), detail: "210 cal", price: 11.25 },
  { id: "siamese", name: "Siamese", img: img("06_Siamese.png"), detail: "150 cal", price: 10.45 },
  { id: "veggie", name: "Veggie", img: img("07_Cat_Food.png"), detail: "230 cal", price: 9.45 },
];

export const RICE: MenuItem[] = [
  { id: "white-rice", name: "White Rice", img: img("white-rice.png"), layer: layerImg("white_rice.png"), detail: "Cilantro-Lime", detail2: "210 cal", price: 0 },
  { id: "brown-rice", name: "Brown Rice", img: img("brown-rice.png"), layer: layerImg("white_rice.png"), detail: "Cilantro-Lime", detail2: "210 cal", price: 0 },
];

export const TOPPINGS: MenuItem[] = [
  { id: "cilantro-lime-sauce", name: "Cilantro Lime Sauce", img: img("cilantro-lime-sauce.png"), layer: layerImg("white_rice.png"), detail: "Made Fresh Daily", detail2: "80 cal", price: 0 },
  { id: "guacamole", name: "Guacamole", img: img("guacamole.png"), layer: layerImg("guacamole.png"), detail: "$2.90", detail2: "230 cal", price: 2.9 },
  { id: "fresh-tomato-salsa", name: "Fresh Tomato Salsa", img: img("fresh-tomato-salsa.png"), layer: layerImg("tomato_salsa.png"), detail: "Mild", detail2: "25 cal", price: 0 },
  { id: "roasted-chili-corn-salsa", name: "Roasted Chili-Corn Salsa", img: img("roasted-chili-corn-salsa.png"), layer: layerImg("corn_salsa.png"), detail: "Medium", detail2: "80 cal", price: 0 },
  { id: "tomatillo-green-chili-salsa", name: "Tomatillo-Green Chili Salsa", img: img("tomatillo-green-chili-salsa.png"), layer: layerImg("tomatillo_green_salsa.png"), detail: "Medium", detail2: "15 cal", price: 0 },
  { id: "tomatillo-red-chili-salsa", name: "Tomatillo-Red Chili Salsa", img: img("tomatillo-red-chili-salsa.png"), layer: layerImg("salsa_verde.png"), detail: "Hot", detail2: "30 cal", price: 0 },
  { id: "sour-cream", name: "Sour Cream", img: img("sour-cream.png"), layer: layerImg("sour_cream.png"), detail2: "110 cal", price: 0 },
  { id: "fajita-veggies", name: "Fajita Veggies", img: img("fajita-veggies.png"), layer: layerImg("fajita_vegetables.png"), detail2: "20 cal", price: 0 },
  { id: "cheese", name: "Cheese", img: img("cheese.png"), layer: layerImg("cheese.png"), detail2: "110 cal", price: 0 },
  { id: "romaine-lettuce", name: "Romaine Lettuce", img: img("romaine-lettuce.png"), layer: layerImg("lettuce.png"), detail2: "5 cal", price: 0 },
  { id: "queso-blanco", name: "Queso Blanco", img: img("queso-blanco.png"), layer: layerImg("black_beans.png"), detail: "$1.60", detail2: "120 cal", price: 1.6 },
];

export const SIDES: MenuItem[] = [
  { id: "side-mouse", name: "Side of Mouse", img: img("mouse.png"), price: 5.1 },
  { id: "side-bird", name: "Side of Bird", img: img("bird.png"), price: 4.75 },
  { id: "side-gecko", name: "Side of Gecko", img: img("gecko.png"), price: 6.15 },
];

export const DRINKS: MenuItem[] = [
  { id: "pure-water", name: "Pure Water", img: img("water.png"), price: 3.55 },
  { id: "organic-milk", name: "Organic Milk", img: img("milk.png"), price: 3.55 },
  { id: "ice-cubes", name: "Ice Cubes", img: img("ice.png"), price: 3.55 },
  { id: "fish-stew", name: "Fish Stew", img: img("fish.png"), price: 3.55 },
];

const ALL = [...PROTEINS, ...RICE, ...TOPPINGS, ...SIDES, ...DRINKS];

export function findItem(id: string): MenuItem | undefined {
  return ALL.find((item) => item.id === id);
}

export function money(value: number) {
  return `$${value.toFixed(2)}`;
}
