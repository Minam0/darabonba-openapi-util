// This file is auto-generated, don't edit it
/**
 * This is for OpenApi Util 
 */
import * as $tea from '@alicloud/tea-typescript';
import Util from '@alicloud/tea-util';
import kitx from 'kitx';
import querystring from 'querystring';

function replaceRepeatList(target: { [key: string]: string }, repeat: any[], prefix: string) {
  if (prefix) {
    prefix = prefix + '.';
  }
  for (var i = 0; i < repeat.length; i++) {
    var item = repeat[i];
    let key = prefix + (i + 1);
    if (typeof item === 'undefined' || item == null) {
      target[key] = '';
      continue;
    }
    if (Array.isArray(item)) {
      replaceRepeatList(target, item, key);
    } else if (item instanceof Object) {
      flatMap(target, item, key);
    } else {
      target[key] = item.toString();
    }
  }
}

function flatMap(target: { [key: string]: any }, params: { [key: string]: any }, prefix: string = '') {
  if (prefix) {
    prefix = prefix + '.';
  }
  let keys = Object.keys(params);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = params[key];
    key = prefix + key;
    if (typeof value === 'undefined' || value == null) {
      target[key] = '';
      continue;
    }

    if (Array.isArray(value)) {
      replaceRepeatList(target, value, key);
    } else if (value instanceof Object) {
      flatMap(target, value, key);
    } else {
      target[key] = value.toString();
    }
  }
  return target;
}

function filter(value: string): string {
  return value.replace(/[\t\n\r\f]/g, ' ');
}

function getCanonicalizedHeaders(headers: { [key: string]: string }): string {
  const prefix = 'x-acs-';
  const keys = Object.keys(headers);

  const canonicalizedKeys = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key.startsWith(prefix)) {
      canonicalizedKeys.push(key);
    }
  }

  canonicalizedKeys.sort();

  var result = '';
  for (let i = 0; i < canonicalizedKeys.length; i++) {
    const key = canonicalizedKeys[i];
    result += `${key}:${filter(headers[key]).trim()}\n`;
  }

  return result;
}

function getCanonicalizedResource(uriPattern: string, query: { [key: string]: string }): string {
  const keys = Object.keys(query).sort();

  if (keys.length === 0) {
    return uriPattern;
  }

  var result = [];
  for (var i = 0; i < keys.length; i++) {
    const key = keys[i];
    result.push(`${key}=${query[key]}`);
  }

  return `${uriPattern}?${result.join('&')}`;
}

function encode(str: string) {
  var result = encodeURIComponent(str);

  return result.replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
}

function normalize(params: { [key: string]: any }) {
  var list = [];
  var flated: { [key: string]: string } = {};
  flatMap(flated, params);
  var keys = Object.keys(flated).sort();
  for (let i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = flated[key];
    list.push([encode(key), encode(value)]);
  }
  return list;
}

function canonicalize(normalized: any[]) {
  var fields = [];
  for (var i = 0; i < normalized.length; i++) {
    var [key, value] = normalized[i];
    fields.push(key + '=' + value);
  }
  return fields.join('&');
}

function isModelClass(t: any): boolean {
  if (!t) {
    return false;
  }
  return typeof t.types === 'function' && typeof t.names === 'function';
}

function isObjectOrArray(t: any): boolean {
  return Array.isArray(t) || (t instanceof Object && typeof t !== 'function');
}

function toMap(input: any) {
  if (!isObjectOrArray(input)) {
    return null;
  } else if (input instanceof $tea.Model) {
    return $tea.toMap(input);
  } else if (Array.isArray(input)) {
    const result = [];
    input.forEach((value) => {
      if (isObjectOrArray(value)) {
        result.push(toMap(value));
      } else {
        result.push(value);
      }
    });

    return result;
  } else if (input instanceof Object) {
    const result = {};
    Object.entries(input).forEach(([key, value]) => {
      if (isObjectOrArray(value)) {
        result[key] = toMap(value);
      } else {
        result[key] = value;
      }
    });

    return result;
  }
}

export default class Client {
  /**
   * Convert all params of body other than type of readable into content 
   * @param input source Model
   * @param output target Model
   * @return void
   */
  static convert(input: $tea.Model, output: $tea.Model): void {
    if (!output) {
      return;
    }
    let inputModel = Object.assign({}, input);
    let constructor = <any>output.constructor;
    let types = constructor.types();
    // let constructor = <any>output.constructor;
    for (let key of Object.keys(constructor.names())) {
      if (inputModel[key]) {
        if (isModelClass(types[key])) {
          output[key] = new types[key](output[key]);
          Client.convert(inputModel[key], output[key]);
          continue;
        }
        output[key] = inputModel[key];
      }
    }
  }

  /**
   * Get the string to be signed according to request
   * @param request  which contains signed messages
   * @return the signed string
   */
  static getStringToSign(request: $tea.Request): string {
    const method = request.method;
    const accept = request.headers['accept'];
    const contentMD5 = request.headers['content-md5'] || '';
    const contentType = request.headers['content-type'] || '';
    const date = request.headers['date'] || '';
    const header = `${method}\n${accept}\n${contentMD5}\n${contentType}\n${date}\n`;
    const canonicalizedHeaders = getCanonicalizedHeaders(request.headers);
    const canonicalizedResource = getCanonicalizedResource(request.pathname, request.query);

    return `${header}${canonicalizedHeaders}${canonicalizedResource}`;
  }

  /**
   * Get signature according to stringToSign, secret
   * @param stringToSign  the signed string
   * @param secret accesskey secret
   * @return the signature
   */
  static getROASignature(stringToSign: string, secret: string): string {
    const utf8Buff = Buffer.from(stringToSign, 'utf8');
    return kitx.sha1(utf8Buff, secret, 'base64') as string;
  }

  /**
   * Parse filter into a form string
   * @param filter object
   * @return the string
   */
  static toForm(filter: { [key: string]: any }): string {
    if (!filter) {
      return '';
    }
    let target = {};
    flatMap(target, filter);
    return Util.toFormString(target);
  }

  /**
   * Get timestamp
   * @return the timestamp string
   */
  static getTimestamp(): string {
    let date = new Date();
    let YYYY = date.getUTCFullYear();
    let MM = kitx.pad2(date.getUTCMonth() + 1);
    let DD = kitx.pad2(date.getUTCDate());
    let HH = kitx.pad2(date.getUTCHours());
    let mm = kitx.pad2(date.getUTCMinutes());
    let ss = kitx.pad2(date.getUTCSeconds());
    return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
  }

  /**
   * Parse filter into a object which's type is map[string]string
   * @param filter query param
   * @return the object
   */
  static query(filter: {[key: string]: any}): {[key: string ]: string} {
    if (!filter) {
      return {};
    }
    let ret: { [key: string]: string } = {};
    flatMap(ret, filter);
    return ret;
  }

  /**
   * Get signature according to signedParams, method and secret
   * @param signedParams params which need to be signed
   * @param method http method e.g. GET
   * @param secret AccessKeySecret
   * @return the signature
   */
  static getRPCSignature(signedParams: {[key: string ]: string}, method: string, secret: string): string {
    var normalized = normalize(signedParams);
    var canonicalized = canonicalize(normalized);
    var stringToSign = `${method}&${encode('/')}&${encode(canonicalized)}`;
    const key = secret + '&';
    return <string>kitx.sha1(stringToSign, key, 'base64');
  }

  /**
   * Parse array into a string with specified style
   * @param array the array
   * @param prefix the prefix string
   * @style specified style e.g. repeatList
   * @return the string
   */
  static arrayToStringWithSpecifiedStyle(array: any[], prefix: string, style: string): string {
    if (!array) {
      return '';
    }
    if (style === 'repeatList') {
      let target = {};
      replaceRepeatList(target, array, prefix);
      return querystring.stringify(target, '&&');
    } else if (style === 'json') {
      return JSON.stringify(array);
    } else if (style === 'simple') {
      return array.join(',');
    } else if (style === 'spaceDelimited') {
      return array.join(' ');
    } else if (style === 'pipeDelimited') {
      return array.join('|');
    } else{
      return '';
    }
  }

  /**
   * Transform input as map.
   */
  static parseToMap(input: any): {[key: string]: any} {
    return toMap(input);
  }
}
