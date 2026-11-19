
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch, compose } from 'redux';
import styled from 'styled-components';

import config from '../../config';
import { Navbar } from '../../navbar';
import { RecentList, addRecentListEntry } from '../../recent-list';
import Button from '../../shared/components/Button';
import FieldText from '../../shared/components/FieldText';
import Page from '../../shared/components/Page';
import { createConferenceObjectFromURL } from '../../utils';
import { Body, Form, Header, Label, Wrapper } from '../styled';


const MainFieldText = styled(FieldText)`
    input {
        height: 3em;
    }
`;

const MainGoButton = styled(Button)`
    height: 3em;
`;

const RoomNameHint = styled.span`
    color: #c6c6c6;
    font-size: 12px;
    line-height: 1.4;
`;

interface IProps extends WithTranslation {
    dispatch: Dispatch;
    location?: {
        state?: {
            error?: any;
            room?: string;
            serverURL?: string;
        };
    };
}

/**
 * Keeps room names compatible with Afro Meet URLs.
 *
 * @param {string} roomName - User-entered or generated room name.
 * @returns {string} A lowercase room name containing only a-z, 0-9 and hyphens.
 */
function sanitizeRoomName(roomName: string) {
    return roomName.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

interface IWelcomeState {
    url: string;
}


/**
 * Welcome Component.
 */
class Welcome extends Component<IProps, IWelcomeState> {
    /**
     * Initializes a new {@code Welcome} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps) {
        super(props);

        // Initialize url value in state if passed using location state object.
        let url = '';

        // Check and parse url if exists in location state.
        if (props.location?.state) {
            const { room } = props.location.state;

            if (room) {
                url = sanitizeRoomName(room);
            }
        }

        this.state = { url };

        // Bind event handlers.
        this._onURLChange = this._onURLChange.bind(this);
        this._onFormSubmit = this._onFormSubmit.bind(this);
        this._onJoin = this._onJoin.bind(this);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <Page navigation = { <Navbar /> }>
                <Wrapper>
                    { this._renderHeader() }
                    { this._renderBody() }
                </Wrapper>
            </Page>
        );
    }


    /**
     * Prevents submission of the form and delegates the join logic.
     *
     * @param {Event} event - Event by which this function is called.
     * @returns {void}
     */
    _onFormSubmit(event: React.FormEvent) {
        event.preventDefault();
        this._onJoin();
    }


    /**
     * Redirect and join conference.
     *
     * @returns {void}
     */
    _onJoin() {
        const inputURL = sanitizeRoomName(this.state.url);

        if (!inputURL) {
            return;
        }

        const conference = createConferenceObjectFromURL(
            inputURL,
            config.defaultServerURL
        );

        // Don't navigate if conference couldn't be created
        if (!conference) {
            return;
        }

        this.props.dispatch(addRecentListEntry(conference));
        window.jitsiElectronApp.ipc.send('open-meeting-window', conference);
    }


    /**
     * Keeps URL input value and URL in state in sync.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onURLChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            url: sanitizeRoomName(event.currentTarget.value)
        });
    }

    /**
     * Renders the body for the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderBody() {
        return (
            <Body>
                <RecentList />
            </Body>
        );
    }

    /**
     * Renders the header for the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderHeader() {
        const locationState = this.props.location?.state;
        const locationError = locationState?.error;
        const { t } = this.props;

        return (
            <Header>
                <Form onSubmit = { this._onFormSubmit }>
                    <Label>{ t('enterConferenceNameOrUrl') } </Label>
                    <MainFieldText
                        autoCapitalize = 'none'
                        autoFocus = { true }
                        isInvalid = { locationError }
                        isLabelHidden = { true }
                        onChange = { this._onURLChange }
                        pattern = '[a-z0-9-]*'
                        placeholder = { t('roomNamePlaceholder') }
                        shouldFitContainer = { true }
                        spellCheck = { false }
                        type = 'text'
                        value = { this.state.url } />
                    <RoomNameHint>{ t('roomNameHint') }</RoomNameHint>
                    <MainGoButton
                        appearance = 'primary'
                        onClick = { this._onJoin }
                        type = 'button'>
                        { t('go') }
                    </MainGoButton>
                </Form>
            </Header>
        );
    }


}

// redux's compose() returns a loosely-typed function; cast so the connected +
// translated component is usable as JSX / a ComponentType by consumers.
export default compose(connect(), withTranslation())(Welcome) as React.ComponentType<any>;
