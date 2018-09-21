import {
    Output,
    ChangeDetectionStrategy,
    Component,
    ElementRef, Input,
    OnDestroy, EventEmitter,
    ViewEncapsulation, Host, HostBinding
} from '@angular/core';

import { FocusMonitor } from '@ptsecurity/cdk/a11y';


export enum State {
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
    get tabIndex(): number {
        return this.readonly ? -1 : this._tabIndex;
    }

    @HostBinding('attr.tabIndex')
    @Input()
    set tabIndex(value: number) {
        this._tabIndex = value;
    }

    @Input()
    readonly = false;

    @Input()
    selected = false;

    @Output()
    selectedChange = new EventEmitter<boolean>();

    @Input()
    mode: 'color' | 'white' = 'color';

    @Input()
    state: State = State.Info;

    private _tabIndex: number = 0;

    constructor(private _elementRef: ElementRef, private _focusMonitor: FocusMonitor) {
        this._focusMonitor.monitor(this._elementRef.nativeElement, false);
    }

    get stateClass() {
        switch (this.state) {
            case State.Error:
                return `${name}__error`;
            case State.Info:
                return `${name}__info`;
            case State.Success:
                return `${name}__success`;
            case State.Warning:
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

    private get hostElement() {
        return this._elementRef.nativeElement;
    }
}
