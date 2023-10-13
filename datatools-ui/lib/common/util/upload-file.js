// @flow

import fetch from 'isomorphic-fetch'

import {getHeaders} from './util'

export function uploadFile ({
  file, token, url
}: {
  file: File, token: string, url: string
}) {
  return fetch(url, {
    method: 'post',
    headers: getHeaders(token, true, 'application/zip'),
    body: file
  })
}
