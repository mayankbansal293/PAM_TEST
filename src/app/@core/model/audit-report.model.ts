export enum changeByList {
    PLAYER = 'PLAYER',
    BO = 'BO'
}
export class BankingProfileModel {
    static readonly changeByConfig = {
        displayKey: "userName",
        search: true,
        placeholder: "Select",
        clearOnSelection: true,
        searchOnKey: "userName",
    }
    static readonly changeByList = [
        { key: changeByList.PLAYER, display: 'Player' },
        { key: changeByList.BO, display: 'BackOffice' }
    ]
}

export class userUpdate {
    static readonly changedDataKeys = [
        { keys: ['status'], values: 'Status' },
        { keys: ['oldBlockStatus'], values: 'Status' },
        { keys: ['mobileNumber'], values: 'Mobile Number' },
        { keys: ['blockStatus'], values: 'Status' },
        { keys: ['emailId'], values: 'Email ID' },
        { keys: ['lastName'], values: 'Last Name' },
        { keys: ['firstName'], values: 'First Name' },
        { keys: ['zipCode'], values: 'Address' },
        { keys: ['country'], values: 'Address' },
        { keys: ['city'], values: 'Address' },
        { keys: ['addressTwo'], values: 'Address' },
        { keys: ['cityCode'], values: 'Address' },
    ]


    static readonly configChannel = {
        displayKey: "channelNameChannelId",
        search: true,
        height: 'auto',
        placeholder: 'Select Channel',
        customComparator: () => { },
        noResultsFound: 'No results found!',
        clearOnSelection: true,
        searchOnKey: 'channelNameChannelId'
    }
}