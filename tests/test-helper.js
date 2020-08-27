import Application from 'first-ember-project/app';
import config from 'first-ember-project/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
