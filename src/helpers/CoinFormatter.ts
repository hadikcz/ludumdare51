export default (coins: number): string => {
    let result = format(coins);
    switch (result) {
        case '1000.00 K':
            return '1.00 M';
        case '1000.00 M':
            return '1.00 B';
        case '1000.00 B':
            return '1.00 T';
        case '1000.00 T':
            return '1.00 Qa';
        case '1000.00 Qa':
            return '1.00 Qi';
        case '1000.00 Qi':
            return '1.00 Sx';
        case '1000.00 Sx':
            return '1.00 Sp';
        case '1000.00 Sp':
            return '1.00 Oc';
        case '1000.00 Oc':
            return '1.00 No';
        case '1000.00 No':
            return '1.00 De';

        case '100.0 K':
            return '100 K';
        case '100.0 M':
            return '100 M';
        case '100.0 B':
            return '100 B';
        case '100.0 T':
            return '100 T';
        case '100.0 Qa':
            return '100 Qa';
        case '100.0 Qi':
            return '100 Qi';
        case '100.0 Sx':
            return '100 Sx';
        case '100.0 Sp':
            return '100 Sp';
        case '100.0 Oc':
            return '100 Oc';
        case '100.0 No':
            return '100 No';
        case '100.0 De':
            return '100 De';

        case '1000K':
            return '1.00 M';
        case '1000M':
            return '1.00 B';
        case '1000B':
            return '1.00 T';
        case '1000T':
            return '1.00 Qa';
        case '1000Qa':
            return '1.00 Qi';
        case '1000Qi':
            return '1.00 Sx';
        case '1000Sx':
            return '1.00 M';
        case '1000Sp':
            return '1.00 Sp';
        case '1000Oc':
            return '1.00 Oc';
        case '1000No':
            return '1.00 De';
    }
    return result;
};

function format (coins: number): string {
    //////////////////////////////// De ////////////////////////////
    if (coins >= 100000000000000000000000000000000000) {
        return (
            coins / 1000000000000000000000000000000000
        ).toFixed(0) + ' De';
    }
    if (coins >= 10000000000000000000000000000000000) {
        return (
            coins / 1000000000000000000000000000000000
        ).toFixed(0) + ' De';
    }
    if (coins >= 1000000000000000000000000000000000) {
        return (
            coins / 1000000000000000000000000000000000
        ).toFixed(2) + ' De';
    }

    //////////////////////////////// No ////////////////////////////
    if (coins >= 100000000000000000000000000000000) {
        return (
            coins / 1000000000000000000000000000000
        ).toFixed(0) + ' No';
    }
    if (coins >= 10000000000000000000000000000000) {
        return (
            coins / 1000000000000000000000000000000
        ).toFixed(1) + ' No';
    }
    if (coins >= 1000000000000000000000000000000) {
        return (
            coins / 1000000000000000000000000000000
        ).toFixed(2) + ' No';
    }

    //////////////////////////////// Oc ////////////////////////////
    if (coins >= 100000000000000000000000000000) {
        return (
            coins / 1000000000000000000000000000
        ).toFixed(0) + ' Oc';
    }
    if (coins >= 10000000000000000000000000000) {
        return (
            coins / 1000000000000000000000000000
        ).toFixed(1) + ' Oc';
    }
    if (coins >= 1000000000000000000000000000) {
        return (
            coins / 1000000000000000000000000000
        ).toFixed(2) + ' Oc';
    }

    //////////////////////////////// Sp ////////////////////////////
    if (coins >= 100000000000000000000000000) {
        return (
            coins / 1000000000000000000000000
        ).toFixed(0) + ' Sp';
    }
    if (coins >= 10000000000000000000000000) {
        return (
            coins / 1000000000000000000000000
        ).toFixed(1) + ' Sp';
    }
    if (coins >= 1000000000000000000000000) {
        return (
            coins / 1000000000000000000000000
        ).toFixed(2) + ' Sp';
    }

    //////////////////////////////// Sx ////////////////////////////
    if (coins >= 100000000000000000000000) {
        return (
            coins / 1000000000000000000000
        ).toFixed(0) + ' Sx';
    }
    if (coins >= 10000000000000000000000) {
        return (
            coins / 1000000000000000000000
        ).toFixed(1) + ' Sx';
    }
    if (coins >= 1000000000000000000000) {
        return (
            coins / 1000000000000000000000
        ).toFixed(2) + ' Sx';
    }

    //////////////////////////////// Qi ////////////////////////////
    if (coins >= 100000000000000000000) {
        return (
            coins / 1000000000000000000
        ).toFixed(0) + ' Qi';
    }
    if (coins >= 10000000000000000000) {
        return (
            coins / 1000000000000000000
        ).toFixed(1) + ' Qi';
    }
    if (coins >= 1000000000000000000) {
        return (
            coins / 1000000000000000000
        ).toFixed(2) + ' Qi';
    }

    //////////////////////////////// Qa ////////////////////////////
    if (coins >= 100000000000000000) {
        return (
            coins / 1000000000000000
        ).toFixed(0) + ' Qa';
    }
    if (coins >= 10000000000000000) {
        return (
            coins / 1000000000000000
        ).toFixed(1) + ' Qa';
    }
    if (coins >= 1000000000000000) {
        return (
            coins / 1000000000000000
        ).toFixed(2) + ' Qa';
    }

    //////////////////////////////// T ////////////////////////////
    if (coins >= 100000000000000) {
        return (
            coins / 1000000000000
        ).toFixed(0) + ' T';
    }
    if (coins >= 10000000000000) {
        return (
            coins / 1000000000000
        ).toFixed(1) + ' T';
    }
    if (coins >= 1000000000000) {
        return (
            coins / 1000000000000
        ).toFixed(2) + ' T';
    }

    //////////////////////////////// B ////////////////////////////
    if (coins >= 100000000000) {
        return (
            coins / 1000000000
        ).toFixed(0) + ' B';
    }
    if (coins >= 10000000000) {
        return (
            coins / 1000000000
        ).toFixed(1) + ' B';
    }
    if (coins >= 1000000000) {
        return (
            coins / 1000000000
        ).toFixed(2) + ' B';
    }

    //////////////////////////////// M ////////////////////////////

    if (coins >= 100000000) {
        return (
            coins / 1000000
        ).toFixed(0) + ' M';
    }

    if (coins >= 10000000) {
        return (
            coins / 1000000
        ).toFixed(1) + ' M';
    }

    if (coins >= 1000000) {
        return (
            coins / 1000000
        ).toFixed(2) + ' M';
    }

    //////////////////////////////// K ////////////////////////////

    if (coins >= 100000) {
        return (
            coins / 1000
        ).toFixed(0) + ' K';
    }

    if (coins >= 10000) {
        return (
            coins / 1000
        ).toFixed(1) + ' K';
    }

    if (coins >= 1000) {
        return (
            coins / 1000
        ).toFixed(2) + ' K';
    }

    return Math.round(coins).toFixed(0);
}
