import { getPresignedUrl, PresignedUrlResponse } from "./api";

/**
 * 1. Backend API에 Presigned URL을 요청합니다.
 * @param {string} fileName - 업로드할 파일의 이름.
 * @returns {Promise<PresignedUrlResponse>} - S3 업로드에 필요한 정보 (URL, fields).
 */
export const requestPresignedUpload = async (
  fileName: string,
): Promise<PresignedUrlResponse> => {
  return getPresignedUrl(fileName);
};

/**
 * 2. 발급받은 Presigned URL을 사용해 파일을 S3에 직접 업로드합니다.
 * @param {PresignedUrlResponse} presigned - `requestPresignedUpload`에서 받은 Presigned URL 정보.
 * @param {File} file - 업로드할 실제 파일 객체.
 * @returns {Promise<string>} - 업로드 완료 후 S3 객체의 key를 반환합니다.
 */
export const uploadFileToS3 = async (
  presigned: PresignedUrlResponse,
  file: File,
): Promise<string> => {
  const formData = new FormData();

  // API에서 받은 fields를 FormData에 추가합니다.
  Object.entries(presigned.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // 'Content-Type'과 같은 필드는 S3 Policy에 따라 presigned.fields에 포함되어야 합니다.
  // 이 예제에서는 백엔드가 생성한 presigned post에 의존하며, 프론트엔드에서 필드를 추가하지 않습니다.

  // 마지막으로 실제 파일 데이터를 추가합니다. 'file'이라는 필드 이름은 서버 설정과 일치해야 합니다.
  formData.append('file', file);

  // FormData를 S3 Presigned URL로 POST 요청합니다.
  const response = await fetch(presigned.url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    // S3에서 에러 응답이 XML 형식으로 올 수 있습니다.
    const errorText = await response.text();
    console.error("S3 Upload Error:", errorText);
    throw new Error(
      `S3 파일 업로드에 실패했습니다. 상태: ${response.status}`
    );
  }
  
  // 업로드가 성공하면, 파일의 S3 key를 반환합니다.
  // 이 key는 'generate' API 호출 시 `fileId`로 사용될 수 있습니다.
  return presigned.key;
};
