export default {
    users: [
        {
            id: 1,
            name: "AJ Bates",
        },
    ],

    jobs: [
        {
            id: 1,
            name: "JL Beers",
            role: "Supervisor",
            hourly: 15.00
        },
        {
            id: 2,
            name: "JL Beers",
            role: "Beertender",
            hourly: 10.00
        }
    ],

    shift: [
        {
            id: 1,
            userId: 1,
            jobId: 2,
            tips: 100,
            hours: 5.5,
            date: new Date(2020, 7, 1)
        },
        {
            id: 2,
            userId: 1,
            jobId: 2,
            tips: 120,
            hours: 5.3,
            date: new Date(2020, 7, 2)
        },
        {
            id: 3,
            userId: 1,
            jobId: 2,
            tips: 115,
            hours: 4.78,
            date: new Date(2020, 7, 4)
        },
        {
            id: 4,
            userId: 1,
            jobId: 2,
            tips: 175,
            hours: 6.74,
            date: new Date(2020, 7, 3)
        },
        {
            id: 5,
            userId: 1,
            jobId: 2,
            tips: 153,
            hours: 5.53,
            date: new Date("2020-8-5")
        },
        {
            id: 6,
            userId: 1,
            jobId: 2,
            tips: 85,
            hours: 4.6,
            date: new Date(2020, 6, 26)
        },
        {
            id: 7,
            userId: 1,
            jobId: 2,
            tips: 123,
            hours: 5,
            date: new Date(2020, 6, 28)
        },
        {
            id: 8,
            userId: 1,
            jobId: 2,
            tips: 99,
            hours: 5.32,
            date: new Date(2019, 11, 25)
        }
    ],

    paychecks: [
        {
            id: 1,
            jobId: 1,
            userId: 1,
            paycheck: 350,
            date: new Date(2020, 7, 1)
        },
        {
            id: 2,
            jobId: 1,
            userId: 1,
            paycheck: 300,
            date: new Date(2019, 6, 1)
        }
    ]
}