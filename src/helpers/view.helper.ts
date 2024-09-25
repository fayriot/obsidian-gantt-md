import {App} from 'obsidian';
import {GanttFileMeta, GanttOptions} from 'src/interfaces';
import {formatBC} from './format.helper';
import {getContainerCells, getContainerVirtualWidth, getItemPercentMargin, getItemPercentWidth} from './math.helper';

export const drawWrapper = (opts: GanttOptions, htmlContent: string): HTMLDivElement => {
    const div = document.createElement('div');
    div.addClass('gantt-md-wrapper');

    div.innerHTML = '<div class="gantt-md-container" style="width: ' + opts.width + 'px;">' + htmlContent + '</div>';

    return div;
};

export const drawContainerBackground = (opts: GanttOptions): string => {
    let result = '';
    const cells = getContainerCells(opts, 500);

    result += `<div class="gantt-md-container-background">`;

    for (let i = 0; i < cells.length; i++) {
        const margin = i === 0 ? i : (100 / cells.length) * i;

        result += `
    		<div class="gantt-md-container-background-scale" style="left: ${margin}%">
    			<div class="gantt-md-container-background-scale-text">
    			${formatBC(cells[i].start, false)}
    			</div>
    		</div>
    		`;

        if (i === cells.length - 1) {
            result += `
    		<div class="gantt-md-container-background-scale" style="left: 100%">
    			<div class="gantt-md-container-background-scale-text">
    			${formatBC(cells[i].end, false)}
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
            const itemWidth = getItemPercentWidth(item.start, item.end, width);
            result += `
					<div class="gantt-md-container-period-item" style="width: ${itemWidth}%">${item.title}</div>
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

    links.forEach((link: GanttFileMeta) => {
        if (link.year.start === undefined || link.year.end === undefined) {
            return;
        }

        const width = getContainerVirtualWidth(opts);
        const itemWidth = getItemPercentWidth(link.year.start, link.year.end, width);
        const margin = getItemPercentMargin(opts, link.year.start);

        result += `
			<div
            class="gantt-md-container-item"
            style="width: ${itemWidth}%; margin-left: ${margin}%; background-color: ${link.color}"
			onclick="window.open('obsidian://open?vault=${encodeURIComponent(app.vault.getName())}&file=${link.path}', '_self')"
          	>
            	<div class="gantt-md-container-item-title">${link.name}</div>
            	<div class="gantt-md-container-item-subtitle">${formatBC(link.year.start)} - ${formatBC(link.year.end)}</div>
          	</div>
			`;
    });

    result += `</div>`;

    return result;
};

