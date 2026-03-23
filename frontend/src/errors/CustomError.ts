import { ErrorDecoder } from "ethers-decode-error";
import { ErrorMessage } from "../utils/utils";
import type { RequestResult } from "../hooks/specific/useWriteToken";

const errorDecoder = ErrorDecoder.create();

export const handleCustomErrors = async (err: any): Promise<RequestResult> => {
    const decodedError = await errorDecoder.decode(err);
    ErrorMessage(decodedError.reason! ?? "Something went wrong");
    return { success: false, reason: decodedError.reason! ?? "Unknown error" };
}