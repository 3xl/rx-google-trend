const { Stories, Trends} = require('../index.js');

const trends = new Trends();

// trends.countries('it')
//     .subscribe(
//         response => console.log(response),
//         error => console.log(error),
//         () => {
//             console.log('Completed');

//             process.exit()
//         }
//     )

// trends.categories('it')
//     .subscribe(
//         response => console.log(response),
//         error => console.log(error),
//         () => {
//             console.log('Completed');

//             process.exit()
//         }
//     )

trends.multiline(['gardening'], { language: 'en-US' })
    .subscribe(
        response => console.log(response),
        error => console.log(error),
        () => {
            console.log('Completed');

            process.exit()
        }
    )

// trends.comparedgeo(['gardening'], { geo: 'IT', language: 'en-US' })
//     .subscribe(
//         response => console.log(response),
//         error => console.log(error),
//         () => {
//             console.log('Completed');

//             process.exit()
//         }
//     )

// trends.relatedsearches('gardening', { language: 'en-US', geo: 'IT' })
// // trends.relatedsearches('gardening', { time: { min: '2016-11-30', max: '2017-11-30' } })
//     .subscribe(
//         response => console.log(response),
//         error => console.log(error),
//         () => {
//             console.log('Completed');

//             process.exit()
//         }
//     )

// const stories = new Stories();

// stories.latest('all', 'it', 'IT')
//     .subscribe(
//         response => console.log(response),
//         error => console.log(error),
//         () => {
//             console.log('Completed');

//             process.exit()
//         }
//     )