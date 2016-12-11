/*
 * Squidex Headless CMS
 * 
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved
 */

import * as Ng2Http from '@angular/http';
import * as TypeMoq from 'typemoq';

import { Observable } from 'rxjs';

import {
    ApiUrlConfig,
    AppClientDto,
    AppClientsService,
    AuthService,
    CreateAppClientDto,
    DateTime,
    UpdateAppClientDto
} from './../';

describe('AppClientsService', () => {
    let authService: TypeMoq.Mock<AuthService>;
    let appClientsService: AppClientsService;

    beforeEach(() => {
        authService = TypeMoq.Mock.ofType(AuthService);
        appClientsService = new AppClientsService(authService.object, new ApiUrlConfig('http://service/p/'), null);
    });

    it('should make get request to get app clients', () => {
        authService.setup(x => x.authGet('http://service/p/api/apps/my-app/clients'))
            .returns(() => Observable.of(
                new Ng2Http.Response(
                    new Ng2Http.ResponseOptions({
                        body: [{
                            id: 'client1',
                            name: 'Client 1',
                            secret: 'secret1',
                            expiresUtc: '2016-12-12T10:10'
                        }, {
                            id: 'client2',
                            name: 'Client 2',
                            secret: 'secret2',
                            expiresUtc: '2016-11-11T10:10'
                        }]
                    })
                )
            ))
            .verifiable(TypeMoq.Times.once());

        let clients: AppClientDto[] = null;

        appClientsService.getClients('my-app').subscribe(result => {
            clients = result;
        }).unsubscribe();

        expect(clients).toEqual(
            [
                new AppClientDto('client1', 'secret1', 'Client 1', DateTime.parseISO_UTC('2016-12-12T10:10')),
                new AppClientDto('client2', 'secret2', 'Client 2', DateTime.parseISO_UTC('2016-11-11T10:10'))
            ]);

        authService.verifyAll();
    });

    it('should make post request to create client', () => {
        const dto = new CreateAppClientDto('client1');

        authService.setup(x => x.authPost('http://service/p/api/apps/my-app/clients', TypeMoq.It.isValue(dto)))
            .returns(() => Observable.of(
               new Ng2Http.Response(
                    new Ng2Http.ResponseOptions({
                        body: {
                            id: 'client1',
                            name: 'Client 1',
                            secret: 'secret1',
                            expiresUtc: '2016-12-12T10:10'
                        }
                    })
                )
            ))
            .verifiable(TypeMoq.Times.once());

        let client: AppClientDto = null;

        appClientsService.postClient('my-app', dto).subscribe(result => {
            client = result;
        });

        expect(client).toEqual(
            new AppClientDto('client1', 'secret1', 'Client 1', DateTime.parseISO_UTC('2016-12-12T10:10')));

        authService.verifyAll();
    });

    it('should make put request to rename client', () => {
        const dto = new UpdateAppClientDto('Client 1 New');

        authService.setup(x => x.authPut('http://service/p/api/apps/my-app/clients/client1', TypeMoq.It.isValue(dto)))
            .returns(() => Observable.of(
               new Ng2Http.Response(
                    new Ng2Http.ResponseOptions()
                )
            ))
            .verifiable(TypeMoq.Times.once());

        appClientsService.updateClient('my-app', 'client1', dto);

        authService.verifyAll();
    });

    it('should make delete request to remove client', () => {
        authService.setup(x => x.authDelete('http://service/p/api/apps/my-app/clients/client1'))
            .returns(() => Observable.of(
               new Ng2Http.Response(
                    new Ng2Http.ResponseOptions()
                )
            ))
            .verifiable(TypeMoq.Times.once());

        appClientsService.deleteClient('my-app', 'client1');

        authService.verifyAll();
    });
});