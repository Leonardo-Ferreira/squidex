/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FeatureDto } from '@app/shared';

@Component({
    selector: 'sqx-news-dialog',
    styleUrls: ['./news-dialog.component.scss'],
    templateUrl: './news-dialog.component.html'
})
export class NewsDialogComponent {
    @Output()
    public close = new EventEmitter();

    @Input()
    public features: ReadonlyArray<FeatureDto>;

    public trackByFeature(index: number, feature: FeatureDto) {
        return feature;
    }
}