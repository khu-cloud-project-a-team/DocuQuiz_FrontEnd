import { fetchWithAuth } from "./api";

type PresignedFields = Record<string, string>;

export interface PresignedPostPackage {
  url: string;
  fields: PresignedFields;
  key: string;
  expiresAt?: string;
  mockFileId?: string;
}

export interface PresignedRequestPayload {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface ConfirmUploadResponse {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  s3Key: string;
  s3Url: string;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const USE_UPLOAD_MOCK = process.env.NEXT_PUBLIC_USE_UPLOAD_MOCK !== "false";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ensureId = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return `mock-${Math.random().toString(36).slice(2, 10)}`;
  }
};

const buildMockPresignedPackage = (payload: PresignedRequestPayload): PresignedPostPackage => {
  const mockId = ensureId();
  const key = `uploads/${mockId}-${payload.fileName}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

  return {
    url: "https://docuquiz-demo-bucket.s3.ap-northeast-2.amazonaws.com",
    fields: {
      bucket: "docuquiz-demo-bucket",
      key,
      "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
      "X-Amz-Credential": "MOCKACCESSKEY/20250401/ap-northeast-2/s3/aws4_request",
      "X-Amz-Date": now.toISOString().replace(/[-:]/g, "").slice(0, 15),
      Policy: "mock-policy",
      "X-Amz-Signature": "mock-signature",
    },
    key,
    expiresAt,
    mockFileId: mockId,
  };
};

export const requestPresignedUpload = async (
  payload: PresignedRequestPayload,
): Promise<PresignedPostPackage> => {
  if (USE_UPLOAD_MOCK || !API_BASE_URL) {
    await sleep(400);
    return buildMockPresignedPackage(payload);
  }

  const url = new URL(`${API_BASE_URL}/file/presigned-url`);
  url.searchParams.set("fileName", payload.fileName);

  const response = await fetchWithAuth(url.toString(), {
    method: "GET",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "presigned URL 요청에 실패했습니다.");
  }

  return data;
};

export const uploadFileToS3 = async (
  presigned: PresignedPostPackage,
  file: File,
): Promise<void> => {
  if (USE_UPLOAD_MOCK || !presigned.url) {
    await sleep(800);
    return;
  }

  const formData = new FormData();
  Object.entries(presigned.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("Content-Type", file.type || "application/octet-stream");
  formData.append("file", file);

  const response = await fetch(presigned.url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText ? `S3 업로드 실패: ${errorText}` : "S3 업로드에 실패했습니다.",
    );
  }
};

export const confirmUploadMetadata = async (params: {
  fileName: string;
  s3Key: string;
  mimeType: string;
  size: number;
}): Promise<ConfirmUploadResponse> => {
  if (USE_UPLOAD_MOCK || !API_BASE_URL) {
    await sleep(400);
    const id = ensureId();
    return {
      id,
      originalName: params.fileName,
      mimeType: params.mimeType,
      size: params.size,
      s3Key: params.s3Key,
      s3Url: `https://docuquiz-demo-bucket.s3.ap-northeast-2.amazonaws.com/${params.s3Key}`,
      createdAt: new Date().toISOString(),
    };
  }

  const response = await fetchWithAuth(`${API_BASE_URL}/file/confirm-upload`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "업로드 확인에 실패했습니다.");
  }

  return data;
};
