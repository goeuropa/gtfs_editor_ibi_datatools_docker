// @flow
import {saveAs} from 'file-saver'

/**
 * This downloads a file using file-saver. Previously a custom method was used
 * (essentially the link.click simulation found here
 * https://stackoverflow.com/a/14966131/915811). However, that method no longer
 * works with the latest version of Chrome.
 */
export default function fileDownload (data: any, filename: string, type: string): void {
  const blob: Blob = new window.Blob([data], {type})
  saveAs(blob, filename)
}
