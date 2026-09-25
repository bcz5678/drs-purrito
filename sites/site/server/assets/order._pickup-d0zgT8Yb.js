import { K as require_react, Y as __toESM, s as require_jsx_runtime, t as require_react_dom } from "./react-dom-Dk58sb-z.js";
import { n as toast, r as Link } from "./dist-Dgzuy_xe.js";
import { t as Route } from "./order._pickup-Chk0olMu.js";
import { a as TOPPINGS, c as loadOrder, d as CONTRACT_ADDRESS, f as Button, o as findItem, p as createLucideIcon, s as money, u as SiteHeader } from "./menu-BRPakc10.js";
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Download = createLucideIcon("download", [
	["path", {
		d: "M12 15V3",
		key: "m9g1x1"
	}],
	["path", {
		d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
		key: "ih7n3h"
	}],
	["path", {
		d: "m7 10 5 5 5-5",
		key: "brsn70"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LoaderCircle = createLucideIcon("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]);
//#endregion
//#region node_modules/eventsource-parser/dist/errors.js
/**
* Error thrown when encountering an issue during parsing.
*
* @public
*/
var ParseError = class extends Error {
	constructor(message, options) {
		super(message);
		this.name = "ParseError";
		this.type = options.type;
		this.field = options.field;
		this.value = options.value;
		this.line = options.line;
	}
};
//#endregion
//#region node_modules/eventsource-parser/dist/parse.js
/**
* EventSource/Server-Sent Events parser
* @see https://html.spec.whatwg.org/multipage/server-sent-events.html
*/
var LF = 10;
var CR = 13;
var SPACE = 32;
var MAX_FIELD_PREFIX_LENGTH = 6;
/**
* Creates a new EventSource parser.
*
* @param config - Parser configuration. Accepts callbacks (see {@link ParserCallbacks})
*   and options like `maxBufferSize` (see {@link ParserConfig}).
*
* @returns A new EventSource parser, with `feed` and `reset` methods.
* @public
*/
function createParser(config) {
	if (typeof config === "function") throw new TypeError("`config` must be an object, got a function instead. Did you mean `createParser({onEvent: fn})`?");
	const { maxBufferSize, onComment, onError, onEvent, onId, onRetry } = config;
	const pendingFragments = [];
	let pendingFragmentsLength = 0;
	let bomPrefix = "";
	let id;
	let data = "";
	let dataLines = 0;
	let eventType;
	let terminated = false;
	let skippingLine = false;
	let skipNextLineFeed = false;
	/**
	* Feeds a chunk of the SSE stream to the parser. Any trailing bytes that do
	* not yet form a complete line are held back and prepended to the next chunk,
	* so callers can pass arbitrary slices of the stream without worrying about
	* line boundaries.
	*
	* Per the SSE spec, one leading UTF-8 BOM is stripped before parsing,
	* even when split across chunks. This handles both the raw 3-byte form (0xEF 0xBB
	* 0xBF) and a single decoded U+FEFF, so a leading BOM is ignored regardless of
	* how the caller decoded the bytes.
	*
	* @see https://html.spec.whatwg.org/multipage/server-sent-events.html#parsing-an-event-stream
	*/
	function feed(chunk) {
		if (terminated) throw new Error("Cannot feed parser: it was terminated after exceeding the configured max buffer size. Call `reset()` to resume parsing.");
		if (bomPrefix !== void 0) {
			chunk = bomPrefix + chunk;
			if (chunk === "" || chunk === "ï" || chunk === "ï»") {
				bomPrefix = chunk;
				return;
			}
			bomPrefix = void 0;
			chunk = chunk.replace(/^(?:\uFEFF|\xEF\xBB\xBF)/, "");
		}
		if (skippingLine || skipNextLineFeed) {
			chunk = resumeAfterSkip(chunk);
			if (!chunk) return;
		}
		if (!pendingFragments.length) {
			const trailing = processLines(chunk);
			if (trailing !== "") storeTrailing(trailing);
			checkBufferSize();
			return;
		}
		if (chunk.indexOf("\n") === -1 && chunk.indexOf("\r") === -1) {
			if (pendingFragmentsLength < MAX_FIELD_PREFIX_LENGTH) {
				if (!shouldBufferTrailing(pendingFragments.join("") + chunk.slice(0, MAX_FIELD_PREFIX_LENGTH - pendingFragmentsLength))) {
					pendingFragments.length = 0;
					pendingFragmentsLength = 0;
					skippingLine = true;
					return;
				}
			}
			pendingFragments.push(chunk);
			pendingFragmentsLength += chunk.length;
			checkBufferSize();
			return;
		}
		pendingFragments.push(chunk);
		const input = pendingFragments.join("");
		pendingFragments.length = 0;
		pendingFragmentsLength = 0;
		storeTrailing(processLines(input));
		checkBufferSize();
	}
	function resumeAfterSkip(chunk) {
		if (chunk.length === 0) return chunk;
		if (skipNextLineFeed) {
			skipNextLineFeed = false;
			return chunk.charCodeAt(0) === LF ? chunk.slice(1) : chunk;
		}
		const crIndex = chunk.indexOf("\r");
		const lfIndex = chunk.indexOf("\n");
		const lineEnd = crIndex === -1 ? lfIndex : lfIndex === -1 ? crIndex : crIndex < lfIndex ? crIndex : lfIndex;
		if (lineEnd === -1) return "";
		if (lineEnd === chunk.length - 1 && chunk.charCodeAt(lineEnd) === CR) {
			skippingLine = false;
			skipNextLineFeed = true;
			return "";
		}
		skippingLine = false;
		return chunk.slice(lineEnd + (chunk.charCodeAt(lineEnd) === CR && chunk.charCodeAt(lineEnd + 1) === LF ? 2 : 1));
	}
	function storeTrailing(trailing) {
		if (!trailing) return;
		if (trailing.charCodeAt(trailing.length - 1) === CR) {
			parseLine(trailing, 0, trailing.length - 1);
			skipNextLineFeed = true;
			return;
		}
		if (shouldBufferTrailing(trailing)) {
			pendingFragments.push(trailing);
			pendingFragmentsLength = trailing.length;
			return;
		}
		skippingLine = true;
	}
	function shouldBufferTrailing(trailing) {
		const firstCharCode = trailing.charCodeAt(0);
		return firstCharCode === 58 && !!onComment || firstCharCode === 100 && isPotentialField(trailing, "data") || firstCharCode === 101 && isPotentialField(trailing, "event") || firstCharCode === 105 && isPotentialField(trailing, "id") || firstCharCode === 114 && isPotentialField(trailing, "retry");
	}
	function checkBufferSize() {
		if (maxBufferSize === void 0) return;
		if (pendingFragmentsLength + data.length <= maxBufferSize) return;
		terminated = true;
		pendingFragments.length = 0;
		pendingFragmentsLength = 0;
		id = void 0;
		data = "";
		dataLines = 0;
		eventType = void 0;
		skippingLine = false;
		skipNextLineFeed = false;
		onError === null || onError === void 0 || onError(new ParseError(`Buffered data exceeded max buffer size of ${maxBufferSize} characters`, { type: "max-buffer-size-exceeded" }));
	}
	/**
	* Splits `chunk` into SSE lines and dispatches each to the appropriate handler.
	* Returns any trailing bytes that did not terminate with a line break, so the
	* caller can prepend them to the next chunk.
	*
	* The SSE spec permits three line terminators: `\n`, `\r`, and `\r\n`. Real-world
	* streams almost always use plain `\n`, so we take a fast path when no `\r` is
	* present in the chunk. The slow path is spec-correct but does more work per line.
	*/
	function processLines(chunk) {
		let searchIndex = 0;
		if (chunk.indexOf("\r") === -1) {
			let lfIndex = chunk.indexOf("\n", searchIndex);
			while (lfIndex !== -1) {
				if (searchIndex === lfIndex) {
					if (id !== void 0) onId === null || onId === void 0 || onId(id);
					if (dataLines > 0) onEvent === null || onEvent === void 0 || onEvent({
						id,
						event: eventType,
						data
					});
					id = void 0;
					data = "";
					dataLines = 0;
					eventType = void 0;
					searchIndex = lfIndex + 1;
					lfIndex = chunk.indexOf("\n", searchIndex);
					continue;
				}
				const firstCharCode = chunk.charCodeAt(searchIndex);
				if (isDataPrefix(chunk, searchIndex, firstCharCode)) {
					const valueStart = chunk.charCodeAt(searchIndex + 5) === SPACE ? searchIndex + 6 : searchIndex + 5;
					const value = chunk.slice(valueStart, lfIndex);
					if (dataLines === 0 && chunk.charCodeAt(lfIndex + 1) === LF) {
						if (id !== void 0) onId === null || onId === void 0 || onId(id);
						onEvent === null || onEvent === void 0 || onEvent({
							id,
							event: eventType,
							data: value
						});
						id = void 0;
						data = "";
						eventType = void 0;
						searchIndex = lfIndex + 2;
						lfIndex = chunk.indexOf("\n", searchIndex);
						continue;
					}
					data = dataLines === 0 ? value : `${data}\n${value}`;
					dataLines++;
				} else if (isEventPrefix(chunk, searchIndex, firstCharCode)) eventType = chunk.slice(chunk.charCodeAt(searchIndex + 6) === SPACE ? searchIndex + 7 : searchIndex + 6, lfIndex) || void 0;
				else parseLine(chunk, searchIndex, lfIndex);
				searchIndex = lfIndex + 1;
				lfIndex = chunk.indexOf("\n", searchIndex);
			}
			return chunk.slice(searchIndex);
		}
		while (searchIndex < chunk.length) {
			const crIndex = chunk.indexOf("\r", searchIndex);
			const lfIndex = chunk.indexOf("\n", searchIndex);
			let lineEnd = -1;
			if (crIndex !== -1 && lfIndex !== -1) lineEnd = crIndex < lfIndex ? crIndex : lfIndex;
			else if (crIndex !== -1) if (crIndex === chunk.length - 1) lineEnd = -1;
			else lineEnd = crIndex;
			else if (lfIndex !== -1) lineEnd = lfIndex;
			if (lineEnd === -1) break;
			parseLine(chunk, searchIndex, lineEnd);
			searchIndex = lineEnd + 1;
			if (chunk.charCodeAt(searchIndex - 1) === CR && chunk.charCodeAt(searchIndex) === LF) searchIndex++;
		}
		return chunk.slice(searchIndex);
	}
	function parseLine(chunk, start, end) {
		if (start === end) {
			dispatchEvent();
			return;
		}
		const firstCharCode = chunk.charCodeAt(start);
		if (isDataPrefix(chunk, start, firstCharCode)) {
			const valueStart = chunk.charCodeAt(start + 5) === SPACE ? start + 6 : start + 5;
			const value = chunk.slice(valueStart, end);
			data = dataLines === 0 ? value : `${data}\n${value}`;
			dataLines++;
			return;
		}
		if (isEventPrefix(chunk, start, firstCharCode)) {
			eventType = chunk.slice(chunk.charCodeAt(start + 6) === SPACE ? start + 7 : start + 6, end) || void 0;
			return;
		}
		if (firstCharCode === 105 && chunk.charCodeAt(start + 1) === 100 && chunk.charCodeAt(start + 2) === 58) {
			const value = chunk.slice(chunk.charCodeAt(start + 3) === SPACE ? start + 4 : start + 3, end);
			if (!value.includes("\0")) id = value;
			return;
		}
		if (firstCharCode === 58) {
			if (onComment) {
				const line = chunk.slice(start, end);
				onComment(line.slice(chunk.charCodeAt(start + 1) === SPACE ? 2 : 1));
			}
			return;
		}
		const line = chunk.slice(start, end);
		const fieldSeparatorIndex = line.indexOf(":");
		if (fieldSeparatorIndex === -1) {
			processField(line, "", line);
			return;
		}
		const field = line.slice(0, fieldSeparatorIndex);
		const offset = line.charCodeAt(fieldSeparatorIndex + 1) === SPACE ? 2 : 1;
		processField(field, line.slice(fieldSeparatorIndex + offset), line);
	}
	function processField(field, value, line) {
		switch (field) {
			case "event":
				eventType = value || void 0;
				break;
			case "data":
				data = dataLines === 0 ? value : `${data}\n${value}`;
				dataLines++;
				break;
			case "id":
				if (!value.includes("\0")) id = value;
				break;
			case "retry":
				if (/^\d+$/.test(value)) onRetry === null || onRetry === void 0 || onRetry(parseInt(value, 10));
				else onError === null || onError === void 0 || onError(new ParseError(`Invalid \`retry\` value: "${value}"`, {
					type: "invalid-retry",
					value,
					line
				}));
				break;
			default: onError === null || onError === void 0 || onError(new ParseError(`Unknown field "${field.length > 20 ? `${field.slice(0, 20)}…` : field}"`, {
				type: "unknown-field",
				field,
				value,
				line
			}));
		}
	}
	function dispatchEvent() {
		if (id !== void 0) onId === null || onId === void 0 || onId(id);
		if (dataLines > 0) onEvent === null || onEvent === void 0 || onEvent({
			id,
			event: eventType,
			data
		});
		id = void 0;
		data = "";
		dataLines = 0;
		eventType = void 0;
	}
	function reset(options = {}) {
		if (options.consume && pendingFragments.length > 0) {
			const incompleteLine = pendingFragments.join("");
			parseLine(incompleteLine, 0, incompleteLine.length);
		}
		bomPrefix = "";
		id = void 0;
		data = "";
		dataLines = 0;
		eventType = void 0;
		pendingFragments.length = 0;
		pendingFragmentsLength = 0;
		terminated = false;
		skippingLine = false;
		skipNextLineFeed = false;
	}
	return {
		feed,
		reset
	};
}
/**
* Checks if `chunk` starts with the literal `data:` at index `i`.
*
* Equivalent to `chunk.startsWith('data:', i)`, but benchmarks show this
* hand-unrolled char-code comparison is ~20% faster on common event types.
* The caller passes `firstCharCode` (the code at `i`) so it can be reused
* across prefix checks.
*
* ASCII: 'd' = 100, 'a' = 97, 't' = 116, 'a' = 97, ':' = 58
*/
function isDataPrefix(chunk, i, firstCharCode) {
	return firstCharCode === 100 && chunk.charCodeAt(i + 1) === 97 && chunk.charCodeAt(i + 2) === 116 && chunk.charCodeAt(i + 3) === 97 && chunk.charCodeAt(i + 4) === 58;
}
/**
* Checks if `chunk` starts with the literal `event:` at index `i`.
*
* See {@link isDataPrefix} for why this is hand-unrolled rather than using
* `String.prototype.startsWith`.
*
* ASCII: 'e' = 101, 'v' = 118, 'e' = 101, 'n' = 110, 't' = 116, ':' = 58
*/
function isEventPrefix(chunk, i, firstCharCode) {
	return firstCharCode === 101 && chunk.charCodeAt(i + 1) === 118 && chunk.charCodeAt(i + 2) === 101 && chunk.charCodeAt(i + 3) === 110 && chunk.charCodeAt(i + 4) === 116 && chunk.charCodeAt(i + 5) === 58;
}
function isPotentialField(line, field) {
	let i = 1;
	while (i < line.length && i < field.length) {
		if (line.charCodeAt(i) !== field.charCodeAt(i)) return false;
		i++;
	}
	return line.length <= field.length || line.charCodeAt(field.length) === 58;
}
//#endregion
//#region src/lib/streamImage.ts
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
async function streamImage(endpoint, prompt, onFrame) {
	const res = await fetch(endpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ prompt })
	});
	if (!res.ok || !res.body) throw new Error(`Image generation failed: ${res.status} ${await res.text().catch(() => "")}`);
	let sawCompleted = false;
	let sawAnyEvent = false;
	let streamError;
	const parser = createParser({ onEvent(event) {
		let payload;
		try {
			payload = JSON.parse(event.data);
		} catch {}
		if (event.event === "error" || payload?.type === "error") {
			sawAnyEvent = true;
			streamError = payload?.error?.message ?? "Image generation failed";
			return;
		}
		if (event.event !== "image_generation.partial_image" && event.event !== "image_generation.completed") return;
		if (!payload) return;
		sawAnyEvent = true;
		const isFinal = event.event === "image_generation.completed";
		(0, import_react_dom.flushSync)(() => {
			onFrame(`data:image/png;base64,${payload.b64_json}`, isFinal);
		});
		if (isFinal) sawCompleted = true;
	} });
	const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			parser.feed(value);
		}
	} finally {
		reader.cancel().catch(() => {});
	}
	if (streamError) throw new Error(streamError);
	if (!sawAnyEvent) {
		const replay = await fetch(endpoint, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				prompt,
				stream: false
			})
		});
		if (!replay.ok) throw new Error(`Image generation failed: ${replay.status}`);
		const b64 = (await replay.json()).data?.[0]?.b64_json;
		if (!b64) throw new Error("Image generation returned no image");
		onFrame(`data:image/png;base64,${b64}`, true);
		return;
	}
	if (!sawCompleted) throw new Error("Image stream ended without a completed event");
}
//#endregion
//#region src/routes/order.$pickup.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function MeatGrinderIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 3h8l-1.5 5h-5L4 3Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "4.5",
				y: "8",
				width: "7",
				height: "7",
				rx: "1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M11.5 10h3v-2.5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "15.5",
				cy: "6.5",
				r: "1.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "15",
				y: "9.5",
				width: "4.5",
				height: "4",
				rx: "0.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17.2 10.7v1.6M19.3 10.7v1.6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4.5 15l1.5 5h2l1-5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "17",
				cy: "16.5",
				r: "0.4",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "18.5",
				cy: "18.5",
				r: "0.4",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16.5",
				cy: "20",
				r: "0.4",
				fill: "currentColor"
			})
		]
	});
}
function OrderPage() {
	const { pickup } = Route.useParams();
	const [imageSrc, setImageSrc] = (0, import_react.useState)(null);
	const [isFinal, setIsFinal] = (0, import_react.useState)(false);
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const [imageError, setImageError] = (0, import_react.useState)(null);
	const [mode, setMode] = (0, import_react.useState)("photo");
	const startedFor = (0, import_react.useRef)(null);
	const [data, setData] = (0, import_react.useState)(void 0);
	(0, import_react.useEffect)(() => {
		setData(loadOrder(pickup));
	}, [pickup]);
	const isLoading = data === void 0;
	const protein = data?.protein ? findItem(data.protein) : void 0;
	const toppingList = (data?.toppings ?? []).map((id) => findItem(id)).filter((item) => Boolean(item)).sort((a, b) => TOPPINGS.findIndex((t) => t.id === a.id) - TOPPINGS.findIndex((t) => t.id === b.id));
	const riceList = (data?.rice ?? []).map((id) => findItem(id)).filter((item) => Boolean(item));
	const sideList = (data?.sides ?? []).map(findItem).filter(Boolean);
	const drinkList = (data?.drinks ?? []).map(findItem).filter(Boolean);
	const buildPrompt = (mode = "photo") => {
		const fillings = [...riceList, ...toppingList].map((item) => item.name).join(", ");
		if (mode === "splatter") return [
			"Create a heavily ground-up, mashed burrito food smear — as if the entire wrap, kitten, and fillings have been pushed through a meat grinder and smeared across the canvas like real food.",
			"Use thick, heavy, chunky smears and large drippy blobs of actual burrito ingredients — mashed beans, ground protein, rice, guacamole, salsa, sour cream, cheese — not pastel paints or art supplies.",
			"The texture should look like wet, smeared food on a surface: greasy, grainy, and lumpy, with visible bits of rice, bean skins, corn, lettuce shreds, and sauce streaks.",
			"Colors must come from real food: earthy browns, deep tomato reds, creamy whites, avocado green, corn yellow, rice tan, and foil silver — no soft pastel hues or paint-tube colors.",
			"The kitten and ingredients should be almost unrecognizable: only faint suggestions of fur, paws, tortilla, and food colors remain, blended into the chaotic ground-up mass.",
			"No clothing, collars, bandanas, costumes, accessories, or any human-added adornments appear anywhere in the image.",
			"The bottom third of the composition reads as silver-gray foil smears, merging into the ground-up burrito matter above.",
			fillings ? `Pull the color palette from the actual burrito ingredients — ${fillings.toLowerCase()} — and let those food colors streak through the chunky smears, but keep everything abstract and mushed together.` : "Pull the color palette from real burrito ingredients for the big chunky food smears, keeping everything abstract and mushed together.",
			protein ? `A barely discernible hint of ${protein.name.toLowerCase()} tone may ghost through the grind, but no clear animal shape.` : "No clear animal shapes remain.",
			"Centered composition on a clean light background. No text, lettering, logo, or watermark."
		].filter(Boolean).join(" ");
		return [
			"Create a polished, photorealistic studio product image of one playful 'Purrito'.",
			"The tortilla must be rolled into a compact, short, wide upright wrap rather than a long horizontal burrito.",
			"Its open top faces the camera, with the front tortilla flap folded across the lower half and lightly toasted brown spots visible.",
			"The bottom third of the wrap is wrapped in crinkled metallic silver foil, with the foil folded neatly up around the tortilla.",
			"A cute, realistic domestic kitten is nestled inside at the very front and center of the tortilla, about 30 percent larger than before.",
			"The kitten must be an ordinary cat with natural fur only — no clothing, collars, bandanas, costumes, accessories, or any human-added adornments.",
			"Show the kitten's head, chest, and two front paws resting naturally over the front rim; the cat must be the clear focal point, prominently sized, and must not be covered by food.",
			fillings ? `Arrange these selected ingredients visibly around and just behind the kitten: ${fillings.toLowerCase()}.` : "Keep the kitten framed by the open tortilla.",
			"Match the cheerful attached-reference style: centered symmetrical composition, compact proportions, realistic tortilla and food textures, crisp clean cutout appearance, and soft studio lighting.",
			"Show exactly one kitten and one foil-wrapped tortilla wrap. No plate, hands, people, text, lettering, logo, watermark, extra limbs, or duplicate animal."
		].filter(Boolean).join(" ");
	};
	const generate = async (nextMode) => {
		setGenerating(true);
		setImageError(null);
		setImageSrc(null);
		setIsFinal(false);
		setMode(nextMode);
		try {
			await streamImage("/api/generate-purrito", buildPrompt(nextMode), (dataUrl, final) => {
				setImageSrc(dataUrl);
				if (final) setIsFinal(true);
			});
		} catch (streamFailure) {
			const message = streamFailure instanceof Error ? streamFailure.message : "Could not create the picture";
			setImageError(message);
			toast.error(message);
		} finally {
			setGenerating(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (!data) return;
		if (startedFor.current === data.pickup_number) return;
		startedFor.current = data.pickup_number;
		generate("photo");
	}, [data]);
	const download = () => {
		if (!imageSrc) return;
		const link = document.createElement("a");
		link.download = `purrito-${pickup.slice(0, 8)}.png`;
		link.href = imageSrc;
		link.click();
		toast.success("Purrito image downloaded");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {
			title: "Your Order",
			code: CONTRACT_ADDRESS
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-[970px] px-5 py-10",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base text-muted-foreground",
				children: "Loading your order…"
			}) : !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-[40px] font-bold uppercase leading-none text-brand",
					children: "Order not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base text-muted-foreground",
					children: "We could not find an order with that pickup number."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-block font-display text-base font-bold uppercase text-brand underline",
					children: "Build a new Purrito"
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/site/images/header_burrito.png",
						alt: "A foil-wrapped Purrito with a kitten nestled inside",
						className: "hidden w-[280px] shrink-0 object-contain sm:block md:w-[340px]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-[19.2px] uppercase leading-[26px] text-muted-foreground",
							children: "Ready for pickup"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-[56px] font-bold uppercase leading-none text-brand",
							children: "Your Purrito"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-[420px] text-base leading-[22px] text-muted-foreground",
							children: "Enjoy your fluffy, delicious, piled high with bold flavors and little whiskers purrito - meow that looks good!"
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-sm border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto flex aspect-square w-full max-w-[620px] items-center justify-center overflow-hidden rounded-sm bg-muted",
						children: [imageSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: imageSrc,
							alt: "Your freshly built Purrito",
							className: isFinal ? "h-full w-full object-cover blur-0 transition-[filter] duration-500" : "h-full w-full object-cover blur-2xl transition-[filter] duration-500"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-3 px-6 text-center",
							children: [generating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-brand" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base text-muted-foreground",
								children: generating ? "Rolling your Purrito… Adorable and tasty takes some time." : imageError ?? "No picture yet."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": mode === "splatter" ? "Show original Purrito" : "Redraw as a chunky splatter painting",
							title: mode === "splatter" ? "Show original Purrito" : "Redraw as a chunky splatter painting",
							onClick: () => void generate(mode === "splatter" ? "photo" : "splatter"),
							disabled: generating,
							className: "absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-sm border border-brand bg-card/90 text-brand shadow-sm transition hover:bg-brand hover:text-brand-foreground disabled:opacity-50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeatGrinderIcon, { className: "h-6 w-6" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							onClick: () => void download(),
							disabled: !imageSrc || !isFinal,
							className: "h-12 rounded-sm bg-brand px-8 font-display text-base font-bold uppercase text-brand-foreground hover:bg-brand-hover",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Download my Purrito"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "h-12 rounded-sm border-brand px-6 font-display text-base font-bold uppercase text-brand",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								children: "Build Another Purrito"
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10 border-t border-border pt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[30px] font-bold uppercase leading-9 text-brand",
							children: "Order Details"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 divide-y divide-border",
							children: [
								...protein ? [protein] : [],
								...riceList,
								...toppingList,
								...sideList,
								...drinkList
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base text-brand",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base font-bold text-muted-foreground",
									children: item.price > 0 ? money(item.price) : "Free"
								})]
							}, item.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t-2 border-brand py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-[22px] font-bold uppercase text-brand",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-[22px] font-bold text-brand",
								children: money(Number(data.total))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowToBuy, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-16 max-w-[970px] text-center text-[12px] leading-[17px] text-muted-foreground",
					children: "©2026 This $PURRITO has no affiliation with a company, has no intrinsic use, fundamental value, or known future yield. It is classified as a digital collectible meant for novelty and entertainment, rather than a traditional financial investments or security."
				})
			] })
		})]
	});
}
var STEPS = [
	{
		numeral: "I",
		title: "Get a Wallet",
		body: "Phantom or Solflare, funded with SOL. This part you should write down."
	},
	{
		numeral: "II",
		title: "Open the Pair",
		body: "Use the buy button above, once the contract is published here."
	},
	{
		numeral: "III",
		title: "Swap",
		body: "Confirm in your wallet. Then go outside and forget where you put it."
	}
];
function HowToBuy() {
	const copyContract = async () => {
		try {
			await navigator.clipboard.writeText(CONTRACT_ADDRESS);
			toast.success("Contract address copied");
		} catch {
			toast.error("Could not copy");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-12 border-t-4 border-brand pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[48px] font-bold uppercase leading-none text-brand md:text-[64px]",
					children: "How to Buy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden pb-2 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground sm:block",
					children: "Three steps, one shovel"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-0.5 w-full bg-brand" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-8 grid gap-8 md:grid-cols-3",
				children: STEPS.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-t-4 border-brand pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-bold uppercase text-brand",
							children: step.numeral
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-display text-[30px] font-bold uppercase leading-9 text-brand",
							children: step.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-base leading-[22px] text-muted-foreground",
							children: step.body
						})
					]
				}, step.numeral))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: copyContract,
					title: "Copy contract address",
					className: "flex max-w-full items-center gap-3 border border-brand px-5 py-3 text-left transition hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-xs font-bold uppercase tracking-[0.3em] text-brand",
						children: "Contract"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "break-all font-mono text-sm font-bold text-brand",
						children: CONTRACT_ADDRESS
					})]
				})
			})
		]
	});
}
//#endregion
export { OrderPage as component };
