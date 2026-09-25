import { K as require_react, Y as __toESM, s as require_jsx_runtime } from "./react-dom-Dk58sb-z.js";
import { i as useNavigate, n as toast } from "./dist-Dgzuy_xe.js";
import { a as TOPPINGS, d as CONTRACT_ADDRESS, f as Button, i as SIDES, l as saveOrder, n as PROTEINS, o as findItem, p as createLucideIcon, r as RICE, s as money, t as DRINKS, u as SiteHeader } from "./menu-BRPakc10.js";
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Check = createLucideIcon("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]);
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function randomDigits(length) {
	let out = "";
	for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10).toString();
	return out;
}
function ChoiceRow({ item, selected, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "ghost",
		onClick: onToggle,
		"aria-pressed": selected,
		className: `group relative flex h-[142px] w-full justify-start overflow-hidden rounded-none border bg-card p-0 text-left shadow-none transition-colors hover:bg-muted/50 ${selected ? "border-brand ring-1 ring-brand" : "border-border"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full w-[142px] shrink-0 overflow-hidden bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: item.img,
					alt: item.name,
					loading: "lazy",
					className: TOPPINGS.concat(RICE).some((topping) => topping.id === item.id) || SIDES.concat(DRINKS).some((other) => other.id === item.id) ? "h-full w-full object-contain" : "h-full w-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col justify-center px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display whitespace-normal text-[22px] font-bold uppercase leading-[26px] text-brand",
						children: item.name
					}),
					item.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base font-normal leading-[22px] text-muted-foreground",
						children: item.detail
					}) : null,
					item.detail2 ?? (item.price > 0 && !item.detail ? money(item.price) : null) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base font-bold leading-[22px] text-muted-foreground",
						children: item.detail2 ?? money(item.price)
					}) : null
				]
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-brand-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
			}) : null
		]
	});
}
function BuildPurrito() {
	const navigate = useNavigate();
	const [code, setCode] = (0, import_react.useState)("");
	const [protein, setProtein] = (0, import_react.useState)(null);
	const [rice, setRice] = (0, import_react.useState)([]);
	const [sides, setSides] = (0, import_react.useState)([]);
	const [drinks, setDrinks] = (0, import_react.useState)([]);
	const [toppings, setToppings] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setCode(randomDigits(36));
	}, []);
	const toggle = (list, id) => list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
	const ready = Boolean(protein);
	const selectedIds = [
		...protein ? [protein] : [],
		...rice,
		...toppings,
		...sides,
		...drinks
	];
	const total = selectedIds.reduce((sum, id) => sum + (findItem(id)?.price ?? 0), 0);
	const placeOrder = () => {
		if (!ready || !protein) {
			toast.error("Choose your kitten first");
			return;
		}
		const items = selectedIds.map((id) => {
			const item = findItem(id);
			return {
				id,
				name: item?.name ?? id,
				price: item?.price ?? 0
			};
		});
		saveOrder({
			pickup_number: code,
			protein,
			rice,
			toppings,
			sides,
			drinks,
			items,
			total,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		navigate({
			to: "/order/$pickup",
			params: { pickup: code }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {
				title: "Purrito",
				code: CONTRACT_ADDRESS
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto flex min-h-[370px] max-w-[970px] items-center gap-8 px-5 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/site/images/header_burrito.png",
					alt: "A foil-wrapped Purrito with a kitten nestled inside",
					className: "hidden w-[320px] shrink-0 object-contain sm:block md:w-[380px]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-[19.2px] uppercase leading-[26px] text-muted-foreground",
						children: "Build Your"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-[64px] font-bold uppercase leading-none text-brand",
						children: "Purrito"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-[590px] text-base leading-[22px] text-brand",
						children: "Your choice of humanely caught, never caged kitten wrapped in a warm flour tortilla with fresh sides and drinks."
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1010px] border-t border-border px-5 pb-12 pt-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[30px] font-bold uppercase leading-9 text-brand",
						children: "Protein or Veggie"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-base leading-[22px] text-muted-foreground",
						children: "Select one or more."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-7 grid gap-4 sm:grid-cols-2",
						children: PROTEINS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceRow, {
							item,
							selected: protein === item.id,
							onToggle: () => setProtein(protein === item.id ? null : item.id)
						}, item.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12 border-t border-border pt-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-[30px] font-bold uppercase leading-9 text-brand",
								children: "Rice"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-base leading-[22px] text-muted-foreground",
								children: "Select one or more."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-7 grid gap-4 sm:grid-cols-2",
								children: RICE.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceRow, {
									item,
									selected: rice.includes(item.id),
									onToggle: () => setRice((prev) => toggle(prev, item.id))
								}, item.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12 border-t border-border pt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[30px] font-bold uppercase leading-9 text-brand",
							children: "Top Things Off"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-7 grid gap-4 sm:grid-cols-2",
							children: TOPPINGS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceRow, {
								item,
								selected: toppings.includes(item.id),
								onToggle: () => setToppings((prev) => toggle(prev, item.id))
							}, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12 border-t border-border pt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[30px] font-bold uppercase leading-9 text-brand",
							children: "Sides"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-7 grid gap-4 sm:grid-cols-2",
							children: SIDES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceRow, {
								item,
								selected: sides.includes(item.id),
								onToggle: () => setSides((prev) => toggle(prev, item.id))
							}, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12 border-t border-border pt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[30px] font-bold uppercase leading-9 text-brand",
							children: "Drinks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-7 grid gap-4 sm:grid-cols-2",
							children: DRINKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceRow, {
								item,
								selected: drinks.includes(item.id),
								onToggle: () => setDrinks((prev) => toggle(prev, item.id))
							}, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-16 max-w-[970px] text-center text-[12px] leading-[17px] text-muted-foreground",
						children: "©2026 This $PURRITO has no affiliation with a company, has no intrinsic use, fundamental value, or known future yield. It is classified as a digital collectible meant for novelty and entertainment, rather than a traditional financial investments or security."
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-muted shadow-[0_-2px_8px_var(--bottom-shadow)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex min-h-[76px] max-w-[1100px] items-center justify-between gap-4 px-5 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hidden text-sm font-bold text-brand sm:block",
						children: ready ? `Total ${money(total)}` : "Choose your kitten to build your Purrito"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						disabled: !ready,
						onClick: placeOrder,
						className: "ml-auto h-12 w-full rounded-sm bg-brand px-10 font-display text-base font-bold uppercase text-brand-foreground hover:bg-brand-hover sm:w-auto",
						children: "Build Purrito"
					})]
				})
			})
		]
	});
}
//#endregion
export { BuildPurrito as component };
