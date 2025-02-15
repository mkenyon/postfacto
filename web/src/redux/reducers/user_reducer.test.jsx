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
import UserReducer from './user_reducer';

describe('UserReducer', () => {
  let sessionReducer;
  beforeEach(() => {
    sessionReducer = UserReducer();
  });

  it('sets initial state', () => {
    const state = sessionReducer(undefined, {});

    expect(state).toEqual({
      websocketSession: {},
    });
  });

  describe('WEBSOCKET_SESSION_UPDATED', () => {
    it('replaces the session', () => {
      const session = {
        request_uuid: '111',
      };

      const action = {
        type: 'WEBSOCKET_SESSION_UPDATED',
        payload: session,
      };

      const state = sessionReducer(undefined, action);

      expect(state.websocketSession).toEqual(session);
    });
  });
});
