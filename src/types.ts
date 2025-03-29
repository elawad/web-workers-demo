/// <reference types="@rsbuild/core/types" />

type MsgWork = { id: string; file: File; size: number };
type MsgDone = { id: string; image?: ImageBitmap };

export type { MsgWork, MsgDone };
