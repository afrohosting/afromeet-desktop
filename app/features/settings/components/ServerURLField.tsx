import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import config from '../../config';
import FieldText from '../../shared/components/FieldText';

/**
 * Displays the fixed Afro Meet server URL.
 *
 * @param {WithTranslation} props - Component properties.
 * @returns {ReactElement}
 */
function ServerURLField({ t }: WithTranslation) {
    return (
        <FieldText
            label = { t('settings.serverUrl') }
            readOnly = { true }
            shouldFitContainer = { true }
            type = 'text'
            value = { config.defaultServerURL } />
    );
}

export default withTranslation()(ServerURLField);
