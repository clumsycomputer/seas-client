import { ContentList } from './models/ContentList'
import { UserAccount } from './models/UserAccount'

export const appData: {
  userAccounts: {
    [userAccountId: string]: UserAccount
  }
  contentLists: {
    [contentListId: string]: ContentList
  }
} = {
  userAccounts: {
    aaa: {
      userAccountId: 'aaa',
      username: 'jmath',
    },
  },
  contentLists: {
    // aaa: {
    //   contentListId: 'aaa',
    //   contentListTitle: 'electronic music #1',
    //   contentListRating: 'NOT_SAFE_FOR_WORK',
    //   contentListCurator: {
    //     userAccountId: 'aaa',
    //     username: 'jmath',
    //   },
    //   contentListItems: [
    //     {
    //       contentItemTitle: 'Los Angeles',
    //       contentItemAuthor: 'Totally Enormous Extinct Dinosaurs',
    //       contentItemLinks: {
    //         contentHostName: 'youtube',
    //         contentHref: 'todo',
    //       },
    //     },
    //     {
    //       contentItemTitle: 'Das Wort',
    //       contentItemAuthor: 'DJ Koze',
    //       contentItemLinks: {
    //         contentHostName: 'youtube',
    //         contentHref: 'todo',
    //       },
    //     },
    //     {
    //       contentItemTitle: 'Sooner',
    //       contentItemAuthor: 'WhoMadeWho',
    //       contentItemLinks: {
    //         contentHostName: 'youtube',
    //         contentHref: 'https://youtu.be/UnJ8h5BKwQs',
    //       },
    //       // contentItemLinkss: [
    //       // {
    //       //   contentHostName: 'youtube',
    //       //   contentHref: 'https://youtu.be/UnJ8h5BKwQs',
    //       // },
    //       //   {
    //       //     contentHostName: 'spotify',
    //       //     contentHref:
    //       //       'https://open.spotify.com/track/4764iXim5VO3mVjHFcuj3b?si=0d673f3dfbf844d2',
    //       //   },
    //       // ],
    //     },
    //     {
    //       contentItemTitle: 'All I Ever Need',
    //       contentItemAuthor: 'Caribou',
    //       contentItemLinks: {
    //         contentHostName: 'youtube',
    //         contentHref: 'https://youtu.be/PFcdXvJIfSM',
    //       },
    //     },
    //     {
    //       contentItemTitle: 'Love Divide',
    //       contentItemAuthor: 'Ross From Friends',
    //       contentItemLinks: {
    //         contentHostName: 'youtube',
    //         contentHref: 'todo',
    //       },
    //     },
    //     {
    //       contentItemTitle: 'Such A Bad Way',
    //       contentItemAuthor: 'Against All Logic',
    //       contentItemLinks: {
    //         contentHostName: 'youtube',
    //         contentHref: 'https://youtu.be/aSgezZ4fC1Y',
    //       },
    //     },
    //     {
    //       contentItemTitle: 'Turn It All Down',
    //       contentItemAuthor: 'Bibio',
    //       contentItemLinks: {
    //         contentHostName: 'youtube',
    //         contentHref: 'https://youtu.be/g7vwM8p2XBE',
    //       },
    //     },
    //     {
    //       contentItemTitle: 'Hustler',
    //       contentItemAuthor: 'Simian Mobile Disco',
    //       contentItemLinks: {
    //         contentHostName: 'youtube',
    //         contentHref: 'todo',
    //       },
    //     },
    //     {
    //       contentItemTitle: 'Topdown',
    //       contentItemAuthor: 'Channel Tres',
    //       contentItemLinks: {
    //         contentHostName: 'youtube',
    //         contentHref: 'https://youtu.be/8pReEUxHxJM',
    //       },
    //     },
    //     {
    //       contentItemTitle: 'Let U No',
    //       contentItemAuthor: 'Dj Rashad',
    //       contentItemLinks: {
    //         contentHostName: 'youtube',
    //         contentHref: 'todo',
    //       },
    //     },
    //     // {
    //     //   contentId: '3',
    //     //   contentTitle: 'Love Just Died Tonight',
    //     //   contentItemAuthor: 'Bastien Keb',
    //     //   contentItemLinkss: [
    //     //     {
    //     //       contentHostName: 'youtube',
    //     //       contentHref: 'todo',
    //     //     },
    //     //     {
    //     //       contentHostName: 'spotify',
    //     //       contentHref: 'todo',
    //     //     },
    //     //   ],
    //     // },
    //     // {
    //     //   contentId: '2',
    //     //   contentTitle: 'The Son of the Sun',
    //     //   contentItemAuthor: 'The 2 Bears',
    //     //   contentItemLinkss: [
    //     //     {
    //     //       contentHostName: 'youtube',
    //     //       contentHref: 'https://youtu.be/2jEf5FZyjVE',
    //     //     },
    //     //     {
    //     //       contentHostName: 'spotify',
    //     //       contentHref:
    //     //         'https://open.spotify.com/track/7300apJrwWCARQaJBRnBLi?si=0e0acfde527c4be2',
    //     //     },
    //     //   ],
    //     // },
    //   ],
    // },
  },
}
