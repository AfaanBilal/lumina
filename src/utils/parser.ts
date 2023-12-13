import { Parser } from "expr-eval";

export const parser = new Parser();

parser.consts = {
    pi: Math.PI,
    e: Math.E,
    true: true,
    false: false,
};

parser.functions.sum = (...v: Array<number>) => v.reduce((a, v) => a + v);

parser.functions.avg = (...v: Array<number>) => v.reduce((a, v) => a + v) / v.length;
