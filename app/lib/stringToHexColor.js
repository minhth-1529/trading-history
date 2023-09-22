export const colorDictionaryDefault = {
    color: {
        failed: '#333',
        transaction_fail: '#333',
    },
    background: {
        true: '#073b4c',
        false: '#06D6A0',
        active: '#37bc9b',
        inactive: '#55595c',
        inactivate: '#55595c',
        closed: '#da4453',
        trial: '#06d6a0',
        upgraded: '#073b4c',
        expired: '#ef476f',
        other: '#78350f',
        retry_ssn: '#118ab2',
        retry_document: '#06d6a0',
        transaction_fail: '#ffd166',
        pending: '#FFA959',
        ready: '#118ab2',
        processed: '#073b4c',
        processing: '#073b4c',
        return: '#065f46',
        cancelled: '#ef476f',
        canceled: '#ef476f',
        failed: '#ffd166',
        effective: '#436FD1',
        ineffective: '#12B3EE',
        warning: '#FD523E',
        rejected: '#FD523E',
        risk: '#FFB800',
        cancel: '#b7b7b7',
        new: '#fd523e',
        working: '#436fd1',
        done: '#00b75b',
        suspended: '#CCCCCC',
        'Invalid value': '#CCCCCC',
        'Very bad': '#FD5051',
        Bad: '#FFA959',
        Normal: '#61EF94',
        Good: '#6FBEFB',
        'Very good': '#9063E9',
        ticket: '#06d6a0',
        task: '#436FD1',
        ticket_status_draft: '#ff7875',
        ticket_status_new: '#f6bb42',
        ticket_status_open: '#da4453',
        ticket_status_pending: '#3bafda',
        ticket_status_done: '#0066e2',
        ticket_status_solved: '#424242',
        ticket_status_closed: '#bdbdbd',
        ticket_priority_low: '#55595c',
        ticket_priority_normal: '#04c99f',
        ticket_priority_high: '#f3ca01',
        ticket_priority_urgent: '#de173e',
        up_sale: '#00b75b',
        downgrade: '#9063E9',
        upgrade: '#6FBEFB',
        new_sign_up: '#0891b2',
        approved: '#37bc9b',
        completed: '#37bc9b',
    },
};

export const colorDictionary = {
    default: colorDictionaryDefault,
    aeDashboard: {
        color: {
            ...colorDictionaryDefault.color,
        },
        background: {
            ...colorDictionaryDefault.background,
            problem: '#9b9b9b',
            open: '#FB8000',
        },
    },
};

const stringToHexColor = (value = '', category = 'background', dictionary = 'default') => {
    let hash = 0;
    if (!value || value.length === 0) return hash;
    for (let i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const temp = (hash >> (i * 8)) & 255;
        color += ('00' + temp.toString(16)).substr(-2);
    }
    if (colorDictionary?.[dictionary]?.[category]?.[value]) color = colorDictionary?.[dictionary][category][value];
    if (category === 'color') color = colorDictionary?.[dictionary]?.[category]?.[value] ?? '#fff';
    return color;
};

export const hexToRgbA = (hex, opacity) => {
    let c;
    let op = opacity || 0.7;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255, op].join(',') + ')';
    }
    throw new Error('Bad Hex');
};

export default stringToHexColor;
