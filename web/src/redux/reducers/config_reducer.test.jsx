/*
 * Postfacto, a free, open-source and self-hosted retro tool aimed at helping
 * remote teams.
 *
 * Copyright (C) 2016 - Present Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 *
 * it under the terms of the GNU Affero General Public License as
 *
 * published by the Free Software Foundation, either version 3 of the
 *
 * License, or (at your option) any later version.
 *
 *
 *
 * This program is distributed in the hope that it will be useful,
 *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *
 * GNU Affero General Public License for more details.
 *
 *
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import '../../spec_helper';
import ConfigReducer from './config_reducer';

describe('ConfigReducer', () => {
  let configReducer;
  beforeEach(() => {
    configReducer = ConfigReducer();
  });

  it('sets initial state', () => {
    const state = configReducer(undefined, {});

    expect(state).toEqual({
      featureFlags: {
        archiveEmails: false,
      },
      environment: {
        isMobile640: false,
        isMobile1030: false,
      },
    });
  });

  describe('FEATURE_FLAGS_UPDATED', () => {
    it('replaces the feature flags', () => {
      const featureFlags = {
        archiveEmails: true,
      };

      const action = {
        type: 'FEATURE_FLAGS_UPDATED',
        payload: featureFlags,
      };

      const state = configReducer(undefined, action);

      expect(state.featureFlags).toEqual(featureFlags);
    });
  });

  describe('WINDOW_SIZE_UPDATED', () => {
    it('replaces the environment flags', () => {
      const newEnvironment = {
        isMobile640: false,
        isMobile1030: true,
      };

      const action = {
        type: 'WINDOW_SIZE_UPDATED',
        payload: newEnvironment,
      };

      const state = configReducer(undefined, action);

      expect(state.environment).toEqual(newEnvironment);
    });
  });
});
