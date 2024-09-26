import {App} from 'obsidian';
import {GanttFileMeta, GanttOptions} from 'src/interfaces';
import {getGroupedItems} from './collection.helper';
import {formatDate} from './format.helper';
import {getContainerCells, getContainerVirtualWidth, getItemPercentMargin, getItemPercentWidth} from './math.helper';

export const drawWrapper = (opts: GanttOptions, htmlContent: string): HTMLDivElement => {
    const div = document.createElement('div');
    div.addClass('gantt-md-wrapper');

    div.innerHTML = '<div class="gantt-md-container" style="width: ' + opts.width + 'px;">' + htmlContent + '</div>';

    return div;
};

export const drawContainerBackground = (opts: GanttOptions): string => {
    let result = '';
    const cells = getContainerCells(opts, opts.tick ? (opts.type === 'dates' ? Number(opts.tick + '' + '0101') : opts.tick) : 1000);

    result += `<div class="gantt-md-container-background">`;

    for (let i = 0; i < cells.length; i++) {
        const margin = i === 0 ? i : (100 / cells.length) * i;

        result += `
    		<div class="gantt-md-container-background-scale" style="left: ${margin}%">
    			<div class="gantt-md-container-background-scale-text">
    			${formatDate(cells[i].start, false, opts.type, true)}
    			</div>
    		</div>
    		`;

        if (i === cells.length - 1) {
            result += `
    		<div class="gantt-md-container-background-scale" style="left: calc(100% - 1px)">
    			<div class="gantt-md-container-background-scale-text">
    			${formatDate(cells[i].end, false, opts.type, true)}
    			</div>
    		</div>
    		`;
        }
    }

    result += `</div>`;

    return result;
};

export const drawPeriods = (opts: GanttOptions): string => {
    let result = '';

    if (!opts.periods?.length) {
        return result;
    }

    result += `<div class="gantt-md-container-periods">`;

    for (const period of opts.periods) {
        result += `<div class="gantt-md-container-period">`;

        for (const item of period) {
            const width = getContainerVirtualWidth(opts);
            const itemWidth = getItemPercentWidth(opts.type === 'dates' ? item.start.split('-').join('') : item.start, opts.type === 'dates' ? item.end.split('-').join('') : item.end, width);
            result += `
					<div class="gantt-md-container-period-item" style="width: ${itemWidth}%; background-color: ${item.color}">${item.title}</div>
					`;
        }

        result += `</div>`;
    }

    result += `</div>`;

    return result;
};

export const drawEvents = (opts: GanttOptions, links: GanttFileMeta[], app: App): string => {
    let result = '';

    result += `<div class="gantt-md-container-items">`;

    const sortedLinks = getGroupedItems(links, opts);

    sortedLinks.forEach((l: GanttFileMeta[]) => {
        result += `<div class="gantt-md-container-item-container">`;

        l.forEach((link: GanttFileMeta) => {
            if (link.year.start === undefined || link.year.end === undefined) {
                return;
            }

            const width = getContainerVirtualWidth(opts);
            const itemWidth = getItemPercentWidth(link.year.start, link.year.end, width);
            const margin = getItemPercentMargin(opts, link.year.start);

            result += `
				<div
				class="gantt-md-container-item"
				style="width: ${itemWidth}%; left: ${margin}%; background-color: ${link.color}; color: ${link.colorText}"
				onclick="window.open('obsidian://open?vault=${encodeURIComponent(app.vault.getName())}&file=${link.path}', '_self')"
				title="${link.name}"  
				>
					<div class="gantt-md-container-item-title">${link.name}</div>
					<div class="gantt-md-container-item-subtitle">${formatDate(link.displayDate.start, false, opts.type)} - ${formatDate(link.displayDate.end, false, opts.type)}</div>
				  </div>
				`;
        });

        result += `</div>`;
    });

    result += `</div>`;

    return result;
};

