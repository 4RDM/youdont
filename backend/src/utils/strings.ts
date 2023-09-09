const pI = parseInt;

export interface rgbObject {
	r: number;
	g: number;
	b: number;
}

export type hexString = `#${string}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type rgbString = rgbObject | `rgb(${any})`;

export const hexToDec = (hex: string): string => BigInt(`0x${hex}`).toString(10);
export const decToHex = (dec: string): string => BigInt(dec).toString(16);
export const octToDec = (oct: string): string => BigInt(`0o${oct}`).toString(10);
export const decToOct = (dec: string): string => BigInt(dec).toString(8);
export const hexToRGB = (hex: hexString): rgbObject => {
    const ihex = hex.replace("#", "");

    if (ihex.length !== 6) return { r: 0, g: 0, b: 0 };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(ihex);

    return { r, g, b };
};

export const rgbToHex = (rgb: rgbString): string => {
    let temp = "";

    if (typeof rgb === "string") {
        const irgb = rgb.replace("rgb(", "").replace(")", "");
        const ispl = irgb.split(" ").join("").split(",");

        const r = pI(ispl[0]), g = pI(ispl[1]), b = pI(ispl[2]);
        const obj = [r, g, b].map(v => {
            if (isNaN(v) || v > 255 || v < 0) return 0;
            else return v;
        });

        obj.forEach(x => (temp += x.toString(16)));
    } else {
        [rgb.r, rgb.g, rgb.b].forEach(v => (temp += v.toString(16)));
    }

    return temp;
};
