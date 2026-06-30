"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiStdResponses = ApiStdResponses;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("@nestjs/swagger");
const ApiResponseDto_1 = require("./ApiResponseDto");
function buildSchema(dataSchema, code, message) {
    const props = {};
    if (code)
        props.code = { type: 'string', example: code };
    if (message)
        props.message = { type: 'string', example: message };
    if (dataSchema)
        props.data = dataSchema;
    const allOf = [
        { $ref: (0, swagger_2.getSchemaPath)(ApiResponseDto_1.ApiResponseDto) },
        { type: 'object', properties: props },
    ];
    return { allOf };
}
function ApiStdResponses(options) {
    const dataSchema = options?.okDataDto
        ? { $ref: (0, swagger_2.getSchemaPath)(options.okDataDto) }
        : options?.okDataSchema;
    const okSchema = buildSchema(dataSchema, options?.okExampleCode, options?.okExampleMessage);
    const extraModels = [
        ApiResponseDto_1.ApiResponseDto,
        ...(options?.okDataDto ? [options.okDataDto] : []),
        ...(options?.requestBodyDtos ?? []),
    ];
    const requestBodyDecorator = options?.requestBodyDtos && options.requestBodyDtos.length > 0
        ? (0, swagger_1.ApiBody)({
            description: options.requestBodyDescription,
            schema: options.requestBodyDtos.length === 1
                ? { $ref: (0, swagger_2.getSchemaPath)(options.requestBodyDtos[0]) }
                : {
                    oneOf: options.requestBodyDtos.map((dto) => ({
                        $ref: (0, swagger_2.getSchemaPath)(dto),
                    })),
                },
        })
        : undefined;
    const consumesDecorator = options?.consumes
        ? (0, swagger_1.ApiConsumes)(options.consumes)
        : undefined;
    // ✅ Path params 데코레이터들 생성
    const pathParamDecorators = options?.pathParams?.map((p) => (0, swagger_1.ApiParam)({
        name: p.name,
        description: p.description,
        required: p.required ?? true,
        example: p.example,
        enum: p.enum,
        schema: p.schema,
    })) ?? [];
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: options?.summary,
        description: options?.description,
    }), (0, swagger_1.ApiExtraModels)(...extraModels), ...(consumesDecorator ? [consumesDecorator] : []), ...(requestBodyDecorator ? [requestBodyDecorator] : []), 
    // ✅ 여기!
    ...pathParamDecorators, (0, swagger_1.ApiOkResponse)({ description: '200 SUCCESS - 요청 성공', schema: okSchema }), (0, swagger_1.ApiBadRequestResponse)({ description: '400 INVALID_REQUEST - 요청 오류' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: '401 UNAUTHORIZED - 인증 필요' }), (0, swagger_1.ApiForbiddenResponse)({ description: '403 FORBIDDEN - 권한 없음' }), (0, swagger_1.ApiNotFoundResponse)({ description: '404 NOT_FOUND - 대상 없음' }), (0, swagger_1.ApiConflictResponse)({ description: '409 CONFLICT - 충돌' }), (0, swagger_1.ApiPayloadTooLargeResponse)({ description: '413 PAYLOAD_TOO_LARGE - 파일 용량 초과' }), (0, swagger_1.ApiUnsupportedMediaTypeResponse)({ description: '415 UNSUPPORTED_MEDIA_TYPE - 미지원 형식' }), (0, swagger_1.ApiUnprocessableEntityResponse)({ description: '422 UNPROCESSABLE_ENTITY - 처리 불가' }), (0, swagger_1.ApiTooManyRequestsResponse)({ description: '429 TOO_MANY_REQUESTS - 요청 과다' }), (0, swagger_1.ApiInternalServerErrorResponse)({ description: '500 INTERNAL_ERROR - 서버 오류' }), (0, swagger_1.ApiBadGatewayResponse)({ description: '502 BAD_GATEWAY - 게이트웨이 오류' }), (0, swagger_1.ApiServiceUnavailableResponse)({ description: '503 SERVICE_UNAVAILABLE - 서비스 불가' }));
}
//# sourceMappingURL=api-response.decorator.js.map