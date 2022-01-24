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
          contentProducer: 'Totally Enormous Extinct Dinosaurs',
          contentLinks: [
            {
              contentHostName: 'youtube',
              contentHref: 'todo',
            },
            {
              contentHostName: 'spotify',
              contentHref: 'todo',
            },
          ],
        },
        {
          contentTitle: 'Das Wort',
          contentProducer: 'DJ Koze',
          contentLinks: [
            {
              contentHostName: 'youtube',
              contentHref: 'todo',
            },
            {
              contentHostName: 'spotify',
              contentHref: 'todo',
            },
          ],
        },
        {
          contentTitle: 'Sooner',
          contentProducer: 'WhoMadeWho',
          contentLinks: [
            {
              contentHostName: 'youtube',
              contentHref: 'https://youtu.be/UnJ8h5BKwQs',
            },
            {
              contentHostName: 'spotify',
              contentHref:
                'https://open.spotify.com/track/4764iXim5VO3mVjHFcuj3b?si=0d673f3dfbf844d2',
            },
          ],
        },
        {
          contentTitle: 'All I Ever Need',
          contentProducer: 'Caribou',
          contentLinks: [
            {
              contentHostName: 'youtube',
              contentHref: 'https://youtu.be/PFcdXvJIfSM',
            },
            {
              contentHostName: 'spotify',
              contentHref:
                'https://open.spotify.com/track/3TWq4sElJorDh8TGa81epv?si=185ef70d8fb74989',
            },
          ],
        },
        {
          contentTitle: 'Love Divide',
          contentProducer: 'Ross From Friends',
          contentLinks: [
            {
              contentHostName: 'youtube',
              contentHref: 'todo',
            },
            {
              contentHostName: 'spotify',
              contentHref: 'todo',
            },
          ],
        },
        {
          contentTitle: 'Such A Bad Way',
          contentProducer: 'Against All Logic',
          contentLinks: [
            {
              contentHostName: 'youtube',
              contentHref: 'https://youtu.be/aSgezZ4fC1Y',
            },
            {
              contentHostName: 'spotify',
              contentHref:
                'https://open.spotify.com/track/39rvm2XzKyw4dsGLKvdDQV?si=73b154464e244a88',
            },
          ],
        },
        {
          contentTitle: 'Turn It All Down',
          contentProducer: 'Bibio',
          contentLinks: [
            {
              contentHostName: 'youtube',
              contentHref: 'https://youtu.be/g7vwM8p2XBE',
            },
            {
              contentHostName: 'spotify',
              contentHref:
                'https://open.spotify.com/track/53dIRHHKpv6WXHMQRhiltQ?si=46742748b391425b',
            },
          ],
        },
        {
          contentTitle: 'Hustler',
          contentProducer: 'Simian Mobile Disco',
          contentLinks: [
            {
              contentHostName: 'youtube',
              contentHref: 'todo',
            },
            {
              contentHostName: 'spotify',
              contentHref: 'todo',
            },
          ],
        },
        {
          contentTitle: 'Topdown',
          contentProducer: 'Channel Tres',
          contentLinks: [
            {
              contentHostName: 'youtube',
              contentHref: 'https://youtu.be/8pReEUxHxJM',
            },
            {
              contentHostName: 'spotify',
              contentHref:
                'https://open.spotify.com/track/6KflfPD0qIbbB1PQyAHla5?si=3679339474ef44b2',
            },
          ],
        },
        {
          contentTitle: 'Let U No',
          contentProducer: 'Dj Rashad',
          contentLinks: [
            {
              contentHostName: 'youtube',
              contentHref: 'todo',
            },
            {
              contentHostName: 'spotify',
              contentHref: 'todo',
            },
          ],
        },
        // {
        //   contentId: '3',
        //   contentTitle: 'Love Just Died Tonight',
        //   contentProducer: 'Bastien Keb',
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
        //   contentProducer: 'The 2 Bears',
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
