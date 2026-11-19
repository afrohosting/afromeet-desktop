
import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';

import addGroupIcon from '../../../images/add-group.png';
import type { IState } from '../../../types';
import config from '../../config';
import { SettingsButton, SettingsDrawer } from '../../settings';

import HelpButton from './HelpButton';
import Logo from './Logo';


const NavBar = styled.nav`
    background: #1a1a1a;
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: space-between;
    padding: 8px 0;
    width: 64px;
`;

const NavSection = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const NavItem = styled.div`
    align-items: center;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    display: flex;
    justify-content: center;
    padding: 8px;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
        color: white;
    }
`;

const NavButton = styled(NavItem.withComponent('button'))`
    background: transparent;
    border: none;

    &:focus-visible {
        outline: 2px solid white;
        outline-offset: 2px;
    }
`;

const ScheduleIcon = styled.img`
    filter: invert(1);
`;

/**
 * Opens the scheduling page from the launcher.
 *
 * @returns {ReactElement}
 */
function ScheduleButton() {
    const { t } = useTranslation();
    const label = t('scheduleMeeting');

    return (
        <NavButton
            aria-label = { label }
            onClick = { () => window.jitsiElectronApp.openExternalLink(config.scheduleMeetingURL) }
            title = { label }
            type = 'button'>
            <ScheduleIcon
                alt = ''
                height = { 24 }
                src = { addGroupIcon }
                width = { 24 } />
        </NavButton>
    );
}

interface IProps {
    _isSettingsDrawerOpen?: boolean;
}


/**
 * Navigation Bar component.
 */
class Navbar extends Component<IProps> {
    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <>
                <NavBar>
                    <NavSection>
                        <NavItem>
                            <Logo />
                        </NavItem>
                        <ScheduleButton />
                        <NavItem>
                            <SettingsButton />
                        </NavItem>
                    </NavSection>
                    <NavSection>
                        <NavItem>
                            <HelpButton />
                        </NavItem>
                    </NavSection>
                </NavBar>
                <SettingsDrawer isOpen = { this.props._isSettingsDrawerOpen } />
            </>
        );
    }
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _isSettingsDrawerOpen
 * }}
 */
function _mapStateToProps(state: IState) {
    return {
        _isSettingsDrawerOpen: state.navbar.openDrawer === SettingsDrawer
    };
}


export default connect(_mapStateToProps)(Navbar);
