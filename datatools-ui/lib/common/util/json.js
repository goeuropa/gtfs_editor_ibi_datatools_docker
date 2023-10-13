// @flow

import { analyze } from 'jju'

/**
 * Check if a string is valid JSON.
 */
export function isValidJSON (str: string): boolean {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

/**
 * Check if a string is valid JSONC that OTP should be able to
 * parse. OTP allows comments and unquoted keys, but not other
 * fancy stuff. See OTP json parser here:
 * https://github.com/opentripplanner/OpenTripPlanner/blob/27f4ed0a86157bdd4c4bc3004fec25687768d373/src/main/java/org/opentripplanner/standalone/OTPMain.java#L190-L194
 */
export function isValidJSONC (str: string): boolean {
  try {
    const result = analyze(str)
    if (
      // if JSON has quotes with single quotes, it is invalid
      result.quote_types.indexOf("'") > -1 ||
        // if JSON has a multi-line quote, it is invalid
        result.has_multi_line_quote ||
        // if JSON has trailing commas, it is invalid
        result.has_trailing_comma
    ) {
      return false
    }
    return true
  } catch (e) {
    return false
  }
}
