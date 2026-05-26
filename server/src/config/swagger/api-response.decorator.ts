import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiServiceUnavailableResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiUnsupportedMediaTypeResponse,
  ApiParam,
} from '@nestjs/swagger';
import { getSchemaPath } from '@nestjs/swagger';
import { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiResponseDto } from './ApiResponseDto';

type SchemaOrRef = SchemaObject | ReferenceObject;

type PathParamOption = {
  name: string;
  description?: string;
  required?: boolean; // 기본 true
  example?: any;
  enum?: any;
  schema?: SchemaObject; // 필요 시 직접 스키마 지정
};

function buildSchema(
  dataSchema?: SchemaOrRef,
  code?: string,
  message?: string,
): SchemaObject {
  const props: Record<string, SchemaOrRef> = {};

  if (code) props.code = { type: 'string', example: code };
  if (message) props.message = { type: 'string', example: message };
  if (dataSchema) props.data = dataSchema;

  const allOf: SchemaOrRef[] = [
    { $ref: getSchemaPath(ApiResponseDto) } as ReferenceObject,
    { type: 'object', properties: props } as SchemaObject,
  ];

  return { allOf } as SchemaObject;
}

export function ApiStdResponses(options?: {
  summary?: string;
  description?: string;

  // Response data
  okDataSchema?: SchemaObject;
  okDataDto?: Type<unknown>;

  okExampleCode?: string;
  okExampleMessage?: string;

  // Request body (oneOf 지원)
  requestBodyDtos?: Type<unknown>[];
  requestBodyDescription?: string;

  // content-type 지정
  consumes?: 'application/json' | 'multipart/form-data';

  // Path params 추가
  pathParams?: PathParamOption[];

  fileFieldName?: string;
}) {
  const dataSchema: SchemaOrRef | undefined = options?.okDataDto
    ? ({ $ref: getSchemaPath(options.okDataDto) } as ReferenceObject)
    : options?.okDataSchema;

  const okSchema = buildSchema(
    dataSchema,
    options?.okExampleCode,
    options?.okExampleMessage,
  );

  const extraModels: Type<unknown>[] = [
    ApiResponseDto,
    ...(options?.okDataDto ? [options.okDataDto] : []),
    ...(options?.requestBodyDtos ?? []),
  ];

  const requestBodyDecorator =
    options?.requestBodyDtos && options.requestBodyDtos.length > 0
      ? ApiBody({
          description: options.requestBodyDescription,
          schema:
            options.requestBodyDtos.length === 1
              ? { $ref: getSchemaPath(options.requestBodyDtos[0]) }
              : {
                  oneOf: options.requestBodyDtos.map((dto) => ({
                    $ref: getSchemaPath(dto),
                  })),
                },
        })
      : undefined;

  const consumesDecorator = options?.consumes
    ? ApiConsumes(options.consumes)
    : undefined;

  // ✅ Path params 데코레이터들 생성
  const pathParamDecorators =
    options?.pathParams?.map((p) =>
      ApiParam({
        name: p.name,
        description: p.description,
        required: p.required ?? true,
        example: p.example,
        enum: p.enum,
        schema: p.schema,
      }),
    ) ?? [];

  return applyDecorators(
    ApiOperation({
      summary: options?.summary,
      description: options?.description,
    }),

    ApiExtraModels(...extraModels),

    ...(consumesDecorator ? [consumesDecorator] : []),
    ...(requestBodyDecorator ? [requestBodyDecorator] : []),

    // ✅ 여기!
    ...pathParamDecorators,

    ApiOkResponse({ description: '200 SUCCESS - 요청 성공', schema: okSchema }),

    ApiBadRequestResponse({ description: '400 INVALID_REQUEST - 요청 오류' }),
    ApiUnauthorizedResponse({ description: '401 UNAUTHORIZED - 인증 필요' }),
    ApiForbiddenResponse({ description: '403 FORBIDDEN - 권한 없음' }),
    ApiNotFoundResponse({ description: '404 NOT_FOUND - 대상 없음' }),
    ApiConflictResponse({ description: '409 CONFLICT - 충돌' }),
    ApiPayloadTooLargeResponse({ description: '413 PAYLOAD_TOO_LARGE - 파일 용량 초과' }),
    ApiUnsupportedMediaTypeResponse({ description: '415 UNSUPPORTED_MEDIA_TYPE - 미지원 형식' }),
    ApiUnprocessableEntityResponse({ description: '422 UNPROCESSABLE_ENTITY - 처리 불가' }),
    ApiTooManyRequestsResponse({ description: '429 TOO_MANY_REQUESTS - 요청 과다' }),

    ApiInternalServerErrorResponse({ description: '500 INTERNAL_ERROR - 서버 오류' }),
    ApiBadGatewayResponse({ description: '502 BAD_GATEWAY - 게이트웨이 오류' }),
    ApiServiceUnavailableResponse({ description: '503 SERVICE_UNAVAILABLE - 서비스 불가' }),
  );
}
