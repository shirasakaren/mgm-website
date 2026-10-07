import "server-only";

import type { CmsMemberRecord } from "@/lib/member-cms";
import { MEMBER_RECORDS } from "@/lib/static-content";

/** Every member record of the directory. */
export async function ensureMemberCmsSeeded(): Promise<CmsMemberRecord[]> {
  return MEMBER_RECORDS;
}
