import { handler as spacesHandler } from '../src/services/spaces-handler';

process.env.AWS_REGION = "eu-central-1";
process.env.TABLE_NAME = "SpaceTable-02e63528725b";

// spacesHandler(
//     {
//         httpMethod: 'POST',
//         body: JSON.stringify({ name: 'tokyo-loc', location: 'Tokyo' }),
//     } as any,
//     {} as any,
// ).then((res) => {
//     console.log(res);
// });

spacesHandler(
    {
        httpMethod: 'GET',
        // queryStringParameters: {
        //     id: 'ea7a4f66-a42d-4bfb-a9dd-839e9976a993',
        // },
    } as any,
    {} as any,
).then((res) => console.log(res));

// spacesHandler(
//     {
//         httpMethod: 'PUT',
//         queryStringParameters: {
//             id: 'ea7a4f66-a42d-4bfb-a9dd-839e9976a993',
//         },
//         body: JSON.stringify({ location: 'Warszawa' }),
//     } as any,
//     {} as any,
// );

// spacesHandler(
//     {
//         httpMethod: 'DELETE',
//         queryStringParameters: {
//             id: 'fd1180f9-a754-49f2-ae95-94a534d10799',
//         },
//     } as any,
//     {} as any,
// );
