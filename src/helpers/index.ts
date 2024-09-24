import { GanttOptions, ParsedOptions } from "src/interfaces";


export const parseOptions = (options: string): GanttOptions => {
	const parsedOptions = options.split('\n');

	const optsArr: GanttOptions = parsedOptions
	.map((opt: string) => {
		const [key, value] = opt.split(':');
		if (!!key && !!value) {
			return { key, value };
		}	
	})
	.filter((opt: ParsedOptions) => !!opt)
	.reduce((obj, item: ParsedOptions) => Object.assign(obj, {[item.key]: item.value.trim()}), {});
	
	const periods: any[] = [];

	Object.keys(optsArr).forEach((key: string) => {
	
		if (key.match(/^([p0-9]+)$/)) {
			const p = optsArr[key].split(';');
			const x = p.map((item: string) => {
				const r = item.split(',');
				return {
					title: r[0].trim(),
					from: Number(r[1]),
					to: Number(r[2]),
				}
			})

			periods.push(x);

			delete optsArr[key];
		} else {
			optsArr[key] = Number(optsArr[key]);
		}
	});


	const result = {...optsArr, periods: periods};

	console.log(result);

	return result;
}
