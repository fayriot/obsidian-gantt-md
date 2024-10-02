import {Notice} from 'obsidian';
import {GanttOptions, ParsedOptions} from 'src/interfaces';

const REQUIRED_KEYS = ['tick', 'path', 'width', 'start', 'end'];

export const parseOptions = (options: string): GanttOptions => {
    const parsedOptions = options.split('\n');

    const optsArr: any = parsedOptions
        .map((opt: string) => {
            const [key, value] = opt.split(':');
            if (!!key && !!value) {
                return {key, value};
            }
        })
        .filter((opt: ParsedOptions) => !!opt)
        .reduce((obj, item: ParsedOptions) => Object.assign(obj, {[item.key]: item.value.trim()}), {});

    REQUIRED_KEYS.forEach(key => {
        if (!Object.keys(optsArr).find(k => k === key)) {
            new Notice(`Gantt.md: Missing required option: ${key}`);
            throw new Error(`Missing required option: ${key}`);
        }
    });

    Object.keys(optsArr).forEach((key: string) => {
        if (key === 'path' || key === 'type') {
            return;
        }

        if (key === 'start' || key === 'end') {
            let prefix = '';
            if (optsArr[key].startsWith('-')) {
                prefix = '-';
            }

            optsArr[key] = Number(prefix + optsArr[key].split('-').join(''));
            return;
        }

        optsArr[key] = Number(optsArr[key]);
    });

    const result = {...optsArr};

    return result;
};

