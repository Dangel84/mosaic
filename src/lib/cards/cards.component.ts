import {
    Output,
    ChangeDetectionStrategy,
    Component,
    ElementRef, Input,
    OnDestroy, EventEmitter,
    ViewEncapsulation, HostBinding
} from '@angular/core';

import { FocusMonitor } from '@ptsecurity/cdk/a11y';


export enum Status {
    Info,
    Success,
    Warning,
    Error
}

const name = 'mc-card';

@Component({
    selector: name,
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    inputs: ['color'],
    host: {
        class: name
    }
})
export class McCard implements OnDestroy {
    get tabIndex(): number | null {
        return this.readonly ? null : this._tabIndex;
    }

    @HostBinding('attr.tabIndex')
    @Input()
    set tabIndex(value: number | null) {
        this._tabIndex = value;
    }

    @HostBinding('class.mc-readonly')
    @Input()
    readonly = false;

    @Input()
    selected = false;

    @Output()
    selectedChange = new EventEmitter<boolean>();

    @Input()
    mode: 'color' | 'white' = 'color';

    @Input()
    status: Status = Status.Info;

    @HostBinding('class.mc-card__hover')
    hover  = false;

    private _tabIndex: number | null = 0;

    constructor(private _elementRef: ElementRef, private _focusMonitor: FocusMonitor) {
        this._focusMonitor.monitor(this._elementRef.nativeElement, false);
    }

    get statusClass() {
        switch (this.status) {
            case Status.Error:
                return `${name}__error`;
            case Status.Info:
                return `${name}__info`;
            case Status.Success:
                return `${name}__success`;
            case Status.Warning:
                return `${name}__warning`;
            default:
                return '';
        }
    }

    get isWhiteMode() {
        return this.mode === 'white';
    }

    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
    }

    focus(): void {
        this.hostElement.focus();
    }

    clicked($event: MouseEvent) {
        if (!this.readonly) {
            $event.stopPropagation();
            this.selectedChange.emit(!this.selected);
        }
    }

    mouseEnter() {
        this.hover = !this.readonly ? true : false
    }

    private get hostElement() {
        return this._elementRef.nativeElement;
    }
}
