import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamoDBClient";

interface IUserCertifcate {
    name: string;
    id: string;
    created_at: string;
    grade: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { id } = event.pathParameters;

    const response = await document.query({
        TableName: "users_certificate",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id,
        },
    }).promise();

    const userCertificate = response.Items[0] as IUserCertifcate;

    if (userCertificate) {
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Certifcado válido",
                name: userCertificate.name,
                url: `https://certificatenodejs2022.s3.amazonaws.com/${id}.pdf`,
            }),
        };
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Certificado inválido!",
        }),
    };
};