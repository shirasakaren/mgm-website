"use client";

import { useMemo } from "react";

import { MEMBERS, type Member } from "@/data/members";
import { mergeMemberRecords, type CmsMemberRecord } from "@/lib/member-cms";

/**
 * The member directory: the bundled members merged with the records the
 * page was built with. The site is static, so the records never change
 * after the build and nothing is refetched.
 */
export function useMemberRecords(initialRecords: readonly CmsMemberRecord[] = []) {
  const members = useMemo<Member[]>(
    () => mergeMemberRecords(MEMBERS, initialRecords),
    [initialRecords],
  );
  return { members, ready: true, records: initialRecords as CmsMemberRecord[] };
}
