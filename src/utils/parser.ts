import { Parser } from "expr-eval";

export const parser = new Parser();

parser.functions.sum = (...v: Array<number>) => v.reduce((a, v) => a + v);

parser.consts = {
    pi: Math.PI,
    e: Math.E,
    true: true,
    false: false,
};
