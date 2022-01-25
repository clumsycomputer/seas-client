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
    aaa: {
      contentListId: 'aaa',
      contentListTitle: 'electronic music #1',
      contentListRating: 'notSafeForWork',
      contentListCurator: {
        userAccountId: 'aaa',
        username: 'jmath',
      },
      contentListItems: [
        {
          contentTitle: 'Los Angeles',
          contentAuthor: 'Totally Enormous Extinct Dinosaurs',
          contentLink: {
            contentHostName: 'youtube',
            contentHref: 'todo',
          },
        },
        {
          contentTitle: 'Das Wort',
          contentAuthor: 'DJ Koze',
          contentLink: {
            contentHostName: 'youtube',
            contentHref: 'todo',
          },
        },
        {
          contentTitle: 'Sooner',
          contentAuthor: 'WhoMadeWho',
          contentLink: {
            contentHostName: 'youtube',
            contentHref: 'https://youtu.be/UnJ8h5BKwQs',
          },
          // contentLinks: [
          // {
          //   contentHostName: 'youtube',
          //   contentHref: 'https://youtu.be/UnJ8h5BKwQs',
          // },
          //   {
          //     contentHostName: 'spotify',
          //     contentHref:
          //       'https://open.spotify.com/track/4764iXim5VO3mVjHFcuj3b?si=0d673f3dfbf844d2',
          //   },
          // ],
        },
        {
          contentTitle: 'All I Ever Need',
          contentAuthor: 'Caribou',
          contentLink: {
            contentHostName: 'youtube',
            contentHref: 'https://youtu.be/PFcdXvJIfSM',
          },
        },
        {
          contentTitle: 'Love Divide',
          contentAuthor: 'Ross From Friends',
          contentLink: {
            contentHostName: 'youtube',
            contentHref: 'todo',
          },
        },
        {
          contentTitle: 'Such A Bad Way',
          contentAuthor: 'Against All Logic',
          contentLink: {
            contentHostName: 'youtube',
            contentHref: 'https://youtu.be/aSgezZ4fC1Y',
          },
        },
        {
          contentTitle: 'Turn It All Down',
          contentAuthor: 'Bibio',
          contentLink: {
            contentHostName: 'youtube',
            contentHref: 'https://youtu.be/g7vwM8p2XBE',
          },
        },
        {
          contentTitle: 'Hustler',
          contentAuthor: 'Simian Mobile Disco',
          contentLink: {
            contentHostName: 'youtube',
            contentHref: 'todo',
          },
        },
        {
          contentTitle: 'Topdown',
          contentAuthor: 'Channel Tres',
          contentLink: {
            contentHostName: 'youtube',
            contentHref: 'https://youtu.be/8pReEUxHxJM',
          },
        },
        {
          contentTitle: 'Let U No',
          contentAuthor: 'Dj Rashad',
          contentLink: {
            contentHostName: 'youtube',
            contentHref: 'todo',
          },
        },
        // {
        //   contentId: '3',
        //   contentTitle: 'Love Just Died Tonight',
        //   contentAuthor: 'Bastien Keb',
        //   contentLinks: [
        //     {
        //       contentHostName: 'youtube',
        //       contentHref: 'todo',
        //     },
        //     {
        //       contentHostName: 'spotify',
        //       contentHref: 'todo',
        //     },
        //   ],
        // },
        // {
        //   contentId: '2',
        //   contentTitle: 'The Son of the Sun',
        //   contentAuthor: 'The 2 Bears',
        //   contentLinks: [
        //     {
        //       contentHostName: 'youtube',
        //       contentHref: 'https://youtu.be/2jEf5FZyjVE',
        //     },
        //     {
        //       contentHostName: 'spotify',
        //       contentHref:
        //         'https://open.spotify.com/track/7300apJrwWCARQaJBRnBLi?si=0e0acfde527c4be2',
        //     },
        //   ],
        // },
      ],
    },
  },
}
