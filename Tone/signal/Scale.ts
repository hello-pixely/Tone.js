import { ToneAudioNodeOptions } from "Tone/core/context/ToneAudioNode";
import { optionsFromArguments } from "Tone/core/util/Defaults";
import { Add } from "./Add";
import { Multiply } from "./Multiply";
import { Signal } from "./Signal";
import { SignalOperator } from "./SignalOperator";

export interface ScaleOptions<Type> extends ToneAudioNodeOptions {
	value: Type;
	outputMin: number;
	outputMax: number;
}

/**
 *  @class  Performs a linear scaling on an input signal.
 *          Scales a NormalRange input to between
 *          outputMin and outputMax.
 *
 *  @constructor
 *  @extends {SignalOperator}
 *  @param outputMin The output value when the input is 0.
 *  @param outputMax The output value when the input is 1.
 *  @example
 * var scale = new Scale(50, 100);
 * var signal = new Signal(0.5).connect(scale);
 * //the output of scale equals 75
 */
export class Scale extends SignalOperator<ScaleOptions<number>> {

	readonly name: string = "Scale";

	input = new Multiply({
		context: this.context,
		value: 1,
	});

	output = new Add({
		context: this.context,
		value: 0,
	});

	value: number = 0;

	private _outputMin!: number;

	private _outputMax!: number;

	constructor(options?: Partial<ScaleOptions<number>>);
	// tslint:disable-next-line: unified-signatures
	constructor(value?: number);
	constructor() {
		super(Object.assign(optionsFromArguments(Scale.getDefaults(), arguments, ["value"])));

		const options = optionsFromArguments(Scale.getDefaults(), arguments, ["outputMin", "outputMax"]);
		this._outputMin = options.outputMin;
		this._outputMax = options.outputMax;

		this.connect(this.output);
		this._setRange();
	}

	static getDefaults(): ScaleOptions<number> {
		return Object.assign(Signal.getDefaults(), {
			outputMax: 1,
			outputMin: 0,
		});
	}

	get getMin(): number {
		return this._outputMin;
	}

	set setMin(min: number) {
		this._outputMin = min;
		this._setRange();
	}

	get getMax(): number {
		return this._outputMax;
	}

	set setMax(max: number) {
		this._outputMax = max;
		this._setRange();
	}

	/**
	 *  set the values
	 */
	private _setRange(): void {
		this.output.value = this._outputMin;
		this.value = this._outputMax - this._outputMin;
	}

	/**
	 *  Clean up.
	 */
	dispose(): this {
		super.dispose();
		this.input.dispose();
		this.output.dispose();
		return this;
	}
}
