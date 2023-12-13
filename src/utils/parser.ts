import { Parser } from "expr-eval";

export const parser = new Parser({
    operators: {
        assignment: false,
    },
});

parser.consts = {
    pi: Math.PI,
    e: Math.E,
    true: true,
    false: false,
};

const sum = (...values: Array<number>): number => values.reduce((a, v) => a + (Array.isArray(v) ? sum(...v) : v), 0);
const avg = (...values: Array<number>): number => Array.isArray(values[0]) ? avg(...values[0]) : values.reduce((a, v) => a + v, 0) / values.length;

parser.functions.sum = sum;
parser.functions.avg = avg;
parser.functions.square = (v: number) => v * v;
