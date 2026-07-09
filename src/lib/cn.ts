/**
 * cn.ts — classname combinator. Joins truthy class strings with a space.
 * Project didn't ship with a cn utility; this is the minimal version.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
