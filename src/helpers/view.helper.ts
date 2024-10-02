import {App} from 'obsidian';
import {GanttFileMeta, GanttOptions, GanttOptionsTypeEnum, GanttPluginSettings} from 'src/interfaces';
import {getGroupedItems} from './collection.helper';
import {formatDate} from './format.helper';
import {getContainerCells, getContainerVirtualWidth, getItemPercentMargin, getItemPercentWidth} from './math.helper';

export const drawWrapper = (opts: GanttOptions, htmlContent: string): HTMLDivElement => {
    const div = document.createElement('div');
    div.addClass('gantt-md-wrapper');

    div.innerHTML = '<div class="gantt-md-container" style="width: ' + opts.width + 'px;">' + htmlContent + '</div>';

    return div;
};

export const drawContainerBackground = (opts: GanttOptions, settings: GanttPluginSettings): string => {
    let result = '';
    const cells = getContainerCells(opts, opts.tick ? (opts.type === GanttOptionsTypeEnum.DATES ? Number(opts.tick + '' + '0101') : opts.tick) : 1000, settings); // todo fix ticks

    result += `<div class="gantt-md-container-background">`;

    for (let i = 0; i < cells.length; i++) {
        const margin = i === 0 ? i : (100 / cells.length) * i;

        // todo pass onlyNumber from options
        result += `
    		<div class="gantt-md-container-background-scale" style="left: ${margin}%">
    			<div class="gantt-md-container-background-scale-text">
    			${formatDate(cells[i].start, true, opts.type, true)}
    			</div>
    		</div>
    		`;

        if (i === cells.length - 1) {
            result += `
    		<div class="gantt-md-container-background-scale" style="left: calc(100% - 1px)">
    			<div class="gantt-md-container-background-scale-text">
    			${formatDate(cells[i].end, true, opts.type, true)}
    			</div>
    		</div>
    		`;
        }
    }

    result += `</div>`;

    return result;
};

export const drawPeriods = (opts: GanttOptions, periods: GanttFileMeta[], app: App): string => {
    let result = '';

    if (!periods.length) {
        return result;
    }
    const sortedLinks = getGroupedItems(periods, opts);

    result += `<div class="gantt-md-container-periods">`;
    result += drawItems(sortedLinks, opts, app);
    result += `</div>`;

    return result;
};

export const drawEvents = (opts: GanttOptions, links: GanttFileMeta[], app: App): string => {
    const sortedLinks = getGroupedItems(links, opts);
    let result = '';

    result += `<div class="gantt-md-container-items">`;
    result += drawItems(sortedLinks, opts, app);
    result += `</div>`;

    return result;
};

const drawTitle = (link: GanttFileMeta, opts: GanttOptions): string => {
    return link.displayName ?? link.name; //todo hide from config
};

const drawSubtitle = (link: GanttFileMeta, opts: GanttOptions): string => {
    if (link.displayDuration) {
        return link.displayDuration; //todo hide from config
    }

    return `${formatDate(link.displayDate.start, false, opts.type)} - ${formatDate(link.displayDate.end, false, opts.type)}`;
};

const drawItems = (sortedLinks: any[], opts: GanttOptions, app: App): string => {
    let result = '';

    sortedLinks.forEach((l: GanttFileMeta[]) => {
        result += `<div class="gantt-md-container-item-container">`;

        l.forEach((link: GanttFileMeta) => {
            if (link.date.start === undefined || link.date.end === undefined) {
                return;
            }

            const width = getContainerVirtualWidth(opts);
            const itemWidth = getItemPercentWidth(link.date.start, link.date.end, width);
            const margin = getItemPercentMargin(opts, link.date.start);

            result += `
				<div
				class="gantt-md-container-item"
				style="min-width: ${itemWidth}%; width: ${itemWidth}%; left: ${margin}%; background-color: ${link.color}; color: ${link.colorText}"
				onclick="window.open('obsidian://open?vault=${encodeURIComponent(app.vault.getName())}&file=${link.path}', '_self')"
				>
					<div class="gantt-md-container-item-title">${drawTitle(link, opts)}</div>
					<div class="gantt-md-container-item-subtitle">${drawSubtitle(link, opts)}</div>
					<div class="gantt-md-container-item-shadow" style="box-shadow: inset -15px 0 9px -7px ${link.color ?? '#939190'};"></div>
				  </div>
				`;
        });

        result += `</div>`;
    });

    return result;
};

