import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { McCardsModule, State } from '../../lib/cards';


@Component({
    selector: 'app',
    template: require('./template.html'),
    styleUrls: ['./styles.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CardsDemoComponent {
    state = State;
}


@NgModule({
    declarations: [
        CardsDemoComponent
    ],
    imports: [
        BrowserModule,
        McCardsModule
    ],
    bootstrap: [
        CardsDemoComponent
    ]
})
export class CardsDemoModule {}

platformBrowserDynamic()
    .bootstrapModule(CardsDemoModule)
    .catch((error) => console.error(error));

