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

import React from 'react';
import {Actions} from 'p-flux';
import {connect} from 'react-redux';
import types from 'prop-types';
import {ConnectedRetroCreatePage} from './retro-create/retro_create_page';
import {ConnectedListRetrosPage} from './retros-list/list_retros_page';
import {ConnectedShowRetroPage} from './retro-show/show_retro_page';
import {ConnectedShowRetroSettingsPage} from './retro-settings/show_retro_settings_page';
import {ConnectedShowRetroPasswordSettingsPage} from './retro-settings/show_retro_password_settings_page';
import {ConnectedLoginToRetroPage} from './retro-login/login_to_retro_page';
import ApiServerNotFoundPage from './server-lost/api_server_not_found_page';
import RetroNotFoundPage from './retro-not-found/retro_not_found_page';
import NotFoundPage from './not-found/not_found_page';
import NewTermsPage from './terms/new_terms_page';
import EmptyPage from './shared/empty_page';
import HomePage from './home/home_page';
import {ConnectedListRetroArchivesPage} from './retro-archives/list_retro_archives_page';
import Alert from './shared/alert';
import RegistrationPage from './registration/registration_page';
import useRouter from './use_router';


export class Router extends React.Component {
  static propTypes = {
    router: types.object.isRequired,
    config: types.object,
    alert: types.object,
    not_found: types.object,
  };

  static defaultProps = {
    config: null,
    alert: null,
    not_found: {},
  };

  constructor(props) {
    super(props);
    this.state = {Page: EmptyPage, additionalProps: {}};
  }

  componentDidMount() {
    const {router} = this.props;

    router.get('*', this.showNotFound);
    router.get('/', this.showHome);
    router.get('/retros/:retroId', this.showRetro);
    router.get('/retros/:retroId/archives', this.listRetroArchives);
    router.get('/retros/:retroId/archives/:archiveId', this.showRetroArchive);
    router.get('/retros/:retroId/login', this.loginToRetro);
    router.get('/retros/:retroId/relogin', this.reloginToRetro);
    router.get('/retros/:retroId/settings', this.showRetroSettings);
    router.get('/retros/:retroId/settings/password', this.showRetroPasswordSettings);
    router.get('/terms', this.showTerms);
    router.get('/registration/:accessToken/:email/:fullName', this.showRegistration);
  }

  setPage(page, additionalProps = {}) {
    this.setState({Page: page, additionalProps});
  }

  componentWillReceiveProps(nextProps) {
    // eslint-disable-next-line react/prop-types
    const {api_server_not_found, retro_not_found, not_found} = nextProps.not_found;
    if (api_server_not_found) {
      this.setPage(ApiServerNotFoundPage);
    }
    if (retro_not_found) {
      this.setPage(RetroNotFoundPage);
    }
    if (not_found) {
      this.setPage(NotFoundPage);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.Page !== prevState.Page) {
      Actions.hideAlert();
    }
  }

  showRetro = (req) => {
    const {retroId} = req.params;
    if (retroId === 'new') {
      this.setPage(ConnectedRetroCreatePage);
      return;
    }

    this.setPage(ConnectedShowRetroPage, {retroId, archives: false});
  };

  listRetros = () => {
    this.setPage(ConnectedListRetrosPage);
  };

  listRetroArchives = (req) => {
    const {retroId} = req.params;
    this.setPage(ConnectedListRetroArchivesPage, {retroId});
  };

  showRetroArchive = (req) => {
    const {retroId, archiveId} = req.params;
    this.setPage(ConnectedShowRetroPage, {retroId, archives: true, archiveId});
  };

  showRetroSettings = (req) => {
    const {retroId} = req.params;
    this.setPage(ConnectedShowRetroSettingsPage, {retroId});
  };

  showRetroPasswordSettings = (req) => {
    const {retroId} = req.params;
    this.setPage(ConnectedShowRetroPasswordSettingsPage, {retroId});
  };

  showNotFound = () => {
    this.setPage(NotFoundPage);
  };

  showTerms = () => {
    this.setPage(NewTermsPage);
  };

  loginToRetro = (req) => {
    const {retroId} = req.params;
    this.setPage(ConnectedLoginToRetroPage, {retroId});
  };

  reloginToRetro = (req) => {
    const {retroId} = req.params;
    this.setPage(ConnectedLoginToRetroPage, {retroId, force_relogin: true});
  };

  showHome = () => {
    if (this.isUserLoggedIn()) {
      this.listRetros();
    } else {
      this.setPage(HomePage);
    }
  };

  showRegistration = (req) => {
    const {accessToken, email, fullName} = req.params;
    this.setPage(RegistrationPage, {accessToken, email, fullName});
  };

  render() {
    const {Page, additionalProps} = this.state;
    const {alert} = this.props;

    return (
      <div>
        <Alert alert={alert}/>
        <Page config={this.props.config} {...additionalProps}/>
      </div>
    );
  }

  isUserLoggedIn() {
    return localStorage.getItem('authToken');
  }
}

const EnhancedRouter = useRouter(Router);


const mapStateToProps = (state) => ({
  alert: state.messages.alert,
  not_found: state.messages.not_found,
});

const ConnectedRouter = connect(mapStateToProps)(EnhancedRouter);

export {EnhancedRouter, ConnectedRouter};
